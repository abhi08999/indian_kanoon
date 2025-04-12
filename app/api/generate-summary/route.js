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
          content: `You are a legal expert summarizing Indian court judgments. Provide a concise summary with:
1. Key legal principles
2. Important facts
3. Court's decision
4. Legal impact
Use bullet points and plain language. Keep it under 200 words.`
        },
        {
          role: 'user',
          content: `Title: ${title}\n\nContent: ${content.substring(0, 3000)}`
        }
      ],
      temperature: 0.3,
      max_tokens: 300,
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