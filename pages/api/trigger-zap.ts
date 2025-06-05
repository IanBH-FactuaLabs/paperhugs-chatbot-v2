import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { userId, cardId, imagePrompt } = req.body;

  if (!userId || !cardId || !imagePrompt) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    console.log('📤 Sending to Zapier:', { userId, cardId, imagePrompt }); // ✅ NEW

    const zapierResponse = await fetch('https://hooks.zapier.com/hooks/catch/18620594/2vsp223/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, cardId, imagePrompt })
    });

    const zapierText = await zapierResponse.text();
    console.log('📥 Zapier responded with:', zapierText); // ✅ NEW

    if (!zapierResponse.ok) {
      console.error('❌ Zapier error:', zapierText);
      return res.status(500).json({ error: 'Failed to trigger Zapier', detail: zapierText });
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('❗ Trigger Zapier error:', err);
    res.status(500).json({ error: 'Unexpected error', message: (err as Error).message });
  }
}
