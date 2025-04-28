// app/api/draft/route.js
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `
You are an expert Indian legal drafter with 20+ years of experience. Your task is to generate professional legal documents based on user requests. 

Follow these guidelines:
1. Use formal, precise legal language
2. Structure the document with appropriate sections
3. Include all necessary legal elements
4. Format with clear headings and proper spacing
5. Use Indian legal terminology and references to relevant Indian laws
6. Leave placeholders (in square brackets) for user-specific details
7. Ensure the document is legally valid for Indian jurisdiction

For petitions/complaints, include:
- Court details
- Parties information
- Jurisdiction
- Facts of the case
- Grounds for relief
- Prayer for relief
- Verification

For contracts/agreements, include:
- Parties details
- Recitals
- Definitions
- Terms and conditions
- Representations and warranties
- Termination clauses
- Governing law and jurisdiction
- Execution blocks
`;

export async function POST(request) {
  try {
    const { prompt } = await request.json();
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const draft = completion.choices[0]?.message?.content;
    
    if (!draft) {
      return NextResponse.json(
        { error: 'Failed to generate draft' },
        { status: 500 }
      );
    }

    return NextResponse.json({ draft });

  } catch (error) {
    console.error('Draft generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate draft' },
      { status: 500 }
    );
  }
}