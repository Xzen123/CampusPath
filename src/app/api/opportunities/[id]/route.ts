import { NextResponse } from 'next/server';
import {
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
} from '@/backend/services/opportunity.service';
import { getUser } from '@/lib/session';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const opp = await getOpportunityById(id);
    if (!opp) {
      return NextResponse.json({ error: 'Opportunity not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: opp });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch opportunity.' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const updated = await updateOpportunity(id, body);

    if (!updated) {
      return NextResponse.json({ error: 'Opportunity not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update opportunity.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const user = await getUser();
    if (!user || (user.role !== 'PlacementCell' && user.role !== 'Employer')) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const { id } = await params;
    const deleted = await deleteOpportunity(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Opportunity not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete opportunity.' },
      { status: 500 }
    );
  }
}
