import { connectDB } from '@/backend/db/mongoose';
import UserModel from '@/backend/db/models/User.model';
import ProfileModel from '@/backend/db/models/Profile.model';
import bcrypt from 'bcryptjs';
import type { User, Role } from '@/lib/definitions';

/** Converts a Mongoose IUser doc to the plain User type used by the frontend */
function toUser(doc: any): User {
  return {
    id:        doc._id.toString(),
    name:      doc.name,
    email:     doc.email,
    role:      doc.role as Role,
    avatarUrl: doc.avatarUrl,
  };
}

export async function findUserByEmail(email: string): Promise<(User & { password: string }) | null> {
  await connectDB();
  const doc = await UserModel.findOne({ email: email.toLowerCase() }).lean();
  if (!doc) return null;
  return { ...toUser(doc), password: doc.password };
}

export async function findUserById(id: string): Promise<User | null> {
  await connectDB();
  try {
    const doc = await UserModel.findById(id).lean();
    return doc ? toUser(doc) : null;
  } catch {
    return null;
  }
}

export async function getAllUsersByRole(role: Role): Promise<User[]> {
  await connectDB();
  const docs = await UserModel.find({ role }).lean();
  return docs.map(toUser);
}

export async function createUser(
  data: Omit<User, 'id'> & { password: string }
): Promise<User | null> {
  await connectDB();
  try {
    const hashed = await bcrypt.hash(data.password, 10);
    const doc = await UserModel.create({ ...data, password: hashed, email: data.email.toLowerCase() });

    // Auto-create a blank profile for students
    if (data.role === 'Student') {
      await ProfileModel.create({ userId: doc._id, bio: '', skills: [], projects: [], academics: [] });
    }

    return toUser(doc);
  } catch (err: any) {
    if (err.code === 11000) return null; // duplicate email
    throw err;
  }
}

export async function verifyPassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

export async function getAllStudents(): Promise<User[]> {
  return getAllUsersByRole('Student');
}

export async function getAllEmployers(): Promise<User[]> {
  return getAllUsersByRole('Employer');
}
