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

//     // Replace the final return statement with:
// return NextResponse.json({
//     response: simplifiedSummary, // Only return the AI-processed summary
//     isLegal: true,
//     source: "indiankanoon",
//     metadata: { // Minimal metadata for chat display
//       title: primaryDoc.title,
//       source: primaryDoc.docsource,
//       citation: primaryDoc.citation,
//       url: `https://indiankanoon.org/doc/${primaryDoc.tid}/`,
//       docId: primaryDoc.tid // Add this for optional deep-linking
//     },
//     // REMOVE THESE to prevent polluting judgments tab:
//     // filters,
//     // relatedDocs,
//     // totalResults
//   });

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
import { NextResponse } from "next/server";
import axios from "axios";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// API Configurations
const INDIANKANOON_API_KEY = process.env.INDIANKANOON_API_KEY;
const GOOGLE_CSE_API_KEY = process.env.GOOGLE_CSE_API_KEY;
const GOOGLE_CSE_ID = process.env.GOOGLE_CSE_ID;

// Enhanced Legal Domains
const LEGAL_DOMAINS = [
  "indiankanoon.org", "legalserviceindia.com", "livelaw.in",
  "barandbench.com", "lawctopus.com", "taxmann.com", "ssrana.in",
  "scobserver.in", "theleaflet.in", "lawstreet.co", "vakilsearch.com"
];

// Comprehensive Legal Keywords
const LEGAL_TERMS = [
  // Basic legal terms
  "legal", "law", "act", "section", "article", "clause", "subsection",
  "ipc", "crpc", "cpc", "evidence act", "constitution", "contract",
  
  // Legal procedures
  "file", "complaint", "sue", "case", "petition", "appeal", "bail",
  "fir", "chargesheet", "affidavit", "summons", "warrant", "hearing",
  
  // Legal entities
  "court", "tribunal", "commission", "forum", "authority", "arbitration",
  
  // Legal professionals
  "lawyer", "advocate", "judge", "magistrate", "notary", "jurist",
  
  // Major legal categories
  "criminal", "civil", "property", "family", "labour", "consumer",
  "corporate", "tax", "cyber", "environmental", "constitutional",
  
  // Specific laws
  "hindu marriage", "negotiable instruments", "right to information",
  "motor vehicles", "companies", "goods and services", "information technology",
  
  // Common legal queries
  "rights", "duties", "liability", "compensation", "inheritance", "tenancy",
  "divorce", "maintenance", "cheque bounce", "sexual harassment"
];

// Non-legal topics to reject
const NON_LEGAL_KEYWORDS = [
  'weather', 'movie', 'sports', 'music', 'recipe',
  'celebrity', 'joke', 'game', 'shopping', 'travel',
  'restaurant', 'health', 'fitness', 'stock price', 'entertainment'
];

// Helper functions
const isAboutOOUM = (query) => {
  const ooumKeywords = [
    'who are you', 'what are you', 'your name',
    'which ai', 'what technology', 'what model',
    'what system', 'ooum', 'who made you'
  ];
  return ooumKeywords.some(kw => query.toLowerCase().includes(kw));
};

const isGreeting = (query) => {
  const greetings = [
    'hi', 'hello', 'hey', 'good morning', 'good afternoon', 
    'good evening', 'greetings', 'hi there', 'hello there'
  ];
  const normalizedQuery = query.toLowerCase().trim();
  return greetings.some(greeting => normalizedQuery === greeting);
};

