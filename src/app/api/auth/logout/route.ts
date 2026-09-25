import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'campus_path_session';

export async function POST() {
  (await cookies()).delete(SESSION_COOKIE_NAME);
  return NextResponse.json({ success: true, message: 'Logged out successfully.' });
}
