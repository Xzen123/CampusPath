import mongoose, { Schema, Document, Model } from 'mongoose';
import type { Role } from '@/lib/definitions';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: Role;
  avatarUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name:      { type: String, required: true, trim: true },
    email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:  { type: String, required: true },
    role:      { type: String, enum: ['Student', 'PlacementCell', 'FacultyMentor', 'Employer'], required: true },
    avatarUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

// Prevent model recompilation in Next.js hot reload
const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', UserSchema);

export default User;
