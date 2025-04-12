import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { docId } = await request.json();
    
    if (!docId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }

    // Call IndianKanoon API for document details
    const apiKey = process.env.INDIANKANOON_API_KEY;
    const response = await fetch(
      `https://api.indiankanoon.org/doc/${docId}/`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Token ${apiKey}`,
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch document from IndianKanoon API');
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Document fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch judgment details', details: error.message },
      { status: 500 }
    );
  }
}