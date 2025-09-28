'use server';

import { cookies } from 'next/headers';
import { findUserById } from './data';
import type { User, Role } from './definitions';

type Session = {
    userId: string;
    role: Role;
};

export async function getUser(): Promise<User | null> {
  const sessionCookie = cookies().get('campus_path_session')?.value;
  if (!sessionCookie) {
    return null;
  }
  try {
    const session: Session = JSON.parse(sessionCookie);
    const user = await findUserById(session.userId);
    return user || null;
  } catch (error) {
    console.error("Failed to parse session cookie or find user:", error);
    return null;
  }
}
