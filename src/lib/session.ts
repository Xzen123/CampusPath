'use server';

import { cookies } from 'next/headers';
import { findUserById } from './data';
import type { User } from './definitions';
import { verifySession } from './jwt';

export async function getUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('campus_path_session')?.value;
  if (!sessionCookie) {
    return null;
  }
  try {
    const session = await verifySession(sessionCookie);
    if (!session) return null;
    const user = await findUserById(session.userId);
    return user || null;
  } catch (error) {
    console.error('Failed to verify session cookie or find user:', error);
    return null;
  }
}
