import { connectDB } from '@/backend/db/mongoose';
import ProfileModel from '@/backend/db/models/Profile.model';
import type { StudentProfile, Skill, Project, AcademicRecord } from '@/lib/definitions';

function toProfile(doc: any): StudentProfile {
  return {
    id:        doc._id.toString(),
    userId:    doc.userId.toString(),
    bio:       doc.bio ?? '',
    resumeUrl: doc.resumeUrl ?? '',
    skills:    (doc.skills ?? []).map((s: any) => ({ id: s._id.toString(), name: s.name })),
    projects:  (doc.projects ?? []).map((p: any) => ({
      id:          p._id.toString(),
      title:       p.title,
      description: p.description,
      imageUrl:    p.imageUrl,
      projectUrl:  p.projectUrl,
    })),
    academics: (doc.academics ?? []).map((a: any) => ({
      id:          a._id.toString(),
      degree:      a.degree,
      institution: a.institution,
      year:        a.year,
      gpa:         a.gpa,
    })),
  };
}

export async function getProfileByUserId(userId: string): Promise<StudentProfile | null> {
  await connectDB();
  const doc = await ProfileModel.findOne({ userId }).lean();
  return doc ? toProfile(doc) : null;
}

export async function getOrCreateProfile(userId: string): Promise<StudentProfile> {
  await connectDB();
  let doc = await ProfileModel.findOne({ userId }).lean();
  if (!doc) {
    doc = (await ProfileModel.create({ userId, bio: '', skills: [], projects: [], academics: [] })).toObject();
  }
  return toProfile(doc);
}

export async function updateProfileBio(userId: string, bio: string): Promise<StudentProfile | null> {
  await connectDB();
  const doc = await ProfileModel.findOneAndUpdate(
    { userId },
    { $set: { bio } },
    { new: true, upsert: true }
  ).lean();
  return doc ? toProfile(doc) : null;
}

export async function updateProfileSkills(userId: string, skills: Omit<Skill, 'id'>[]): Promise<StudentProfile | null> {
  await connectDB();
  const doc = await ProfileModel.findOneAndUpdate(
    { userId },
    { $set: { skills } },
    { new: true, upsert: true }
  ).lean();
  return doc ? toProfile(doc) : null;
}

export async function updateProfileAcademics(
  userId: string,
  academics: Omit<AcademicRecord, 'id'>[]
): Promise<StudentProfile | null> {
  await connectDB();
  const doc = await ProfileModel.findOneAndUpdate(
    { userId },
    { $set: { academics } },
    { new: true, upsert: true }
  ).lean();
  return doc ? toProfile(doc) : null;
}

export async function addProject(userId: string, project: Omit<Project, 'id'>): Promise<StudentProfile | null> {
  await connectDB();
  const doc = await ProfileModel.findOneAndUpdate(
    { userId },
    { $push: { projects: project } },
    { new: true, upsert: true }
  ).lean();
  return doc ? toProfile(doc) : null;
}

export const findProfileByUserId = getProfileByUserId;

export async function updateUserProfile(
  userId: string,
  updates: Partial<Pick<StudentProfile, 'bio' | 'skills' | 'projects' | 'academics' | 'resumeUrl'>>
): Promise<StudentProfile | null> {
  await connectDB();
  const updateDoc: any = {};
  if (updates.bio !== undefined) updateDoc.bio = updates.bio;
  if (updates.resumeUrl !== undefined) updateDoc.resumeUrl = updates.resumeUrl;
  if (updates.skills !== undefined) updateDoc.skills = updates.skills;
  if (updates.projects !== undefined) updateDoc.projects = updates.projects;
  if (updates.academics !== undefined) updateDoc.academics = updates.academics;

  const doc = await ProfileModel.findOneAndUpdate(
    { userId },
    { $set: updateDoc },
    { new: true, upsert: true }
  ).lean();
  return doc ? toProfile(doc) : null;
}
