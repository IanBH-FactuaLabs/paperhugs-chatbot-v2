import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, accountId, cardId, imageUrl, imagePrompt } = body;

    if (!userId || !accountId || !cardId || !imageUrl) {
      console.warn('[proxy-zapier] ❌ Missing required fields', { userId, accountId, cardId, imageUrl });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const payload = { userId, accountId, cardId, imageUrl, imagePrompt };
    console.log('[proxy-zapier] Forwarding payload to Zapier:', payload);

    const zapierWebhookUrl = 'https://hooks.zapier.com/hooks/catch/18620594/uyot2sc/';

    const zapierRes = await fetch(zapierWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!zapierRes.ok) {
      const errorText = await zapierRes.text();
      console.error('[proxy-zapier] Zapier webhook failed:', errorText);
      return NextResponse.json({ error: 'Zapier request failed', detail: errorText }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[proxy-zapier] Unexpected error:', err);
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}
