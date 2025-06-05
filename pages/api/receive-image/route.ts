import { NextRequest, NextResponse } from 'next/server';
import { getImage } from '@/lib/imageStore';

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
