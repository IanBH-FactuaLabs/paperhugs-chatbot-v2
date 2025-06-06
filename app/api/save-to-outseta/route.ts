import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[/api/save-to-outseta] Incoming body:", body);

    const { userId, fieldName, imageUrl } = body;

    if (!userId || !fieldName || !imageUrl) {
      console.warn("[/api/save-to-outseta] ❌ Missing fields", { userId, fieldName, imageUrl });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const res = await fetch(`https://api.outseta.com/v1/crm/accounts/user/${userId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${process.env.OUTSETA_API_KEY}`,
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
