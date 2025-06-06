// app/api/save-to-outseta/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[/api/save-to-outseta] Incoming body:", body);

    const { accountId: accountUid, fieldName, imageUrl } = body;

    if (!accountUid || !fieldName || !imageUrl) {
      console.warn("[/api/save-to-outseta] ❌ Missing fields", { accountUid, fieldName, imageUrl });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const apiKey = process.env.OUTSETA_API_KEY;
    const apiSecret = process.env.OUTSETA_API_SECRET;

    if (!apiKey || !apiSecret) {
      console.error("[/api/save-to-outseta] ❌ Missing Outseta API credentials");
      return NextResponse.json({ error: 'Missing Outseta API credentials' }, { status: 500 });
    }

    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

    // Step 1: Fetch full account object via UID
    const lookupRes = await fetch(`https://api.outseta.com/v1/crm/accounts/uid/${accountUid}`, {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    if (!lookupRes.ok) {
      const errText = await lookupRes.text();
      console.error(`[Account UID lookup failed ${lookupRes.status}]`, errText);
      return NextResponse.json({ error: 'Failed to fetch account by UID', detail: errText }, { status: lookupRes.status });
    }

    const account = await lookupRes.json();
    const internalId = account?.Id;

    if (!internalId) {
      console.error("[/api/save-to-outseta] ❌ No internal account ID found");
      return NextResponse.json({ error: 'No internal ID found for account' }, { status: 500 });
    }

    // Step 2: PATCH the account using internal ID
    const accountEndpoint = `https://api.outseta.com/v1/crm/accounts/${internalId}`;
    const payload = { [fieldName]: imageUrl };

    console.log(`PATCH → ${accountEndpoint}`);
    console.log("Payload:", payload);

    const patchRes = await fetch(accountEndpoint, {
      method: 'PATCH',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!patchRes.ok) {
      const errorText = await patchRes.text();
      console.error(`[Outseta PATCH error ${patchRes.status}]`, errorText);
      return NextResponse.json(
        { error: 'Failed to update Outseta account field', status: patchRes.status, detail: errorText },
        { status: patchRes.status }
      );
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('[save-to-outseta] Uncaught error:', error);
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}
