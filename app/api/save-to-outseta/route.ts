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

    // Step 1: Look up the Person to get the associated Account UID
    const personRes = await fetch(`https://api.outseta.com/v1/crm/people/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.OUTSETA_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!personRes.ok) {
      const personError = await personRes.text();
      console.error(`[Outseta Person Lookup Error ${personRes.status}]`, personError);
      return NextResponse.json({ error: 'Failed to fetch person info', detail: personError }, { status: personRes.status });
    }

    const person = await personRes.json();
    const accountUid = person?.Account?.Uid;

    if (!accountUid) {
      console.error("[/api/save-to-outseta] ❌ No Account UID found for person", userId);
      return NextResponse.json({ error: 'No Account UID found for user' }, { status: 400 });
    }

    // Step 2: PATCH the account
    const accountEndpoint = `https://api.outseta.com/v1/crm/accounts/${accountUid}`;
    const payload = { [fieldName]: imageUrl };

    console.log(`PATCH → ${accountEndpoint}`);
    console.log("Payload:", payload);

    const patchRes = await fetch(accountEndpoint, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${process.env.OUTSETA_API_KEY}`,
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
