import { NextRequest, NextResponse } from 'next/server';
import { connectDB, isDBConfigured } from '@/lib/db';
import { User } from '@/models/User';
import {
  hashPassword,
  createSession,
  validatePasswordStrength,
} from '@/lib/auth';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100).trim(),
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string().min(10, 'Password must be at least 10 characters'),
  acceptPrivacy: z.literal(true, { errorMap: () => ({ message: 'You must accept the privacy notice' }) }),
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
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json({ error: 'Validation failed', fields: errors }, { status: 400 });
    }

    const { name, email, password } = parsed.data;

    // Validate password strength
    const strength = validatePasswordStrength(password);
    if (!strength.valid) {
      return NextResponse.json(
        { error: 'Validation failed', fields: { password: [strength.message] } },
        { status: 400 }
      );
    }

    await connectDB();

    // Check for existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: 'Validation failed', fields: { email: ['An account with this email already exists'] } },
        { status: 409 }
      );
    }

    const password_hash = await hashPassword(password);
    const user = await User.create({ email, password_hash, name });

    // Create session
    const userAgent = request.headers.get('user-agent') || '';
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    await createSession(user._id.toString(), userAgent, ip, false);

    return NextResponse.json({
      ok: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }, { status: 201 });
  } catch (err) {
    console.error('[Register]', err);
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}
