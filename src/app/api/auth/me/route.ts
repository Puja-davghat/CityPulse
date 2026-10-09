import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { isDBConfigured } from '@/lib/db';

export async function GET() {
  if (!isDBConfigured()) {
    return NextResponse.json({ user: null });
  }

  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar_path: user.avatar_path,
        home_city: user.home_city,
        bio: user.bio,
        locale: user.locale,
        theme: user.theme,
        text_size: user.text_size,
        email_prefs: user.email_prefs,
        created_at: user.created_at,
      },
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
