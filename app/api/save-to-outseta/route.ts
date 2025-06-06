import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[/api/save-to-outseta] Incoming body:", body);

    const { userId, cardId, imageUrl } = body;

    if (!userId || !cardId || !imageUrl) {
      console.warn("[/api/save-to-outseta] ❌ Missing fields", { userId, cardId, imageUrl });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const fieldName = `${cardId}Image`; // Match exact casing as defined in Outseta
    console.log(`[save-to-outseta] Attempting to save to field: ${fieldName}`);

    const apiRes = await fetch(`https://api.outseta.com/v1/crm/accounts/user/${userId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${process.env.OUTSETA_API_KEY ?? ''}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        [fieldName]: imageUrl
      })
    });

    const contentType = apiRes.headers.get('content-type') || '';
    const result = contentType.includes('application/json')
      ? await apiRes.json()
      : await apiRes.text();

    if (!apiRes.ok) {
      console.error('[Outseta PATCH failed]', result);
      return NextResponse.json(
        { error: 'Failed to save to Outseta', detail: result },
        { status: 500 }
      );
    }

    console.log('[✅ Saved to Outseta]', result);
    return NextResponse.json({ status: 'success' });
  } catch (err) {
    console.error('[save-to-outseta] ❗ Unexpected server error:', err);
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}
