// // app/api/upload/route.js
// import { NextResponse } from "next/server";
// import { writeFile } from "fs/promises";
// import path from "path";
// import { v4 as uuidv4 } from 'uuid';
// import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
// import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
// import { TextLoader } from "langchain/document_loaders/fs/text";
// import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
// import { OpenAIEmbeddings } from "@langchain/openai";
// import { Pinecone } from "@pinecone-database/pinecone";

// // Helper to clean metadata for Pinecone compatibility
// const cleanMetadata = (originalMetadata) => {
//   const cleaned = {};
//   const metadata = originalMetadata || {};
  
//   for (const [key, value] of Object.entries(metadata)) {
//     if (value === null || value === undefined) continue;
    
//     // Handle basic types
//     if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
//       cleaned[key] = value;
//     } 
//     // Handle arrays of strings
//     else if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
//       cleaned[key] = value;
//     }
//     // Handle objects by stringifying them
//     else if (typeof value === 'object') {
//       try {
//         cleaned[key] = JSON.stringify(value);
//       } catch (e) {
//         console.warn(`Could not stringify metadata field ${key}`, value);
//       }
//     }
//     // Convert anything else to string
//     else {
//       cleaned[key] = String(value);
//     }
//   }
  
//   return cleaned;
// };

// export async function POST(request) {
//   try {
//     // 1. Handle file upload
//     const formData = await request.formData();
//     const file = formData.get('file');

//     if (!file) {
//       return NextResponse.json({ error: 'No files received.' }, { status: 400 });
//     }

//     // 2. Validate file type
//     const validTypes = [
//       'application/pdf',
//       'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//       'text/plain'
//     ];
    
//     if (!validTypes.includes(file.type)) {
//       return NextResponse.json(
//         { error: 'Invalid file type. Only PDF, DOCX, and TXT files are allowed.' },
//         { status: 400 }
//       );
//     }

//     // 3. Process file
//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);
//     const fileId = uuidv4();
//     const fileExtension = path.extname(file.name);
//     const fileName = `${fileId}${fileExtension}`;
//     const filePath = path.join(process.cwd(), 'uploads', fileName);

//     await writeFile(filePath, buffer);

//     // 4. Load document based on type
//     let loader;
//     try {
//       if (file.type === 'application/pdf') {
//         loader = new PDFLoader(filePath);
//       } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
//         loader = new DocxLoader(filePath);
//       } else {
//         loader = new TextLoader(filePath);
//       }
//     } catch (loaderError) {
//       console.error('Loader error:', loaderError);
//       return NextResponse.json(
//         { error: 'Failed to load document content' },
//         { status: 500 }
//       );
//     }

//     const rawDocs = await loader.load();

//     // 5. Split documents into chunks
//     const textSplitter = new RecursiveCharacterTextSplitter({
//       chunkSize: 1000,
//       chunkOverlap: 200,
//     });
    
//     const docs = await textSplitter.splitDocuments(rawDocs);

//     // 6. Prepare metadata with Pinecone-compatible values
//     const processedDocs = docs.map(doc => {
//       // Extract page number from loc if available
//       const pageNumber = doc.metadata?.loc?.pageNumber || 
//                         (doc.metadata?.loc ? 1 : undefined);
      
//       return {
//         pageContent: doc.pageContent,
//         metadata: {
//           ...cleanMetadata(doc.metadata),
//           fileId,
//           fileName: file.name,
//           text: doc.pageContent,  // Required field
//           chunkId: uuidv4(),      // Unique ID for each chunk
//           createdAt: new Date().toISOString(),
//           ...(pageNumber && { pageNumber }) // Only include if exists
//         }
//       };
//     });

//     // 7. Initialize Pinecone (serverless)
//     const pinecone = new Pinecone({
//       apiKey: process.env.PINECONE_API_KEY,
//     });
//     const index = pinecone.Index(process.env.PINECONE_INDEX);

//     // 8. Create embeddings
//     const embeddings = new OpenAIEmbeddings({
//       openAIApiKey: process.env.OPENAI_API_KEY,
//       modelName: "text-embedding-3-small"
//     });

//     // 9. Prepare vectors with cleaned metadata
//     const vectors = await Promise.all(
//       processedDocs.map(async (doc) => {
//         const embedding = await embeddings.embedQuery(doc.pageContent);
//         return {
//           id: doc.metadata.chunkId,
//           values: embedding,
//           metadata: cleanMetadata(doc.metadata) // Final cleanup
//         };
//       })
//     );

//     // 10. Upsert to Pinecone with validation
//     try {
//       // Validate vectors before upsert
//       vectors.forEach(v => {
//         if (!v.metadata.text) {
//           console.error('Missing required text field in metadata:', v.metadata);
//         }
//       });