const isLegalQuestion = async (query) => {
  if (isAboutOOUM(query) || isGreeting(query)) return false;

  // First reject clearly non-legal queries
  const hasNonLegalTerm = NON_LEGAL_KEYWORDS.some(term => 
    new RegExp(`\\b${term}\\b`, "i").test(query)
  );
  if (hasNonLegalTerm) return false;

  // Then check for legal terms
  const hasLegalTerm = LEGAL_TERMS.some(term =>
    new RegExp(`\\b${term}\\b`, "i").test(query)
  );
  if (hasLegalTerm) return true;

  // Final verification with AI
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system",
        content: `Does this query relate to Indian law matters? Consider:
        - All major legal domains (criminal, civil, corporate, etc.)
        - Legal procedures and remedies
        - Rights and duties under Indian law
        Reply ONLY 'true' or 'false'`
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

const fetchLegalSources = async (query) => {
  if (!GOOGLE_CSE_API_KEY || !GOOGLE_CSE_ID) {
    console.error('Google CSE credentials missing');
    return [];
  }

  try {
    const siteQuery = LEGAL_DOMAINS.map(d => `site:${d}`).join(' OR ');
    const response = await axios.get(
      "https://www.googleapis.com/customsearch/v1",
      {
        params: {
          q: `${query} (${siteQuery})`,
          key: GOOGLE_CSE_API_KEY,
          cx: GOOGLE_CSE_ID,
          num: 10,
          gl: "in",
          lr: "lang_en",
          safe: "active"
        },
        timeout: 10000,
      }
    );

    const domainMap = new Map();
    return (response.data.items || [])
      .filter(item => {
        try {
          const domain = new URL(item.link).hostname.replace("www.", "");
          if (LEGAL_DOMAINS.includes(domain) && !domainMap.has(domain)) {
            domainMap.set(domain, true);
            return true;
          }
          return false;
        } catch {
          return false;
        }
      })
      .slice(0, 3)
      .map(item => ({
        title: item.title || 'Legal Resource',
        url: item.link,
        description: item.snippet || 'Click to view this legal document',
        site: new URL(item.link).hostname.replace("www.", "")
      }));

  } catch (error) {
    console.error("Google CSE Error:", error.response?.data || error.message);
    return [];
  }
};

const simplifyLegalText = async (text, question) => {
  try {
    // Detect question type
    const isYesNo = /^(can|could|does|is|are|do)/i.test(question);
    const isPunishmentQuery = /punishment|sentence|jail|fine|penalty/i.test(question);
    const isProcedureQuery = /process|procedure|steps|file|register/i.test(question);
    const isDefinitionQuery = /what is|define|explain|meaning/i.test(question);

    // Enhanced prompt templates
    let prompt;
    if (isPunishmentQuery) {
      prompt = `Structure response as:
      PUNISHMENT: [Exact punishment under law]
      
      LEGAL BASIS:
      • [Relevant section]
      • [Key case law]
      
      DETERMINING FACTORS:
      1. [Factor 1]
      2. [Factor 2]
      
      TYPICAL SCENARIOS:
      • [Scenario 1 with punishment]
      • [Scenario 2 with punishment]`;
    } 
    else if (isProcedureQuery) {
      prompt = `Structure response as:
      PROCESS: [Brief overview]
      
      REQUIRED STEPS:
      1. [Step 1]
      2. [Step 2]
      
      DOCUMENTS NEEDED:
      • [Document 1]
      • [Document 2]
      
      TIMELINE:
      • [Minimum time]
      • [Maximum time]`;
    }
    else if (isYesNo) {
      prompt = `Structure response as:
      ANSWER: [Yes/No]. [Brief reason]
      
      LEGAL BASIS:
      • [Relevant law]
      
      EXCEPTIONS:
      • [Exception 1]
      
      PRACTICAL ADVICE:
      • [Actionable tip]`;
    }
    else {
      prompt = `Structure response as:
      CONCEPT: [Clear definition]
      
      LEGAL PROVISIONS:
      • [Primary law]
      • [Supporting laws]
      
      KEY FEATURES:
      1. [Feature 1]
      2. [Feature 2]
      
      IMPORTANT NOTES:
      • [Warning/caution]`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: `${prompt}\n\nFor legal accuracy:
        - Always cite specific sections
        - Mention relevant case laws
        - Highlight practical implications
        - Use bullet points for readability`
      }, {
        role: "user",
        content: `Legal Question: ${question}\nRelevant Text: ${text.substring(0, 3000)}`
      }],
      temperature: 0.2,
      max_tokens: 700
    });

    // Post-processing
    let answer = response.choices[0].message.content
      .replace(/\*\*/g, '')
      .replace(/#/g, '')
      .replace(/(PUNISHMENT|PROCESS|ANSWER|CONCEPT):/g, '\n$1:\n');

    // Add disclaimer for complex legal matters
    if (isPunishmentQuery || isProcedureQuery) {
      answer += "\n\nNote: For precise legal guidance, please consult a qualified advocate.";
    }

    return answer;

  } catch (error) {
    return `LEGAL RESPONSE UNAVAILABLE
    • System overloaded
    • Try rephrasing your query
    • For urgent matters, consult a lawyer`;
  }
};

