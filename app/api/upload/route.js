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
import { put } from '@vercel/blob';
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

// Handle file storage based on environment
async function storeFile(fileName, file) {
  if (process.env.VERCEL_ENV === 'production') {
    // Production: Use Vercel Blob with token
    return await put(fileName, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN
    });
  } else {
    // Local development: Save to filesystem
    const uploadsDir = path.join(process.cwd(), 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });
    const filePath = path.join(uploadsDir, fileName);
    await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));
    return { url: `file://${filePath}` };
  }
}

// Get file data in appropriate format
async function getFileData(file, fileUrl) {
  if (process.env.VERCEL_ENV === 'production') {
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error(`Failed to download file: ${response.status}`);
    return await response.blob();
  }
  return new Blob([Buffer.from(await file.arrayBuffer())], { type: file.type });
}

export async function POST(request) {
  try {
    // 1. Handle file upload
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No files received.' }, { status: 400 });
    }

    // 2. Validate file type
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

    // 3. Store file (Blob or local)
    const fileId = uuidv4();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${fileId}.${fileExtension}`;
    
    const blob = await storeFile(fileName, file);
    const fileUrl = blob.url;

    // 4. Get file data in appropriate format
    const fileData = await getFileData(file, fileUrl);

    // 5. Load document content
    let loader;
    try {
      if (file.type === 'application/pdf') {
        loader = new PDFLoader(fileData);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        loader = new DocxLoader(fileData);
      } else {
        loader = new TextLoader(fileData);
      }
    } catch (loaderError) {
      console.error('Loader error:', loaderError);
      return NextResponse.json(
        { error: 'Failed to load document content' },
        { status: 500 }
      );
    }

    const rawDocs = await loader.load();

    // 6. Split documents into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    
    const docs = await textSplitter.splitDocuments(rawDocs);

    // 7. Prepare metadata with Pinecone-compatible values
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

    // 8. Initialize Pinecone
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
    const index = pinecone.Index(process.env.PINECONE_INDEX);

    // 9. Create embeddings
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "text-embedding-3-small"
    });

    // 10. Prepare vectors with cleaned metadata
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

    // 11. Upsert to Pinecone
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