import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { findUserByEmail, verifyPassword } from '@/backend/services/user.service';

const SESSION_COOKIE_NAME = 'campus_path_session';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials.' },
        { status: 401 }
      );
    }

    const isValid =
      user.password === password ||
      (await verifyPassword(password, user.password));

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials.' },
        { status: 401 }
      );
    }

    const session = {
      userId: user.id,
      role: user.role,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    const { signSession } = await import('@/lib/jwt');
    const token = await signSession(session);

    (await cookies()).set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(session.expires),
      sameSite: 'lax',
      path: '/',
    });

    const { password: _, ...safeUser } = user;
    return NextResponse.json({ success: true, user: safeUser });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
