import { NextRequest, NextResponse } from 'next/server';
import { getImage, storeImage } from '@/lib/imageStore';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const cardId = searchParams.get('cardId');

  if (!userId || !cardId) {
    return NextResponse.json({ error: 'Missing userId or cardId' }, { status: 400 });
  }

  const imageData = getImage(userId, cardId);

  if (!imageData) {
    return NextResponse.json({ status: 'pending' });
  }

  return NextResponse.json({
    status: 'complete',
    imageUrl: imageData.imageUrl,
    imagePrompt: imageData.imagePrompt,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, cardId, imageUrl, imagePrompt } = body;

    if (!userId || !cardId || !imageUrl || !imagePrompt) {
      return NextResponse.json({ error: 'Missing userId, cardId, imageUrl, or imagePrompt' }, { status: 400 });
    }

    storeImage(userId, cardId, imageUrl, imagePrompt);

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Error in /api/receive-image POST:', error);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 500 });
  }
}
