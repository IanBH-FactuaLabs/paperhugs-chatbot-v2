// File: /app/api/receive-image/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, cardId, imageUrl, revisionMessage } = body;

    if (!userId || !cardId || !imageUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Send to all listening tabs/clients
    const allClients = await self.clients.matchAll();
    for (const client of allClients) {
      client.postMessage({
        type: 'image-received',
        userId,
        cardId,
        imageUrl,
        revisionMessage
      });
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Error in receive-image POST handler:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
