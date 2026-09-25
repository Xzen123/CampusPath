import { NextResponse } from 'next/server';
import { getAllUsersByRole, findUserById } from '@/backend/services/user.service';
import { getUser } from '@/lib/session';
import type { Role } from '@/lib/definitions';

export async function GET(req: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role') as Role | null;
    const id = searchParams.get('id');

    if (id) {
      const found = await findUserById(id);
      if (!found) {
        return NextResponse.json({ error: 'User not found.' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: found });
    }

    if (role) {
      const users = await getAllUsersByRole(role);
      return NextResponse.json({ success: true, data: users });
    }

    return NextResponse.json({ error: 'Role or id query param is required.' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch users.' },
      { status: 500 }
    );
  }
}
