import { NextRequest, NextResponse } from 'next/server';
import { queryGrok } from '@/lib/xai';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON payload.' },
        { status: 400 }
      );
    }

    const { prompt, model, systemPrompt, temperature, maxTokens } = body || {};

    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return NextResponse.json(
        { error: 'Prompt is required.' },
        { status: 400 }
      );
    }

    const result = await queryGrok(prompt.trim(), {
      model,
      systemPrompt,
      temperature,
      maxTokens,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to generate AI response.' },
        { status: 502 }
      );
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('AI API Route Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
