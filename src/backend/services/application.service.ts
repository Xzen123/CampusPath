import { connectDB } from '@/backend/db/mongoose';
import ApplicationModel from '@/backend/db/models/Application.model';
import type { Application, ApplicationStatus } from '@/lib/definitions';
import mongoose from 'mongoose';

function toApplication(doc: any): Application {
  return {
    id:            doc._id.toString(),
    userId:        doc.userId?.toString() ?? doc.userId,
    opportunityId: doc.opportunityId?.toString() ?? doc.opportunityId,
    status:        doc.status as ApplicationStatus,
    appliedAt:     doc.createdAt?.toISOString() ?? new Date().toISOString(),
    updatedAt:     doc.updatedAt?.toISOString() ?? new Date().toISOString(),
  };
}

export async function getApplicationsByUserId(userId: string): Promise<Application[]> {
  await connectDB();
  try {
    const docs = await ApplicationModel.find({ userId }).sort({ createdAt: -1 }).lean();
    return docs.map(toApplication);
  } catch {
    return [];
  }
}

export async function getAllApplications(): Promise<Application[]> {
  await connectDB();
  const docs = await ApplicationModel.find().sort({ createdAt: -1 }).lean();
  return docs.map(toApplication);
}

export async function getApplicationsByOpportunityId(opportunityId: string): Promise<Application[]> {
  await connectDB();
  try {
    const docs = await ApplicationModel.find({ opportunityId }).sort({ createdAt: -1 }).lean();
    return docs.map(toApplication);
  } catch {
    return [];
  }
}

export async function addApplication(
  userId: string,
  opportunityId: string
): Promise<Application | null> {
  await connectDB();
  try {
    const existing = await ApplicationModel.findOne({ userId, opportunityId }).lean();
    if (existing) return null; // already applied

    const doc = await ApplicationModel.create({
      userId: new mongoose.Types.ObjectId(userId),
      opportunityId: new mongoose.Types.ObjectId(opportunityId),
      status: 'Applied',
    });
    return toApplication(doc);
  } catch (err: any) {
    if (err.code === 11000) return null;
    throw err;
  }
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus
): Promise<Application | null> {
  await connectDB();
  try {
    const doc = await ApplicationModel.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    ).lean();
    return doc ? toApplication(doc) : null;
  } catch {
    return null;
  }
}

export async function updateApplicationStatusAndNotify(
  id: string,
  status: ApplicationStatus
): Promise<Application | null> {
  await connectDB();
  try {
    const doc = await ApplicationModel.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    ).populate('opportunityId').lean();

    if (!doc) return null;

    // Send automated notification to student
    try {
      const { createNotification } = await import('./notification.service');
      const oppTitle = (doc.opportunityId as any)?.title || 'your application';
      const oppCompany = (doc.opportunityId as any)?.company || 'Company';

      let title = `Application Status: ${status}`;
      let message = `Your application for ${oppTitle} at ${oppCompany} is now ${status}.`;
      let type: 'info' | 'success' | 'warning' = 'info';

      if (status === 'Interview') {
        title = '🎉 Interview Invitation!';
        message = `Congratulations! You have been selected for an interview for ${oppTitle} at ${oppCompany}.`;
        type = 'success';
      } else if (status === 'Offer') {
        title = '🌟 Job Offer Extended!';
        message = `Congratulations! ${oppCompany} has extended an offer for ${oppTitle}.`;
        type = 'success';
      } else if (status === 'Rejected') {
        title = 'Application Update';
        message = `Thank you for your interest in ${oppTitle} at ${oppCompany}. The position has been filled.`;
        type = 'warning';
      }

      await createNotification(doc.userId.toString(), title, message, type);
    } catch (notifErr) {
      console.warn('Failed to send status update notification:', notifErr);
    }

    return toApplication(doc);
  } catch {
    return null;
  }
}
