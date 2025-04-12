import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { query } = await request.json();
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    // Call IndianKanoon API
    const apiKey = process.env.INDIANKANOON_API_KEY;
    const formData = new URLSearchParams();
    formData.append('formInput', query);
    formData.append('pagenum', '0');

    const response = await fetch(
      'https://api.indiankanoon.org/search/',
      {
        method: 'POST',
        headers: {
          'Authorization': `Token ${apiKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from IndianKanoon API');
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Judgment search error:', error);
    return NextResponse.json(
      { error: 'Failed to search judgments', details: error.message },
      { status: 500 }
    );
  }
}