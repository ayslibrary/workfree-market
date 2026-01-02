import { NextResponse } from 'next/server';
import { ADMIN_EMAILS } from '@/lib/admin';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';

function unauthorized(message = 'Unauthorized') {
  return NextResponse.json({ error: message }, { status: 401 });
}

function forbidden(message = 'Forbidden') {
  return NextResponse.json({ error: message }, { status: 403 });
}

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization') || '';
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) return unauthorized('Missing Authorization header');

  const token = match[1];

  let decoded: { email?: string } | null = null;
  try {
    const { adminAuth } = getFirebaseAdmin();
    decoded = (await adminAuth.verifyIdToken(token)) as any;
  } catch (e) {
    console.error('verifyIdToken failed:', e);
    return unauthorized('Invalid token');
  }

  const email = (decoded?.email || '').trim().toLowerCase();
  if (!email) return forbidden('Missing email on token');
  if (!ADMIN_EMAILS.includes(email)) return forbidden('Admin only');

  try {
    const { adminDb } = getFirebaseAdmin();
    const snapshot = await adminDb
      .collection('users')
      .orderBy('createdAt', 'desc')
      .limit(200)
      .get();

    const users = snapshot.docs.map((doc) => {
      const data: any = doc.data();
      const createdAt = data?.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data?.createdAt;
      const updatedAt = data?.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data?.updatedAt;
      return {
        id: doc.id,
        ...data,
        createdAt,
        updatedAt,
      };
    });

    return NextResponse.json({ users });
  } catch (e) {
    console.error('admin users fetch failed:', e);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}


