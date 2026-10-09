import { NextRequest, NextResponse } from 'next/server';
import { isDBConfigured } from '@/lib/db';
import { getSessionUser, verifyPassword, hashPassword, validatePasswordStrength } from '@/lib/auth';
import { User } from '@/models/User';
import { Session } from '@/models/Session';

export async function POST(request: NextRequest) {
  if (!isDBConfigured()) {
    return NextResponse.json({ error: 'Database not configured.' }, { status: 503 });
  }

  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Current password and new password are required.' }, { status: 400 });
    }

    // Get user with password hash
    const fullUser = await User.findById(user._id);
    if (!fullUser) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const validCurrent = await verifyPassword(currentPassword, fullUser.password_hash);
    if (!validCurrent) {
      return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 401 });
    }

    const strength = validatePasswordStrength(newPassword);
    if (!strength.valid) {
      return NextResponse.json({ error: strength.message }, { status: 400 });
    }

    const newHash = await hashPassword(newPassword);
    await User.updateOne({ _id: user._id }, { $set: { password_hash: newHash } });

    return NextResponse.json({ ok: true, message: 'Password updated.' });
  } catch (err) {
    console.error('[Password Change]', err);
    return NextResponse.json({ error: 'Failed to change password.' }, { status: 500 });
  }
}
