import { NextRequest, NextResponse } from 'next/server';
import { connectDB, isDBConfigured } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { User } from '@/models/User';
import { z } from 'zod';

export async function GET() {
  if (!isDBConfigured()) {
    return NextResponse.json({ error: 'Database not configured.' }, { status: 503 });
  }

  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      home_city: user.home_city,
      bio: user.bio,
      avatar_path: user.avatar_path,
      locale: user.locale,
      theme: user.theme,
      text_size: user.text_size,
      email_prefs: user.email_prefs,
      created_at: user.created_at,
    },
  });
}

const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).trim().optional(),
  home_city: z.string().max(100).trim().optional(),
  bio: z.string().max(200).trim().optional(),
  locale: z.enum(['en', 'hi']).optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
  text_size: z.enum(['small', 'medium', 'large']).optional(),
  email_prefs: z.object({
    reports: z.boolean(),
    updates: z.boolean(),
  }).optional(),
});

export async function PATCH(request: NextRequest) {
  if (!isDBConfigured()) {
    return NextResponse.json({ error: 'Database not configured.' }, { status: 503 });
  }

  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid data', fields: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    await connectDB();
    await User.updateOne({ _id: user._id }, { $set: parsed.data });

    const updated = await User.findById(user._id).select('-password_hash');
    return NextResponse.json({
      ok: true,
      user: {
        id: updated!._id.toString(),
        name: updated!.name,
        email: updated!.email,
        role: updated!.role,
        home_city: updated!.home_city,
        bio: updated!.bio,
        avatar_path: updated!.avatar_path,
        locale: updated!.locale,
        theme: updated!.theme,
        text_size: updated!.text_size,
        email_prefs: updated!.email_prefs,
        created_at: updated!.created_at,
      },
    });
  } catch (err) {
    console.error('[Profile PATCH]', err);
    return NextResponse.json({ error: 'Failed to update profile.' }, { status: 500 });
  }
}

export async function DELETE() {
  if (!isDBConfigured()) {
    return NextResponse.json({ error: 'Database not configured.' }, { status: 503 });
  }

  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    await connectDB();
    const { Session } = await import('@/models/Session');

    // Delete all sessions
    await Session.deleteMany({ user_id: user._id });

    // Delete user
    await User.deleteOne({ _id: user._id });

    // Clear cookies
    const { cookies } = await import('next/headers');
    const cookieStore = cookies();
    cookieStore.delete('cp_session');
    cookieStore.delete('cp_csrf');

    return NextResponse.json({ ok: true, message: 'Account deleted.' });
  } catch (err) {
    console.error('[Profile DELETE]', err);
    return NextResponse.json({ error: 'Failed to delete account.' }, { status: 500 });
  }
}
