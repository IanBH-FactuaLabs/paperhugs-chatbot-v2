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
    imagePrompt: imageData.imagePrompt
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('[receive-image POST] Incoming body:', body);

    const userId = (body.userId ?? '').trim();
    const cardId = (body.cardId ?? '').trim();
    const imageUrl = (body.imageUrl ?? '').trim();
    const imagePrompt = (body.imagePrompt ?? '').trim();

    if (!userId || !cardId || !imageUrl || !imagePrompt) {
      console.warn('[receive-image POST] Missing required fields:', { userId, cardId, imageUrl, imagePrompt });
      return NextResponse.json(
        {
          error: 'Missing userId, cardId, imageUrl, or imagePrompt',
          details: { userId, cardId, imageUrl, imagePrompt }
        },
        { status: 400 }
      );
    }

    storeImage(userId, cardId, imageUrl, imagePrompt);

    console.log('[receive-image POST] Image stored successfully');
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('[receive-image POST] Unexpected error:', error);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 500 });
  }
}
