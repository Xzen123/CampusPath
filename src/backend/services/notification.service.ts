import { connectDB } from '@/backend/db/mongoose';
import NotificationModel from '@/backend/db/models/Notification.model';
import type { Notification } from '@/lib/definitions';
import mongoose from 'mongoose';

function toNotification(doc: any): Notification {
  return {
    id:        doc._id.toString(),
    userId:    doc.userId?.toString() ?? doc.userId,
    title:     doc.title,
    message:   doc.message,
    read:      doc.read ?? false,
    createdAt: doc.createdAt?.toISOString() ?? new Date().toISOString(),
    type:      doc.type ?? 'info',
  };
}

export async function getNotificationsByUserId(userId: string): Promise<Notification[]> {
  await connectDB();
  try {
    const docs = await NotificationModel.find({ userId }).sort({ createdAt: -1 }).lean();
    return docs.map(toNotification);
  } catch {
    return [];
  }
}

export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' = 'info'
): Promise<Notification> {
  await connectDB();
  const doc = await NotificationModel.create({
    userId: new mongoose.Types.ObjectId(userId),
    title,
    message,
    type,
    read: false,
  });
  return toNotification(doc);
}

export async function markNotificationsRead(userId: string): Promise<void> {
  await connectDB();
  try {
    await NotificationModel.updateMany({ userId }, { $set: { read: true } });
  } catch {
    // silent catch
  }
}
