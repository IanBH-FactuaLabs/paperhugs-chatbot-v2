import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { userId, cardId, imageUrl } = await req.json();

    if (!userId || !cardId || !imageUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const fieldName = `${cardId}image`;

    const res = await fetch(`https://api.outseta.com/v1/crm/accounts/user/${userId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${process.env.a2bbeee2-78f7-4541-bc89-0a4d37eaa411}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        [fieldName]: imageUrl
      })
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Outseta PATCH failed:', err);
      return NextResponse.json({ error: 'Failed to save to Outseta', detail: err }, { status: 500 });
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Unexpected error in save-to-outseta:', error);
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}
