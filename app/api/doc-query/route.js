// // app/api/doc-query/route.js
// import { NextResponse } from "next/server";
// import { Pinecone } from "@pinecone-database/pinecone";
// import { OpenAIEmbeddings } from "@langchain/openai";
// import { ChatOpenAI } from "@langchain/openai";
// import { PromptTemplate } from "@langchain/core/prompts";
// import { LLMChain } from "langchain/chains";

// export async function POST(request) {
//   try {
//     const { query, fileId } = await request.json();

//     if (!query || !fileId) {
//       return NextResponse.json(
//         { error: "Missing query or fileId" },
//         { status: 400 }
//       );
//     }

//     // Initialize Pinecone
//     const pinecone = new Pinecone({
//       apiKey: process.env.PINECONE_API_KEY,
//     });
//     const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);

//     // Create embeddings for the query
//     const embeddings = new OpenAIEmbeddings({
//       openAIApiKey: process.env.OPENAI_API_KEY,
//     });
//     const queryEmbedding = await embeddings.embedQuery(query);

//     // Query Pinecone for relevant chunks
//     const results = await pineconeIndex.query({
//       vector: queryEmbedding,
//       topK: 5,
//       filter: { fileId },
//       includeMetadata: true,
//     });

//     if (!results.matches || results.matches.length === 0) {
//       return NextResponse.json({
//         response: "No relevant information found in the document for this query.",
//         citations: [],
//         summary: null
//       });
//     }

//     // Get the most relevant chunks
//     const relevantChunks = results.matches.map(match => ({
//       text: match.metadata.text,
//       page: match.metadata.pageNumber || 'N/A',
//     }));

//     // Initialize Chat Model - UPDATED TO ChatOpenAI
//     const model = new ChatOpenAI({
//       openAIApiKey: process.env.OPENAI_API_KEY,
//       temperature: 0.2,
//       modelName: "gpt-4",
//     });

//     // Create prompt template
//     const prompt = new PromptTemplate({
//       template: `
//       You are a legal document assistant. Answer the user's question based on the provided document excerpts.
//       Be precise and cite specific parts of the document when possible.

//       Question: {question}

//       Document Excerpts:
//       {context}

//       Instructions:
//       1. If the answer is directly in the excerpts, quote the relevant part
//       2. If you need to infer, clearly state it's an interpretation
//       3. If unsure, say you couldn't find definitive information
//       4. Format your response with clear paragraphs and bullet points when listing items
//       5. Include page numbers if available

//       Answer:
//       `,
//       inputVariables: ["question", "context"],
//     });

//     const chain = new LLMChain({ llm: model, prompt });
//     const context = relevantChunks.map((chunk, i) => 
//       `[Excerpt ${i + 1}, Page ${chunk.page}]:\n${chunk.text}`
//     ).join("\n\n");

//     const response = await chain.call({
//       question: query,
//       context,
//     });

//     // Generate a summary of the most relevant parts
//     const summaryPrompt = new PromptTemplate({
//       template: `
//       Summarize the most relevant parts of the document for this question: {question}
      
//       Excerpts:
//       {context}

//       Summary should be 3-5 bullet points highlighting key information.
//       `,
//       inputVariables: ["question", "context"],
//     });

//     const summaryChain = new LLMChain({ llm: model, prompt: summaryPrompt });
//     const summary = await summaryChain.call({
//       question: query,
//       context,
//     });

//     return NextResponse.json({
//       response: response.text,
//       citations: relevantChunks,
//       summary: summary.text
//     });

//   } catch (error) {
//     console.error('Document query error:', error);
//     return NextResponse.json(
//       {
//         response: "Sorry, I encountered an error processing your document query. Please try again.",
//         citations: [],
//         summary: null
//       },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { LLMChain } from "langchain/chains";

export async function POST(request) {
  try {
    const { query, fileId } = await request.json();

    if (!query || !fileId) {
      return NextResponse.json(
        { error: "Missing query or fileId" },
        { status: 400 }
      );
    }

    // Initialize Pinecone
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);

    // Create embeddings for the query
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
    const queryEmbedding = await embeddings.embedQuery(query);

    // Query Pinecone for relevant chunks
    const results = await pineconeIndex.query({
      vector: queryEmbedding,
      topK: 5,
      filter: { fileId },
      includeMetadata: true,
    });

    if (!results.matches || results.matches.length === 0) {
      return NextResponse.json({
        response: "I couldn't find any relevant information in the document that answers your question.",
        citations: [],
        summary: null
      });
    }

    // Get the most relevant chunks
    const relevantChunks = results.matches.map(match => ({
      text: match.metadata.text,
      page: match.metadata.pageNumber || 'N/A',
    }));

    // Initialize Chat Model
    const model = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0.2,
      modelName: "gpt-4",
    });

    // Create cleaner prompt template
    const prompt = new PromptTemplate({
      template: `
      You are a legal document assistant. Answer the user's question based on the provided document excerpts.
      
      Follow these guidelines:
      1. Provide a direct answer to the question without showing excerpt numbers
      2. Only reference page numbers when citing specific parts
      3. If the information isn't in the document, say so clearly
      4. Format your response in clear, natural language
      5. Use bullet points when listing multiple items

      Question: {question}

      Document Excerpts:
      {context}

      Answer:
      `,
      inputVariables: ["question", "context"],
    });

    const chain = new LLMChain({ llm: model, prompt });
    const context = relevantChunks.map(chunk => chunk.text).join("\n\n");

    const response = await chain.call({
      question: query,
      context,
    });

    // Generate a cleaner summary
    const summaryPrompt = new PromptTemplate({
      template: `
      Create a concise 3-5 bullet point summary of the most relevant information from these document excerpts that answers this question: {question}
      
      Excerpts:
      {context}

      - Only include information directly relevant to the question
      - Use natural language without excerpt references
      - Include page numbers in parentheses when citing specific parts
      `,
      inputVariables: ["question", "context"],
    });

    const summaryChain = new LLMChain({ llm: model, prompt: summaryPrompt });
    const summary = await summaryChain.call({
      question: query,
      context,
    });

    return NextResponse.json({
      response: response.text,
      citations: relevantChunks,
      summary: summary.text,
      fileUrl: relevantChunks[0]?.metadata?.fileUrl // Add this line
    });

  } catch (error) {
    console.error('Document query error:', error);
    return NextResponse.json(
      {
        response: "Sorry, I encountered an error processing your request. Please try again.",
        citations: [],
        summary: null
      },
      { status: 500 }
    );
  }
}