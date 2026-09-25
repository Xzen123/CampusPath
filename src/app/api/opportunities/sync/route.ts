import { NextResponse } from 'next/server';
import { syncLiveJobsToDatabase } from '@/backend/services/live-jobs.service';

export async function POST() {
  try {
    const result = await syncLiveJobsToDatabase();
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error('Error syncing live jobs:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to sync live jobs' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}
