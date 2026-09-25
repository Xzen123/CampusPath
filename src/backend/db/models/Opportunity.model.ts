import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOpportunity extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  company: string;
  logoUrl: string;
  description: string;
  eligibility: string[];
  tags: string[];
  type: 'Internship' | 'Full-time' | 'Training';
  salary?: string;
  location?: string;
  deadline?: string;
  employerId?: mongoose.Types.ObjectId;
  sourcePlatform?: 'LinkedIn' | 'Indeed' | 'Internshala' | 'Unstop' | 'Campus';
  externalUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OpportunitySchema = new Schema<IOpportunity>(
  {
    title:          { type: String, required: true, trim: true },
    company:        { type: String, required: true, trim: true },
    logoUrl:        { type: String, default: '' },
    description:    { type: String, required: true },
    eligibility:    [{ type: String }],
    tags:           [{ type: String }],
    type:           { type: String, enum: ['Internship', 'Full-time', 'Training'], required: true },
    salary:         { type: String },
    location:       { type: String },
    deadline:       { type: String },
    employerId:     { type: Schema.Types.ObjectId, ref: 'User' },
    sourcePlatform: { type: String, enum: ['LinkedIn', 'Indeed', 'Internshala', 'Unstop', 'Campus'], default: 'Campus' },
    externalUrl:    { type: String },
  },
  { timestamps: true }
);

const Opportunity: Model<IOpportunity> =
  (mongoose.models.Opportunity as Model<IOpportunity>) ||
  mongoose.model<IOpportunity>('Opportunity', OpportunitySchema);

export default Opportunity;
