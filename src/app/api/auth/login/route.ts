import { NextRequest, NextResponse } from 'next/server';
import { connectDB, isDBConfigured } from '@/lib/db';
import { User } from '@/models/User';
import {
  verifyPassword,
  createSession,
  isAccountLocked,
  recordFailedLogin,
  resetFailedLogins,
} from '@/lib/auth';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1),
  remember: z.boolean().optional().default(false),
});

export async function POST(request: NextRequest) {
  if (!isDBConfigured()) {
    return NextResponse.json(
      { error: 'Database not configured. Set MONGODB_URI in your environment.' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Email or password is incorrect.' }, { status: 401 });
    }

    const { email, password, remember } = parsed.data;

    await connectDB();
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal whether the email exists
      return NextResponse.json({ error: 'Email or password is incorrect.' }, { status: 401 });
    }

    // Check lockout
    if (isAccountLocked(user)) {
      return NextResponse.json(
        { error: 'Account temporarily locked due to too many failed attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      await recordFailedLogin(user._id.toString());
      return NextResponse.json({ error: 'Email or password is incorrect.' }, { status: 401 });
    }

    // Successful login: reset failed attempts
    await resetFailedLogins(user._id.toString());

    const userAgent = request.headers.get('user-agent') || '';
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    await createSession(user._id.toString(), userAgent, ip, remember);

    return NextResponse.json({
      ok: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar_path: user.avatar_path,
      },
    });
  } catch (err) {
    console.error('[Login]', err);
    return NextResponse.json({ error: 'Login failed. Please try again.' }, { status: 500 });
  }
}
