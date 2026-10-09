import { NextRequest, NextResponse } from 'next/server';
import { connectDB, isDBConfigured } from '@/lib/db';
import { PasswordReset } from '@/models/PasswordReset';
import { User } from '@/models/User';
import { hashToken, hashPassword, validatePasswordStrength } from '@/lib/auth';
import { Session } from '@/models/Session';

export async function POST(request: NextRequest) {
  if (!isDBConfigured()) {
    return NextResponse.json({ error: 'Database not configured.' }, { status: 503 });
  }

  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required.' }, { status: 400 });
    }

    const strength = validatePasswordStrength(password);
    if (!strength.valid) {
      return NextResponse.json({ error: strength.message }, { status: 400 });
    }

    await connectDB();
    const tokenHash = hashToken(token);

    const resetRecord = await PasswordReset.findOne({
      token_hash: tokenHash,
      used_at: null,
      expires_at: { $gt: new Date() },
    });

    if (!resetRecord) {
      return NextResponse.json(
        { error: 'This reset link is invalid or has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Mark token as used
    resetRecord.used_at = new Date();
    await resetRecord.save();

    // Update user password
    const newHash = await hashPassword(password);
    await User.updateOne(
      { _id: resetRecord.user_id },
      { $set: { password_hash: newHash, failed_login_attempts: 0, locked_until: null } }
    );

    // Invalidate all existing sessions for this user
    await Session.deleteMany({ user_id: resetRecord.user_id });

    return NextResponse.json({ ok: true, message: 'Password has been reset. Please log in with your new password.' });
  } catch (err) {
    console.error('[Reset]', err);
    return NextResponse.json({ error: 'Password reset failed. Please try again.' }, { status: 500 });
  }
}