// Main API Handler
export async function POST(request) {
  try {
    const { query } = await request.json();

    // Input Validation
    if (!query || typeof query !== "string" || query.trim().length < 1) {
      return NextResponse.json(
        { error: "Please provide a valid query." },
        { status: 400 }
      );
    }

    const trimmedQuery = query.trim();

    // Handle greetings
    if (isGreeting(trimmedQuery)) {
      return NextResponse.json({
        response: "Hello! I'm an AI legal assistant specializing in Indian law. How can I help you today?",
        isLegal: false,
        source: "ooum"
      });
    }

    // Handle OOUM-related questions
    if (isAboutOOUM(trimmedQuery)) {
      return NextResponse.json({
        response: "I'm OOUM AI, a specialized assistant for Indian legal matters across all domains.",
        isLegal: false,
        source: "ooum"
      });
    }

    // Strict legal question check
    const isLegal = await isLegalQuestion(trimmedQuery);
    if (!isLegal) {
      return NextResponse.json({
        response: "I specialize in Indian legal matters including:\n\n• Criminal Law (IPC, CrPC)\n• Civil Disputes\n• Consumer Protection\n• Corporate/Business Law\n• Family Law\n• Property Matters\n\nPlease ask a question related to these areas.",
        isLegal: false,
        source: "ooum"
      });
    }

    // Handle legal questions with IndianKanoon API
    if (!INDIANKANOON_API_KEY) {
      throw new Error('IndianKanoon API key not configured');
    }

    const [indianKanoonResult, webSources] = await Promise.all([
      (async () => {
        try {
          const searchRes = await axios.post(
            'https://api.indiankanoon.org/search/',
            new URLSearchParams({ formInput: trimmedQuery, pagenum: '0' }),
            {
              headers: {
                'Authorization': `Token ${INDIANKANOON_API_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              timeout: 10000
            }
          );

          if (!searchRes.data.docs?.length) {
            return {
              response: "No direct legal precedent found. This may require expert legal consultation.",
              metadata: null
            };
          }

          const primaryDoc = searchRes.data.docs[0];
          const docRes = await axios.post(
            `https://api.indiankanoon.org/doc/${primaryDoc.tid}/`,
            null,
            {
              headers: { 'Authorization': `Token ${INDIANKANOON_API_KEY}` },
              timeout: 8000
            }
          );

          return {
            response: await simplifyLegalText(docRes.data.doc, trimmedQuery),
            metadata: {
              title: primaryDoc.title,
              source: primaryDoc.docsource,
              citation: primaryDoc.citation,
              url: `https://indiankanoon.org/doc/${primaryDoc.tid}/`,
              date: primaryDoc.publishdate
            }
          };
        } catch (error) {
          console.error('IndianKanoon API Error:', error);
          return {
            response: "Legal resources currently unavailable. Please try again later or consult a lawyer.",
            metadata: null
          };
        }
      })(),
      fetchLegalSources(trimmedQuery)
    ]);

    return NextResponse.json({
      response: indianKanoonResult.response,
      isLegal: true,
      source: "indiankanoon",
      //metadata: indianKanoonResult.metadata,
      webSources: webSources
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        response: "Sorry, we're experiencing technical difficulties. For urgent legal matters, please consult a qualified advocate.",
        isLegal: false,
        source: "error"
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export const runtime = "edge";








