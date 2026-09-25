import { NextResponse } from 'next/server';
import {
  getApplicationsByUserId,
  getAllApplications,
  addApplication,
} from '@/backend/services/application.service';
import { getUser } from '@/lib/session';

export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    if (user.role === 'PlacementCell' || user.role === 'FacultyMentor') {
      const all = await getAllApplications();
      return NextResponse.json({ success: true, data: all });
    }

    const mine = await getApplicationsByUserId(user.id);
    return NextResponse.json({ success: true, data: mine });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch applications.' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user || user.role !== 'Student') {
      return NextResponse.json(
        { error: 'Only students can apply to opportunities.' },
        { status: 403 }
      );
    }

    const { opportunityId } = await req.json();
    if (!opportunityId) {
      return NextResponse.json(
        { error: 'opportunityId is required.' },
        { status: 400 }
      );
    }

    const application = await addApplication(user.id, opportunityId);
    if (!application) {
      return NextResponse.json(
        { error: 'You have already applied or the opportunity is invalid.' },
        { status: 409 }
      );
    }

    return NextResponse.json({ success: true, data: application }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to submit application.' },
      { status: 500 }
    );
  }
}
