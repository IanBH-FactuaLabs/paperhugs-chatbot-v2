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

    const endpoint = `https://api.outseta.com/v1/crm/people/${userId}`;
    const payload = { [fieldName]: imageUrl };

    console.log(`PATCH → ${endpoint}`);
    console.log('Payload:', payload);

    const res = await fetch(endpoint, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${process.env.OUTSETA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[Outseta PATCH error ${res.status}]`, errorText);
      return NextResponse.json(
        { error: 'Failed to update Outseta person field', status: res.status, detail: errorText },
        { status: res.status }
      );
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('[save-to-outseta] Uncaught error:', error);
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}