//       const upsertResponse = await index.upsert(vectors);
//       console.log(`Successfully upserted ${vectors.length} vectors`);
      
//       return NextResponse.json({ 
//         success: true, 
//         fileId,
//         fileName: file.name,
//         fileSize: file.size,
//         fileType: file.type,
//         totalChunks: vectors.length
//       });
//     } catch (upsertError) {
//       console.error('Pinecone upsert error:', upsertError);
//       throw new Error(`Failed to store document in vector database: ${upsertError.message}`);
//     }

//   } catch (error) {
//     console.error('Document processing error:', error);
//     return NextResponse.json(
//       { error: error.message || 'An error occurred while processing the document' },
//       { status: 500 }
//     );
//   }
// }

// app/api/upload/route.js
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Pinecone } from "@pinecone-database/pinecone";
import fs from 'fs/promises';
import path from 'path';

// Helper to clean metadata for Pinecone compatibility
const cleanMetadata = (originalMetadata) => {
  const cleaned = {};
  const metadata = originalMetadata || {};
  
  for (const [key, value] of Object.entries(metadata)) {
    if (value === null || value === undefined) continue;
    
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      cleaned[key] = value;
    } 
    else if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
      cleaned[key] = value;
    }
    else if (typeof value === 'object') {
      try {
        cleaned[key] = JSON.stringify(value);
      } catch (e) {
        console.warn(`Could not stringify metadata field ${key}`, value);
      }
    }
    else {
      cleaned[key] = String(value);
    }
  }
  
  return cleaned;
};

// Local file storage simulation
const localBlobStorage = async (fileName, file, options) => {
  const uploadsDir = path.join(process.cwd(), 'uploads');
  try {
    await fs.mkdir(uploadsDir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }

  const filePath = path.join(uploadsDir, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);
  
  return { 
    url: `file://${filePath}`,
    pathname: fileName,
    downloadUrl: `file://${filePath}`
  };
};

// Determine storage method based on environment
const getStorageHandler = async () => {
  if (process.env.VERCEL_ENV === 'production') {
    const { put } = await import('@vercel/blob');
    return put;
  }
  return localBlobStorage;
};

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No files received.' }, { status: 400 });
    }

    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, DOCX, and TXT files are allowed.' },
        { status: 400 }
      );
    }

    // Upload file to appropriate storage
    const uploadFile = await getStorageHandler();
    const fileId = uuidv4();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${fileId}.${fileExtension}`;
    
    const blob = await uploadFile(fileName, file, { access: 'public' });
    const fileUrl = blob.url;

    // Load document content
    let loader;
    const filePath = process.env.VERCEL_ENV === 'production' 
      ? fileUrl 
      : fileUrl.replace('file://', '');

    try {
      if (file.type === 'application/pdf') {
        loader = new PDFLoader(filePath);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        loader = new DocxLoader(filePath);
      } else {
        loader = new TextLoader(filePath);
      }
    } catch (loaderError) {
      console.error('Loader error:', loaderError);
      return NextResponse.json(
        { error: 'Failed to load document content' },
        { status: 500 }
      );
    }

    // Process document
    const rawDocs = await loader.load();
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    
    const docs = await textSplitter.splitDocuments(rawDocs);

    // Prepare metadata
    const processedDocs = docs.map(doc => {
      const pageNumber = doc.metadata?.loc?.pageNumber || 
                        (doc.metadata?.loc ? 1 : undefined);
      
      return {
        pageContent: doc.pageContent,
        metadata: {
          ...cleanMetadata(doc.metadata),
          fileId,
          fileName: file.name,
          text: doc.pageContent,
          chunkId: uuidv4(),
          createdAt: new Date().toISOString(),
          fileUrl,
          ...(pageNumber && { pageNumber })
        }
      };
    });

    // Initialize Pinecone
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
    const index = pinecone.Index(process.env.PINECONE_INDEX);

    // Create embeddings
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "text-embedding-3-small"
    });

    // Prepare vectors
    const vectors = await Promise.all(
      processedDocs.map(async (doc) => {
        const embedding = await embeddings.embedQuery(doc.pageContent);
        return {
          id: doc.metadata.chunkId,
          values: embedding,
          metadata: cleanMetadata(doc.metadata)
        };
      })
    );

    // Upsert to Pinecone
    try {
      await index.upsert(vectors);
      
      return NextResponse.json({ 
        success: true, 
        fileId,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        fileUrl,
        totalChunks: vectors.length
      });
    } catch (upsertError) {
      console.error('Pinecone upsert error:', upsertError);
      throw new Error(`Failed to store document in vector database: ${upsertError.message}`);
    }

  } catch (error) {
    console.error('Document processing error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while processing the document' },
      { status: 500 }
    );
  }
}