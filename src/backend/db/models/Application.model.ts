import mongoose, { Schema, Document, Model } from 'mongoose';
import type { ApplicationStatus } from '@/lib/definitions';

export interface IApplication extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  opportunityId: mongoose.Types.ObjectId;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    userId:        { type: Schema.Types.ObjectId, ref: 'User', required: true },
    opportunityId: { type: Schema.Types.ObjectId, ref: 'Opportunity', required: true },
    status:        {
      type: String,
      enum: ['Applied', 'Under Review', 'Interview', 'Offer', 'Rejected'],
      default: 'Applied',
    },
  },
  { timestamps: true }
);

// Prevent a user applying to the same opportunity twice
ApplicationSchema.index({ userId: 1, opportunityId: 1 }, { unique: true });

const Application: Model<IApplication> =
  (mongoose.models.Application as Model<IApplication>) ||
  mongoose.model<IApplication>('Application', ApplicationSchema);

export default Application;
