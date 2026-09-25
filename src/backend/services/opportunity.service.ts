import { connectDB } from '@/backend/db/mongoose';
import OpportunityModel from '@/backend/db/models/Opportunity.model';
import type { Opportunity } from '@/lib/definitions';

function toOpportunity(doc: any): Opportunity {
  return {
    id:          doc._id.toString(),
    title:       doc.title,
    company:     doc.company,
    logoUrl:     doc.logoUrl,
    description: doc.description,
    eligibility: doc.eligibility ?? [],
    tags:        doc.tags ?? [],
    type:        doc.type,
    postedAt:    doc.createdAt?.toISOString() ?? new Date().toISOString(),
    salary:      doc.salary,
    location:    doc.location,
    deadline:       doc.deadline,
    employerId:     doc.employerId?.toString(),
    sourcePlatform: doc.sourcePlatform ?? 'Campus',
    externalUrl:    doc.externalUrl,
  };
}

export async function getAllOpportunities(): Promise<Opportunity[]> {
  await connectDB();
  let docs = await OpportunityModel.find().sort({ createdAt: -1 }).lean();
  if (docs.length === 0) {
    try {
      const { syncLiveJobsToDatabase } = await import('./live-jobs.service');
      await syncLiveJobsToDatabase();
      docs = await OpportunityModel.find().sort({ createdAt: -1 }).lean();
    } catch (e) {
      console.error('Failed auto-syncing live jobs in getAllOpportunities:', e);
    }
  }
  return docs.map(toOpportunity);
}

export async function getOpportunityById(id: string): Promise<Opportunity | null> {
  await connectDB();
  try {
    const doc = await OpportunityModel.findById(id).lean();
    return doc ? toOpportunity(doc) : null;
  } catch {
    return null;
  }
}

export async function createOpportunity(
  data: Omit<Opportunity, 'id' | 'postedAt'>
): Promise<Opportunity> {
  await connectDB();
  const doc = await OpportunityModel.create(data);
  return toOpportunity(doc);
}

export async function updateOpportunity(
  id: string,
  data: Partial<Omit<Opportunity, 'id' | 'postedAt'>>
): Promise<Opportunity | null> {
  await connectDB();
  const doc = await OpportunityModel.findByIdAndUpdate(id, data, { new: true }).lean();
  return doc ? toOpportunity(doc) : null;
}

export async function deleteOpportunity(id: string): Promise<boolean> {
  await connectDB();
  const result = await OpportunityModel.findByIdAndDelete(id);
  return result !== null;
}

export const getOpportunities = getAllOpportunities;
export const addOpportunity = createOpportunity;
