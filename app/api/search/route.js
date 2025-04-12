// import { NextResponse } from 'next/server';
// import axios from 'axios';
// import OpenAI from 'openai';

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY
// });

// // Helper function to detect OOUM-related questions
// const isAboutOOUM = (query) => {
//     const ooumKeywords = [
//         'who are you', 'what are you', 'your name', 
//         'which ai', 'what technology', 'what model',
//         'what system', 'ooum', 'who made you'
//     ];
//     return ooumKeywords.some(kw => query.toLowerCase().includes(kw));
// };

// // Optimized legal question detection
// const isLegalQuestion = async (query) => {
//     if (isAboutOOUM(query)) return false;
    
//     const legalTerms = ['legal', 'law', 'act', 'section', 'ipc', 'crpc', 'constitution'];
//     if (legalTerms.some(term => query.toLowerCase().includes(term))) {
//         return true;
//     }

//     try {
//         const response = await openai.chat.completions.create({
//             model: "gpt-3.5-turbo",
//             messages: [{
//                 role: "system",
//                 content: "Determine if this query requires Indian legal information. Reply ONLY with 'true' or 'false'."
//             }, {
//                 role: "user",
//                 content: query
//             }],
//             temperature: 0,
//             max_tokens: 1
//         });
//         return response.choices[0].message.content?.trim().toLowerCase() === 'true';
//     } catch (error) {
//         console.error('AI detection failed, defaulting to non-legal', error);
//         return false;
//     }
// };

// export async function POST(request) {
//     try {
//         const { query } = await request.json();
        
//         if (!query || typeof query !== 'string') {
//             return NextResponse.json(
//                 { error: "Please provide a valid query." },
//                 { status: 400 }
//             );
//         }

//         // Handle OOUM-related questions
//         if (isAboutOOUM(query)) {
//             return NextResponse.json({
//                 response: "I'm OOUM AI, a specialized artificial intelligence assistant for Indian legal matters and general queries.",
//                 isLegal: false,
//                 source: "ooum"
//             });
//         }

//         // Determine if legal question
//         const shouldUseIndianKanoon = await isLegalQuestion(query);
        
//         if (!shouldUseIndianKanoon) {
//             const completion = await openai.chat.completions.create({
//                 model: "gpt-3.5-turbo",
//                 messages: [{
//                     role: "system",
//                     content: "You are OOUM AI, a helpful assistant. Answer concisely (2-3 sentences max) and professionally."
//                 }, {
//                     role: "user",
//                     content: query
//                 }],
//                 temperature: 0.7,
//                 max_tokens: 150
//             });
            
//             return NextResponse.json({
//                 response: completion.choices[0].message.content,
//                 isLegal: false,
//                 source: "ooum"
//             });
//         }

//         // Handle legal questions with IndianKanoon (using POST)
//         const apiKey = process.env.INDIANKANOON_API_KEY;
//         if (!apiKey) {
//             throw new Error('IndianKanoon API key not configured');
//         }

//         // Using POST with form-urlencoded data
//         const searchResponse = await axios.post(
//             'https://api.indiankanoon.org/search/',
//             new URLSearchParams({
//                 formInput: query,
//                 pagenum: '0'
//             }),
//             { 
//                 headers: { 
//                     'Authorization': `Token ${apiKey}`,
//                     'Content-Type': 'application/x-www-form-urlencoded'
//                 },
//                 timeout: 10000
//             }
//         );
//         if (!searchResponse.data.docs?.length) {
//             return NextResponse.json(
//                 { 
//                     response: "No relevant legal documents found. Try using specific legal terms or sections.",
//                     isLegal: true,
//                     source: "indiankanoon"
//                 },
//                 { status: 404 }
//             );
//         }

//         // Fetch document using POST
//         const docid = searchResponse.data.docs[0].docid;
//         const docResponse = await axios.post(
//             `https://api.indiankanoon.org/doc/${docid}/`,
//             null, // No body needed for document fetch
//             { 
//                 headers: { 
//                     'Authorization': `Token ${apiKey}`
//                 },
//                 timeout: 5000 
//             }
//         );

//         // Process and summarize legal text
//         const legalText = docResponse.data.doc
//             .substring(0, 3000)
//             .replace(/\s+/g, ' ')
//             .trim();
        
//         const summary = await openai.chat.completions.create({
//             model: "gpt-3.5-turbo",
//             messages: [{
//                 role: "system",
//                 content: "As a legal assistant, summarize this Indian legal document in 3-5 bullet points:\n1. Key principles\n2. Relevant sections\n3. Practical implications"
//             }, {
//                 role: "user",
//                 content: `Title: ${searchResponse.data.docs[0].title}\nCourt: ${searchResponse.data.docs[0].court || 'Not specified'}\n\nText: ${legalText}`
//             }],
//             temperature: 0.3,
//             max_tokens: 300
//         });

//         return NextResponse.json({
//             title: searchResponse.data.docs[0].title,
//             content: summary.choices[0].message.content,
//             docid,
//             court: searchResponse.data.docs[0].court || 'Not specified',
//             isLegal: true,
//             source: "indiankanoon"
//         });

//     } catch (error) {
//         console.error('API Error:', error);
//         return NextResponse.json(
//             { 
//                 response: error.response?.status === 404 
//                     ? "Legal database unavailable. Please try later."
//                     : "Technical difficulties. Please try again.",
//                 isLegal: false,
//                 source: "error"
//             },
//             { status: error.response?.status || 500 }
//         );
//     }
// }

import { NextResponse } from 'next/server';
import axios from 'axios';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Helper functions
const isAboutOOUM = (query) => {
    const ooumKeywords = [
        'who are you', 'what are you', 'your name', 
        'which ai', 'what technology', 'what model',
        'what system', 'ooum', 'who made you'
    ];
    return ooumKeywords.some(kw => query.toLowerCase().includes(kw));
};

