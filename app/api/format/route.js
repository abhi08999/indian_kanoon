// app/api/format/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { text, fontFamily, fontSize, lineHeight } = await request.json();
    
    // Here you can implement any server-side formatting logic
    // For now, we'll just return the text as-is
    const formattedText = text;
    
    return NextResponse.json({
      success: true,
      formattedText,
      fontFamily,
      fontSize,
      lineHeight
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}