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

// import { NextResponse } from 'next/server';
// import axios from 'axios';
// import OpenAI from 'openai';

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY
// });

// // Helper functions
// const isAboutOOUM = (query) => {
//     const ooumKeywords = [
//         'who are you', 'what are you', 'your name', 
//         'which ai', 'what technology', 'what model',
//         'what system', 'ooum', 'who made you'
//     ];
//     return ooumKeywords.some(kw => query.toLowerCase().includes(kw));
// };

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

// const simplifyLegalText = async (text, context) => {
//     try {
//         const response = await openai.chat.completions.create({
//             model: "gpt-3.5-turbo",
//             messages: [{
//                 role: "system",
//                 content: `You are a legal expert simplifying complex Indian legal text for laypersons. Provide:
// 1. Key legal principles in simple terms
// 2. Relevant sections/laws mentioned
// 3. Practical implications
// Use bullet points and plain language.`
//             }, {
//                 role: "user",
//                 content: `Context: ${context}\n\nLegal Text: ${text.substring(0, 3000)}`
//             }],
//             temperature: 0.3,
//             max_tokens: 500
//         });
//         return response.choices[0].message.content;
//     } catch (error) {
//         console.error('Failed to simplify legal text', error);
//         return text.substring(0, 500) + (text.length > 500 ? '...' : ''); // Fallback
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
//                 response: "I'm OOUM AI, a specialized assistant for Indian legal matters and general queries.",
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
//                     content: "You are OOUM AI, a helpful assistant. Answer concisely (2-3 sentences) in simple, clear language."
//                 }, {
//                     role: "user",
//                     content: query
//                 }],
//                 temperature: 0.7,
//                 max_tokens: 200
//             });
            
//             return NextResponse.json({
//                 response: completion.choices[0].message.content,
//                 isLegal: false,
//                 source: "ooum"
//             });
//         }

//         // Handle legal questions with IndianKanoon API
//         const apiKey = process.env.INDIANKANOON_API_KEY;
//         if (!apiKey) {
//             throw new Error('IndianKanoon API key not configured');
//         }

//         // Search IndianKanoon (using POST as per documentation)
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

//         const data = searchResponse.data;

//         if (!data.docs || !data.docs.length) {
//             return NextResponse.json(
//                 { 
//                     response: "No relevant legal documents found. Try being more specific or use legal terms like 'IPC Section 302'.",
//                     isLegal: true,
//                     source: "indiankanoon"
//                 },
//                 { status: 404 }
//             );
//         }

//         // Process the first document (most relevant)
//         const primaryDoc = data.docs[0];
//         const docResponse = await axios.post(
//             `https://api.indiankanoon.org/doc/${primaryDoc.tid}/`,
//             null,
//             { 
//                 headers: { 
//                     'Authorization': `Token ${apiKey}`
//                 },
//                 timeout: 5000 
//             }
//         );

//         // Generate simplified summary
//         const simplifiedSummary = await simplifyLegalText(
//             docResponse.data.doc,
//             `Document: ${primaryDoc.title}\nCourt: ${primaryDoc.docsource}`
//         );

//         // Process filters/categories
//         const filters = data.categories.map(category => ({
//             name: category[0],
//             options: category[1].map(item => ({
//                 label: item.value,
//                 value: item.formInput
//             }))
//         }));

//         // Process related documents
//         const relatedDocs = data.docs.slice(0, 5).map(doc => ({
//             id: doc.tid,
//             title: doc.title,
//             snippet: doc.headline,
//             source: doc.docsource,
//             citation: doc.citation,
//             date: doc.publishdate,
//             url: `https://indiankanoon.org/doc/${doc.tid}/`
//         }));

//         return NextResponse.json({
//             response: simplifiedSummary,
//             isLegal: true,
//             source: "indiankanoon",
//             metadata: {
//                 title: primaryDoc.title,
//                 source: primaryDoc.docsource,
//                 citation: primaryDoc.citation,
//                 url: `https://indiankanoon.org/doc/${primaryDoc.tid}/`
//             },
//             filters,
//             relatedDocs,
//             totalResults: data.found
//         });

//     } catch (error) {
//         console.error('API Error:', error);
        