const isLegalQuestion = async (query) => {
    if (isAboutOOUM(query)) return false;
    
    const legalTerms = ['legal', 'law', 'act', 'section', 'ipc', 'crpc', 'constitution'];
    if (legalTerms.some(term => query.toLowerCase().includes(term))) {
        return true;
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "system",
                content: "Determine if this query requires Indian legal information. Reply ONLY with 'true' or 'false'."
            }, {
                role: "user",
                content: query
            }],
            temperature: 0,
            max_tokens: 1
        });
        return response.choices[0].message.content?.trim().toLowerCase() === 'true';
    } catch (error) {
        console.error('AI detection failed, defaulting to non-legal', error);
        return false;
    }
};

const simplifyLegalText = async (text, context) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "system",
                content: `You are a legal expert simplifying complex Indian legal text for laypersons. Provide:
1. Key legal principles in simple terms
2. Relevant sections/laws mentioned
3. Practical implications
Use bullet points and plain language.`
            }, {
                role: "user",
                content: `Context: ${context}\n\nLegal Text: ${text.substring(0, 3000)}`
            }],
            temperature: 0.3,
            max_tokens: 500
        });
        return response.choices[0].message.content;
    } catch (error) {
        console.error('Failed to simplify legal text', error);
        return text.substring(0, 500) + (text.length > 500 ? '...' : ''); // Fallback
    }
};

export async function POST(request) {
    try {
        const { query } = await request.json();
        
        if (!query || typeof query !== 'string') {
            return NextResponse.json(
                { error: "Please provide a valid query." },
                { status: 400 }
            );
        }

        // Handle OOUM-related questions
        if (isAboutOOUM(query)) {
            return NextResponse.json({
                response: "I'm OOUM AI, a specialized assistant for Indian legal matters and general queries.",
                isLegal: false,
                source: "ooum"
            });
        }

        // Determine if legal question
        const shouldUseIndianKanoon = await isLegalQuestion(query);
        
        if (!shouldUseIndianKanoon) {
            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{
                    role: "system",
                    content: "You are OOUM AI, a helpful assistant. Answer concisely (2-3 sentences) in simple, clear language."
                }, {
                    role: "user",
                    content: query
                }],
                temperature: 0.7,
                max_tokens: 200
            });
            
            return NextResponse.json({
                response: completion.choices[0].message.content,
                isLegal: false,
                source: "ooum"
            });
        }

        // Handle legal questions with IndianKanoon API
        const apiKey = process.env.INDIANKANOON_API_KEY;
        if (!apiKey) {
            throw new Error('IndianKanoon API key not configured');
        }

        // Search IndianKanoon (using POST as per documentation)
        const searchResponse = await axios.post(
            'https://api.indiankanoon.org/search/',
            new URLSearchParams({
                formInput: query,
                pagenum: '0'
            }),
            { 
                headers: { 
                    'Authorization': `Token ${apiKey}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                timeout: 10000
            }
        );

        const data = searchResponse.data;

        if (!data.docs || !data.docs.length) {
            return NextResponse.json(
                { 
                    response: "No relevant legal documents found. Try being more specific or use legal terms like 'IPC Section 302'.",
                    isLegal: true,
                    source: "indiankanoon"
                },
                { status: 404 }
            );
        }

        // Process the first document (most relevant)
        const primaryDoc = data.docs[0];
        const docResponse = await axios.post(
            `https://api.indiankanoon.org/doc/${primaryDoc.tid}/`,
            null,
            { 
                headers: { 
                    'Authorization': `Token ${apiKey}`
                },
                timeout: 5000 
            }
        );

        // Generate simplified summary
        const simplifiedSummary = await simplifyLegalText(
            docResponse.data.doc,
            `Document: ${primaryDoc.title}\nCourt: ${primaryDoc.docsource}`
        );

        // Process filters/categories
        const filters = data.categories.map(category => ({
            name: category[0],
            options: category[1].map(item => ({
                label: item.value,
                value: item.formInput
            }))
        }));

        // Process related documents
        const relatedDocs = data.docs.slice(0, 5).map(doc => ({
            id: doc.tid,
            title: doc.title,
            snippet: doc.headline,
            source: doc.docsource,
            citation: doc.citation,
            date: doc.publishdate,
            url: `https://indiankanoon.org/doc/${doc.tid}/`
        }));

    // Replace the final return statement with:
return NextResponse.json({
    response: simplifiedSummary, // Only return the AI-processed summary
    isLegal: true,
    source: "indiankanoon",
    metadata: { // Minimal metadata for chat display
      title: primaryDoc.title,
      source: primaryDoc.docsource,
      citation: primaryDoc.citation,
      url: `https://indiankanoon.org/doc/${primaryDoc.tid}/`,
      docId: primaryDoc.tid // Add this for optional deep-linking
    },
    // REMOVE THESE to prevent polluting judgments tab:
    // filters,
    // relatedDocs,
    // totalResults
  });

    } catch (error) {
        console.error('API Error:', error);
        
        // Fallback to OpenAI if IndianKanoon fails
        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{
                    role: "system",
                    content: "The legal database is unavailable. Provide a general answer to this query."
                }, {
                    role: "user",
                    content: query
                }],
                temperature: 0.7
            });
            
            return NextResponse.json({
                response: completion.choices[0].message.content,
                isLegal: false,
                source: "fallback",
                error: "Legal database unavailable"
            });
        } catch (fallbackError) {
            return NextResponse.json(
                { 
                    response: "Sorry, we're experiencing technical difficulties. Please try again later.",
                    isLegal: false,
                    source: "error"
                },
                { status: 500 }
            );
        }
    }
}
