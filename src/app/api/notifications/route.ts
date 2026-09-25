import { NextResponse } from 'next/server';
import {
  getNotificationsByUserId,
  markNotificationsRead,
} from '@/backend/services/notification.service';
import { getUser } from '@/lib/session';

export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const notifications = await getNotificationsByUserId(user.id);
    return NextResponse.json({ success: true, data: notifications });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch notifications.' },
      { status: 500 }
    );
  }
}

export async function PUT() {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    await markNotificationsRead(user.id);
    return NextResponse.json({ success: true, message: 'Notifications marked as read.' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update notifications.' },
      { status: 500 }
    );
  }
}
