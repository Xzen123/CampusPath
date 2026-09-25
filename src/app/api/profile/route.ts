import { NextResponse } from 'next/server';
import {
  getProfileByUserId,
  getOrCreateProfile,
  updateUserProfile,
} from '@/backend/services/profile.service';
import { getUser } from '@/lib/session';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const requestedUserId = searchParams.get('userId');

    let targetUserId = requestedUserId;
    if (!targetUserId) {
      const user = await getUser();
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
      }
      targetUserId = user.id;
    }

    const profile = await getOrCreateProfile(targetUserId);
    return NextResponse.json({ success: true, data: profile });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch profile.' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const updated = await updateUserProfile(user.id, body);

    if (!updated) {
      return NextResponse.json({ error: 'Failed to update profile.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update profile.' },
      { status: 500 }
    );
  }
}
