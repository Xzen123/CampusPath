import { NextResponse } from 'next/server';
import { createUser, findUserByEmail } from '@/backend/services/user.service';
import type { Role } from '@/lib/definitions';

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Name, email, password, and role are required.' },
        { status: 400 }
      );
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    const created = await createUser({
      name,
      email,
      password,
      role: role as Role,
      avatarUrl: `https://picsum.photos/seed/${Math.random()}/200/200`,
    });

    if (!created) {
      return NextResponse.json(
        { error: 'Failed to create user.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, user: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
