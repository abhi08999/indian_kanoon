import { TranslationServiceClient } from '@google-cloud/translate';
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

let translationClient;

async function initializeTranslationClient() {
  if (!translationClient) {
    try {
      // const credentialsPath = path.join(process.cwd(), process.env.GOOGLE_APPLICATION_CREDENTIALS_PATH);
      // const credentials = JSON.parse(await fs.readFile(credentialsPath, 'utf8'));
       const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_PATH)
      
      translationClient = new TranslationServiceClient({
        credentials,
        projectId: process.env.GOOGLE_PROJECT_ID
      });
      
      // Test the connection
      await translationClient.getProjectId();
      return translationClient;
    } catch (err) {
      console.error('Client initialization failed:', err);
      throw new Error('Failed to initialize translation service');
    }
  }
  return translationClient;
}

export async function POST(request) {
  try {
    const client = await initializeTranslationClient();
    const formData = await request.formData();
    const file = formData.get('file');
    const targetLanguage = formData.get('targetLanguage');
    
    if (!file || !targetLanguage) {
      return NextResponse.json(
        { error: 'File and target language are required' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload PDF, DOCX, or TXT.' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    const fileBuffer = await file.arrayBuffer();
    const mimeType = file.type;

    console.log('Starting translation for:', file.name, 'to', targetLanguage);
    
    const [response] = await client.translateDocument({
      parent: `projects/${process.env.GOOGLE_PROJECT_ID}/locations/global`,
      sourceLanguageCode: null, // auto-detect
      targetLanguageCode: targetLanguage,
      documentInputConfig: {
        mimeType: mimeType,
        model: `projects/${process.env.GOOGLE_PROJECT_ID}/locations/global/models/general/nmt` ,
        content: Buffer.from(fileBuffer)
      },
      documentOutputConfig: {
        mimeType: mimeType, // preserve format
         model: 'premium' 
      }
    });

    console.log('Translation response:', JSON.stringify({
      hasTranslation: !!response.documentTranslation,
      mimeType: response.documentTranslation?.mimeType,
      byteStreamOutputs: response.documentTranslation?.byteStreamOutputs?.length,
      byteContentOutput: response.documentTranslation?.byteContentOutput?.length
    }, null, 2));

    // Handle both possible response formats
    let translatedContent;
    if (response.documentTranslation?.byteStreamOutputs?.length > 0) {
      translatedContent = response.documentTranslation.byteStreamOutputs[0];
    } else if (response.documentTranslation?.byteContentOutput) {
      translatedContent = response.documentTranslation.byteContentOutput;
    } else {
      console.error('Invalid response structure:', response);
      throw new Error('Translation service returned invalid response format');
    }

    // Convert to Buffer if needed
    if (!Buffer.isBuffer(translatedContent)) {
      translatedContent = Buffer.from(translatedContent);
    }

    return new NextResponse(translatedContent, {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="translated_${file.name}"`
      }
    });

  } catch (error) {
    console.error('Full translation error:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      details: error.details
    });
    
    return NextResponse.json(
      { 
        error: 'Translation failed',
        message: error.message,
        code: error.code || 'UNKNOWN_ERROR',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}