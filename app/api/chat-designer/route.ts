import { NextRequest, NextResponse } from 'next/server';
import { prompts } from '@/lib/prompts';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo',
        messages: [
          { role: 'system', content: prompts.system },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? 'Sorry, something went wrong.';

    let action: string | null = null;
    let imagePrompt: string | null = null;

    try {
      const match = content.match(/\{.*"action":.*"generate_image".*"imagePrompt":\s*".*?"\s*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        action = parsed.action;
        imagePrompt = parsed.imagePrompt;
      }
    } catch {
      console.warn('No valid action metadata found.');
    }

    return NextResponse.json({ reply: content, action, imagePrompt });
  } catch (err) {
    console.error('GPT error:', err);
    return NextResponse.json(
      { error: 'Unexpected GPT error', message: (err as Error).message },
      { status: 500 }
    );
  }
}
