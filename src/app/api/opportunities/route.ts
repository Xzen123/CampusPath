import { NextResponse } from 'next/server';
import { getAllOpportunities, createOpportunity } from '@/backend/services/opportunity.service';
import { getUser } from '@/lib/session';

export async function GET() {
  try {
    const opportunities = await getAllOpportunities();
    return NextResponse.json({ success: true, data: opportunities });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch opportunities.' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user || (user.role !== 'Employer' && user.role !== 'PlacementCell')) {
      return NextResponse.json(
        { error: 'Unauthorized. Only Employers and Placement Cell can post opportunities.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const opportunity = await createOpportunity({
      ...body,
      employerId: user.id,
    });

    return NextResponse.json({ success: true, data: opportunity }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create opportunity.' },
      { status: 500 }
    );
  }
}
