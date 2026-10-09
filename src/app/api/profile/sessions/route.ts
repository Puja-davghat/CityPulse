import { NextRequest, NextResponse } from 'next/server';
import { connectDB, isDBConfigured } from '@/lib/db';
import { getSessionUser, hashToken } from '@/lib/auth';
import { Session } from '@/models/Session';
import { cookies } from 'next/headers';

export async function GET() {
  if (!isDBConfigured()) {
    return NextResponse.json({ error: 'Database not configured.' }, { status: 503 });
  }

  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    await connectDB();
    const cookieStore = cookies();
    const currentToken = cookieStore.get('cp_session')?.value;
    const currentHash = currentToken ? hashToken(currentToken) : '';

    const sessions = await Session.find({ user_id: user._id, expires_at: { $gt: new Date() } })
      .sort({ created_at: -1 })
      .lean();

    return NextResponse.json({
      sessions: sessions.map(s => ({
        id: s._id.toString(),
        user_agent: s.user_agent,
        ip: s.ip,
        created_at: s.created_at,
        expires_at: s.expires_at,
        is_current: s.token_hash === currentHash,
      })),
    });
  } catch (err) {
    console.error('[Sessions GET]', err);
    return NextResponse.json({ error: 'Failed to fetch sessions.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isDBConfigured()) {
    return NextResponse.json({ error: 'Database not configured.' }, { status: 503 });
  }

  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    await connectDB();
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('id');

    if (sessionId === 'others') {
      // Sign out all other devices
      const cookieStore = cookies();
      const currentToken = cookieStore.get('cp_session')?.value;
      const currentHash = currentToken ? hashToken(currentToken) : '';

      const result = await Session.deleteMany({
        user_id: user._id,
        token_hash: { $ne: currentHash },
      });

      return NextResponse.json({ ok: true, deleted: result.deletedCount });
    }

    if (sessionId) {
      // Delete specific session (only if it belongs to this user)
      await Session.deleteOne({ _id: sessionId, user_id: user._id });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: 'Session ID is required.' }, { status: 400 });
  } catch (err) {
    console.error('[Sessions DELETE]', err);
    return NextResponse.json({ error: 'Failed to delete session.' }, { status: 500 });
  }
}
