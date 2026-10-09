import { NextResponse } from 'next/server';
import { isDBConfigured } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  if (!isDBConfigured()) {
    return NextResponse.json({ error: 'Database not configured.' }, { status: 503 });
  }

  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    // Export user data as JSON
    const exportData = {
      exported_at: new Date().toISOString(),
      profile: {
        name: user.name,
        email: user.email,
        home_city: user.home_city,
        bio: user.bio,
        locale: user.locale,
        theme: user.theme,
        text_size: user.text_size,
        email_prefs: user.email_prefs,
        created_at: user.created_at,
      },
      // TODO: Include saved places, trips, reports, reviews when those models are built
      saved_places: [],
      trips: [],
      reports: [],
      reviews: [],
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="citypulse-export-${Date.now()}.json"`,
      },
    });
  } catch (err) {
    console.error('[Export]', err);
    return NextResponse.json({ error: 'Failed to export data.' }, { status: 500 });
  }
}
