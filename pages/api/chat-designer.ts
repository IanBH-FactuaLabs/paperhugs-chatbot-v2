import type { NextApiRequest, NextApiResponse } from 'next';
import { prompts } from '../../lib/prompts';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { messages } = req.body;

  try {
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
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1500
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? 'Sorry, something went wrong.';

    let action = null;
    let imagePrompt = null;

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

    res.status(200).json({ reply: content, action, imagePrompt });
  } catch (err) {
    console.error('GPT error:', err);
    res.status(500).json({ error: 'Unexpected GPT error', message: (err as Error).message });
  }
}
