// /app/api/trigger-zap/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[Trigger-Zap] Received Payload:", body);

    const { userId, cardId, imagePrompt } = body;

    // Log individual fields for diagnosis
    console.log("→ userId:", userId);
    console.log("→ cardId:", cardId);
    console.log("→ imagePrompt:", imagePrompt);

    // Defensive: trim strings just in case
    const safeUserId = (userId || "").trim();
    const safeCardId = (cardId || "").trim();
    const safePrompt = (imagePrompt || "").trim();

    if (!safeUserId || !safeCardId || !safePrompt) {
      console.warn("[Trigger-Zap] Missing required field(s)");
      return NextResponse.json({
        error: 'Missing required fields.',
        details: { userId: safeUserId, cardId: safeCardId, imagePrompt: safePrompt }
      }, { status: 400 });
    }

    console.log("📤 Sending to Zapier:", { safeUserId, safeCardId, safePrompt });

    const zapierResponse = await fetch('https://hooks.zapier.com/hooks/catch/18620594/2vsp223/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: safeUserId,
        cardId: safeCardId,
        imagePrompt: safePrompt
      })
    });

    const zapierText = await zapierResponse.text();
    console.log("📥 Zapier responded with:", zapierText);

    if (!zapierResponse.ok) {
      console.error('❌ Zapier webhook failed:', zapierText);
      return NextResponse.json({ error: 'Failed to trigger Zapier', detail: zapierText }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('❗ Trigger Zapier unexpected error:', err);
    return NextResponse.json({
      error: 'Unexpected error',
      message: (err as Error).message
    }, { status: 500 });
  }
}
