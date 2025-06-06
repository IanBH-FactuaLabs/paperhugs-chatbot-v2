// app/api/check-account/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { accountId } = await req.json();

    if (!accountId) {
      return NextResponse.json({ error: 'Missing accountId' }, { status: 400 });
    }

    const apiKey = process.env.OUTSETA_API_KEY;
    const apiSecret = process.env.OUTSETA_API_SECRET;

    if (!apiKey || !apiSecret) {
      return NextResponse.json({ error: 'Missing Outseta API credentials' }, { status: 500 });
    }

    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
    const res = await fetch(`https://api.outseta.com/v1/crm/accounts/${accountId}`, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    const responseText = await res.text();

    if (!res.ok) {
      console.error(`[check-account] Error ${res.status}:`, responseText);
      return NextResponse.json(
        { status: res.status, error: 'Account not found or access denied', detail: responseText },
        { status: res.status }
      );
    }

    return NextResponse.json({ status: 'ok', accountData: JSON.parse(responseText) });
  } catch (err) {
    console.error('[check-account] Uncaught error:', err);
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}
