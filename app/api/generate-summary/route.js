// import { NextResponse } from 'next/server';
// import OpenAI from 'openai';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function POST(request) {
//   try {
//     const { title, content } = await request.json();
    
//     if (!title || !content) {
//       return NextResponse.json(
//         { error: 'Title and content are required' },
//         { status: 400 }
//       );
//     }

//     // Generate summary using OpenAI
//     const completion = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo',
//       messages: [
//         {
//           role: 'system',
//           content: `You are a legal expert summarizing Indian court judgments. Provide a concise summary with:
// 1. Key legal principles
// 2. Important facts
// 3. Court's decision
// 4. Legal impact
// Use bullet points and plain language. Keep it under 200 words.`
//         },
//         {
//           role: 'user',
//           content: `Title: ${title}\n\nContent: ${content.substring(0, 3000)}`
//         }
//       ],
//       temperature: 0.3,
//       max_tokens: 300,
//     });

//     const summary = completion.choices[0].message.content;
//     return NextResponse.json({ summary });

//   } catch (error) {
//     console.error('Summary generation error:', error);
//     return NextResponse.json(
//       { error: 'Failed to generate summary', details: error.message },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { title, content } = await request.json();
    
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Generate summary using OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a senior Indian legal expert. Generate a comprehensive yet concise summary strictly in this format:

CASE TITLE: [Judgment title]

KEY DETAILS:
• Court: [Court name]
• Bench: [Bench details if available]
• Date: [Judgment date]
• Case No: [Case number if available]
• Citations: [Relevant citations]

LEGAL PROVISIONS:
• [Relevant section/act 1]
• [Relevant section/act 2]

ISSUES CONSIDERED:
1. [First legal issue]
2. [Second legal issue]

KEY ARGUMENTS:
Petitioner:
• [Main argument 1]
• [Main argument 2]

Respondent:
• [Main argument 1]
• [Main argument 2]

COURT'S ANALYSIS:
• [Key observation 1]
• [Key observation 2]

FINAL DECISION:
• [Operative part of judgment]
• [Relief granted/dismissed]

LEGAL IMPACT:
• [Precedent value]
• [Impact on jurisprudence]

STRICT RULES:
1. Use this exact section structure
2. Each bullet point must be a single, concise sentence
3. Include all relevant laws/sections
4. Highlight landmark aspects
5. Maintain neutral, professional tone
6. Keep total summary under 300 words`
        },
        {
          role: 'user',
          content: `Judgment Title: ${title}\n\nFull Text: ${content.substring(0, 4000)}` // Increased token limit
        }
      ],
      temperature: 0.1, // Very low for factual accuracy
      max_tokens: 600,
    });

    const summary = completion.choices[0].message.content;
    return NextResponse.json({ summary });

  } catch (error) {
    console.error('Summary generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary', details: error.message },
      { status: 500 }
    );
  }
}