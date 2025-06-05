import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  // Log the full incoming body
  console.log("[Trigger-Zap] Received Payload:", req.body);

  const { userId, cardId, imagePrompt } = req.body;

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
    return res.status(400).json({
      error: 'Missing required fields.',
      details: { userId: safeUserId, cardId: safeCardId, imagePrompt: safePrompt }
    });
  }

  try {
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
      return res.status(500).json({ error: 'Failed to trigger Zapier', detail: zapierText });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('❗ Trigger Zapier unexpected error:', err);
    return res.status(500).json({ error: 'Unexpected error', message: (err as Error).message });
  }
}
