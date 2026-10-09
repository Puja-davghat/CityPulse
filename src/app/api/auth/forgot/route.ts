import { NextRequest, NextResponse } from 'next/server';
import { connectDB, isDBConfigured } from '@/lib/db';
import { User } from '@/models/User';
import { PasswordReset } from '@/models/PasswordReset';
import { generateToken, hashToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  if (!isDBConfigured()) {
    return NextResponse.json(
      { error: 'Database not configured.' },
      { status: 503 }
    );
  }

  try {
    const { email } = await request.json();
    // Always show the same message whether or not the email exists
    const genericMessage = 'If an account with that email exists, we have sent a password reset link.';

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ ok: true, message: genericMessage });
    }

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (user) {
      const token = generateToken();
      const tokenHash = hashToken(token);

      await PasswordReset.create({
        token_hash: tokenHash,
        user_id: user._id,
        expires_at: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
      });

      const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

      // Check if SMTP is configured
      const smtpHost = process.env.SMTP_HOST;
      if (smtpHost) {
        // TODO: Send email via SMTP
        console.log(`[Reset] Email would be sent to ${user.email} with reset link`);
      } else {
        // Development: log the link to console
        console.log(`\n╔══════════════════════════════════════════╗`);
        console.log(`║  PASSWORD RESET LINK (dev mode)          ║`);
        console.log(`║  SMTP not configured — link logged here  ║`);
        console.log(`╠══════════════════════════════════════════╣`);
        console.log(`║  Email: ${user.email}`);
        console.log(`║  Link:  ${resetUrl}`);
        console.log(`╚══════════════════════════════════════════╝\n`);
      }
    }

    return NextResponse.json({ ok: true, message: genericMessage });
  } catch (err) {
    console.error('[Forgot]', err);
    return NextResponse.json(
      { ok: true, message: 'If an account with that email exists, we have sent a password reset link.' }
    );
  }
}