//         // Fallback to OpenAI if IndianKanoon fails
//         try {
//             const completion = await openai.chat.completions.create({
//                 model: "gpt-3.5-turbo",
//                 messages: [{
//                     role: "system",
//                     content: "The legal database is unavailable. Provide a general answer to this query."
//                 }, {
//                     role: "user",
//                     content: query
//                 }],
//                 temperature: 0.7
//             });
            
//             return NextResponse.json({
//                 response: completion.choices[0].message.content,
//                 isLegal: false,
//                 source: "fallback",
//                 error: "Legal database unavailable"
//             });
//         } catch (fallbackError) {
//             return NextResponse.json(
//                 { 
//                     response: "Sorry, we're experiencing technical difficulties. Please try again later.",
//                     isLegal: false,
//                     source: "error"
//                 },
//                 { status: 500 }
//             );
//         }
//     }
// }
import { NextResponse } from 'next/server';
import axios from 'axios';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Helper functions
const isAboutOOUM = (query) => {
    const ooumKeywords = [
        'who are you', 'what are you', 'your name',
        'which ai', 'what technology', 'what model',
        'what system', 'ooum', 'who made you',
    ];
    return ooumKeywords.some(kw => query.toLowerCase().includes(kw));
};

const isClearlyNonLegal = (query) => {
    const nonLegalPatterns = [
        /weather|temperature|forecast/i,
        /date|time|day today|calendar/i,
        /joke|funny|entertain|movie|music|sports/i,
        /how are you|what's up|hello|hi|hey/i,
        /recipe|cooking|food|restaurant/i,
        /news|headlines|current affairs/i,
        /calculate|math|addition|subtraction/i,
        /game|play|fun activity/i
    ];
    
    return nonLegalPatterns.some(pattern => pattern.test(query));
};

const containsLegalTerms = (query) => {
    const legalTerms = [
        // General legal terms
        'legal', 'law', 'act', 'section', 'article', 'clause', 'statute', 
        'regulation', 'ordinance', 'bill', 'legislation', 'judgment',
        'order', 'decree', 'verdict', 'ruling', 'right', 'duty',
        
        // Indian legal specific
        'ipc', 'crpc', 'cpc', 'evidence act', 'constitution', 'court',
        'judiciary', 'judge', 'justice', 'lawyer', 'advocate', 'attorney',
        'petition', 'plaint', 'suit', 'case', 'litigation', 'appeal',
        'bail', 'arrest', 'fir', 'complaint', 'affidavit', 'summons',
        'warrant', 'injunction', 'contempt', 'trial', 'hearing',
        
        // Fundamental rights specific
        'fundamental right', 'article 14', 'article 19', 'article 21',
        'right to equality', 'right to freedom', 'right against exploitation',
        'right to religion', 'cultural rights', 'constitutional remedies',
        
        // Divorce specific
        'divorce', 'marriage', 'maintenance', 'alimony', 'custody',
        'section 13', 'section 125', 'hindu marriage act',
        'dissolution', 'annulment', 'matrimonial', 'spousal',
        
        // Other common legal queries
        'property', 'inheritance', 'will', 'succession', 'partition',
        'lease', 'rent', 'eviction', 'tenancy', 'mortgage', 'loan',
        'fraud', 'cheating', 'theft', 'robbery', 'murder', 'assault'
    ];

    // Check for both individual terms and common legal question patterns
    const hasLegalTerm = legalTerms.some(term => {
        const regex = new RegExp(`\\b${term}\\b`, 'i');
        return regex.test(query);
    });

    // Check for common legal question patterns
    const isLegalPattern = [
        /what (are|is) the (laws?|rights?) (for|regarding|of)/i,
        /how to (file|get|apply for)/i,
        /procedure for/i,
        /(rights?|laws?) of/i,
        /(section|article) \d+/i,
        /(act|law) (of|for)/i
    ].some(pattern => pattern.test(query));

    return hasLegalTerm || isLegalPattern;
};

