import mongoose, { Schema, Document, Model } from 'mongoose';

const SkillSchema = new Schema({ name: { type: String, required: true } }, { _id: true });
const ProjectSchema = new Schema(
  {
    title:       { type: String, required: true },
    description: { type: String, default: '' },
    imageUrl:    { type: String, default: '' },
    projectUrl:  { type: String, default: '#' },
  },
  { _id: true }
);
const AcademicSchema = new Schema(
  {
    degree:      { type: String, required: true },
    institution: { type: String, required: true },
    year:        { type: String, default: '' },
    gpa:         { type: String, default: '' },
  },
  { _id: true }
);

export interface IProfile extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  bio: string;
  resumeUrl?: string;
  skills: { _id: mongoose.Types.ObjectId; name: string }[];
  projects: { _id: mongoose.Types.ObjectId; title: string; description: string; imageUrl: string; projectUrl: string }[];
  academics: { _id: mongoose.Types.ObjectId; degree: string; institution: string; year: string; gpa: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema = new Schema<IProfile>(
  {
    userId:    { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    bio:       { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
    skills:    [SkillSchema],
    projects:  [ProjectSchema],
    academics: [AcademicSchema],
  },
  { timestamps: true }
);

const Profile: Model<IProfile> =
  (mongoose.models.Profile as Model<IProfile>) ||
  mongoose.model<IProfile>('Profile', ProfileSchema);

export default Profile;