const isLegalQuestion = async (query) => {
    // Trim and lowercase the query for comparison
    const cleanQuery = query.toLowerCase().trim();
    
    // First check if it's about OOUM
    if (isAboutOOUM(cleanQuery)) return false;
    
    // Check for explicit non-legal intent
    if (isClearlyNonLegal(cleanQuery)) return false;

    // Special case: Fundamental rights queries
    if (/fundamental rights?/i.test(cleanQuery) || 
        /article (14|19|21)/i.test(cleanQuery) ||
        /right to (equality|freedom|life)/i.test(cleanQuery)) {
        return true;
    }

    // Special case: Divorce-related queries
    if (/divorce/i.test(cleanQuery) || 
        /marriage laws?/i.test(cleanQuery) ||
        /(alimony|maintenance)/i.test(cleanQuery)) {
        return true;
    }

    // Check for other clear legal patterns
    if (containsLegalTerms(cleanQuery)) {
        return true;
    }

    // Final verification with AI for ambiguous cases
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: `Determine if this query is about Indian law. Consider:
1. Is it asking about laws/rights/procedures?
2. Could it be answered with legal documents?
Reply ONLY with 'true' or 'false'. Example queries:
- "divorce laws?" → true
- "fundamental rights" → true
- "weather today" → false`,
                },
                { role: 'user', content: cleanQuery },
            ],
            temperature: 0,
            max_tokens: 1,
        });
        return response.choices[0].message.content?.trim().toLowerCase() === 'true';
    } catch (error) {
        console.error('AI detection failed, defaulting to legal', error);
        return true; // Default to legal to avoid false negatives
    }
};

const extractLegalEssence = async (query) => {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: `Convert this personal query into a general Indian legal question. Remove names and personal details. Focus on the core legal issue. Examples:
- "I'm Hardik Pandya recently divorced..." → "What are the laws regarding divorce in India?"
- "My landlord in Delhi is..." → "What are tenant rights against landlord harassment in India?"
- "My company isn't paying..." → "What are legal remedies for unpaid salary in India?"

Return ONLY the refined legal question.`,
                },
                { role: 'user', content: query },
            ],
            temperature: 0.2,
            max_tokens: 100,
        });
        
        const refinedQuery = response.choices[0].message.content.trim();
        return refinedQuery || query; // fallback to original if empty
    } catch (error) {
        console.error('Failed to extract legal essence', error);
        return query;
    }
};

const simplifyLegalText = async (text, context, query) => {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: `You are a legal expert simplifying complex Indian legal text for laypersons based on the user's query: "${query}". Provide:
1. Key legal principles in simple terms
2. Relevant sections/laws mentioned
3. Practical implications or examples
Use bullet points and plain language.`,
                },
                {
                    role: 'user',
                    content: `Context: ${context}\n\nLegal Text: ${text.substring(0, 3000)}`,
                },
            ],
            temperature: 0.3,
            max_tokens: 500,
        });
        return response.choices[0].message.content;
    } catch (error) {
        console.error('Failed to simplify legal text', error);
        return text.substring(0, 500) + (text.length > 500 ? '...' : '');
    }
};

// Main POST handler
export async function POST(request) {
    try {
        const { query, docId } = await request.json();

        // Handle document fetch request
        if (docId) {
            return await handleDocumentFetch(docId, query || 'Unknown query');
        }

        // Validate query
        if (!query || typeof query !== 'string') {
            return NextResponse.json(
                { error: 'Please provide a valid query.' },
                { status: 400 }
            );
        }

        // Handle OOUM-related questions
        if (isAboutOOUM(query)) {
            return NextResponse.json({
                response: "I'm OOUM AI, a specialized assistant for Indian legal matters.",
                isLegal: false,
                source: 'ooum',
            });
        }

        // Reject clearly non-legal questions
        if (isClearlyNonLegal(query)) {
            return NextResponse.json({
                response: "I specialize only in Indian legal matters. Please ask questions related to Indian laws, rights, or legal procedures.",
                isLegal: false,
                source: 'ooum',
            });
        }

        // Determine if it's a legal question
        const shouldUseIndianKanoon = await isLegalQuestion(query);

        if (!shouldUseIndianKanoon) {
            // Special case: If the query is very short but contains legal terms
            if (query.length < 15 && containsLegalTerms(query)) {
                // Proceed with IndianKanoon search
            } else {
                return NextResponse.json({
                    response: "This doesn't appear to be a legal question. I can only assist with Indian legal matters.",
                    isLegal: false,
                    source: 'ooum',
                });
            }
        }

        // Extract legal essence (for personal queries)
        let searchQuery = query;
        if (!containsLegalTerms(query)) {
            searchQuery = await extractLegalEssence(query);
        }

        // Handle legal questions with IndianKanoon API
        const apiKey = process.env.INDIANKANOON_API_KEY;
        if (!apiKey) {
            throw new Error('IndianKanoon API key not configured');
        }

        // Search IndianKanoon
        const searchResponse = await axios.post(
            'https://api.indiankanoon.org/search/',
            new URLSearchParams({
                formInput: searchQuery,
                pagenum: '0',
            }),
            {
                headers: {
                    'Authorization': `Token ${apiKey}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                timeout: 10000,
            }
        );

        const data = searchResponse.data;

        if (!data.docs || !data.docs.length) {
            // Fallback to OpenAI with general legal knowledge
            const fallbackResponse = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a legal expert on Indian law. Provide a concise, simplified answer to this legal query in plain language.',
                    },
                    { role: 'user', content: query },
                ],
                temperature: 0.3,
                max_tokens: 300,
            });
            return NextResponse.json({
                response: fallbackResponse.choices[0].message.content,
                isLegal: true,
                source: 'openai-fallback',
            });
        }

        // Get the most relevant document
        const relevantDoc = data.docs[0];

        // Fetch the full document
        const docResponse = await axios.post(
            `https://api.indiankanoon.org/doc/${relevantDoc.tid}/`,
            null,
            {
                headers: { 'Authorization': `Token ${apiKey}` },
                timeout: 5000,
            }
        );

        // Simplify the document content
        const simplifiedSummary = await simplifyLegalText(
            docResponse.data.doc,
            `Document: ${relevantDoc.title}\nCourt: ${relevantDoc.docsource}`,
            query
        );

        return NextResponse.json({
            response: simplifiedSummary,
            isLegal: true,
            source: 'indiankanoon',
            metadata: {
                title: relevantDoc.title,
                source: relevantDoc.docsource,
                citation: relevantDoc.citation,
                url: `https://indiankanoon.org/doc/${relevantDoc.tid}/`,
                date: relevantDoc.publishdate,
            },
            totalResults: data.found,
        });

    } catch (error) {
        console.error('API Error:', error);

        // Fallback to OpenAI if IndianKanoon fails
        try {
            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'The legal database is unavailable. Provide a general answer about Indian law to this query in plain language.',
                    },
                    { role: 'user', content: (await request.json()).query || 'Unknown query' },
                ],
                temperature: 0.7,
                max_tokens: 300,
            });

            return NextResponse.json({
                response: completion.choices[0].message.content,
                isLegal: false,
                source: 'fallback',
                error: 'Legal database unavailable',
            });
        } catch (fallbackError) {
            return NextResponse.json(
                {
                    response: 'Sorry, we\'re experiencing technical difficulties. Please try again later.',
                    isLegal: false,
                    source: 'error',
                },
                { status: 500 }
            );
        }
    }
}

// Helper function to fetch a specific document
async function handleDocumentFetch(docId, query) {
    try {
        const apiKey = process.env.INDIANKANOON_API_KEY;
        if (!apiKey) {
            throw new Error('IndianKanoon API key not configured');
        }

        const docResponse = await axios.post(
            `https://api.indiankanoon.org/doc/${docId}/`,
            null,
            {
                headers: { 'Authorization': `Token ${apiKey}` },
                timeout: 5000,
            }
        );

        const simplifiedSummary = await simplifyLegalText(
            docResponse.data.doc,
            `Document: ${docResponse.data.title}\nCourt: ${docResponse.data.docsource}`,
            query
        );

        return NextResponse.json({
            response: simplifiedSummary,
            isLegal: true,
            source: 'indiankanoon',
            metadata: {
                title: docResponse.data.title,
                source: docResponse.data.docsource,
                citation: docResponse.data.citation,
                url: `https://indiankanoon.org/doc/${docId}/`,
                date: docResponse.data.publishdate,
            },
        });
    } catch (error) {
        console.error('Document fetch error:', error);
        return NextResponse.json(
            {
                error: 'Failed to fetch document. Please try again later.',
                details: error.message,
            },
            { status: 500 }
        );
    }
}