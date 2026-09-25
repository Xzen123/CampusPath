'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  findUserByEmail,
  createUser,
  findProfileByUserId,
  updateUserProfile,
  addApplication,
  addOpportunity,
  getApplicationsByUserId,
  getOpportunityById,
  verifyPassword,
} from '@/lib/data';
import { revalidatePath } from 'next/cache';
import type { Role, User, Skill, AcademicRecord, ApplicationStatus } from './definitions';
import { getUser } from './session';
import { signSession } from './jwt';

const SESSION_COOKIE_NAME = 'campus_path_session';

// ─── Schemas ──────────────────────────────────────────────────────────────────

const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

const SignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  role: z.enum(['Student', 'PlacementCell', 'FacultyMentor', 'Employer']),
});

const ProfileSchema = z.object({
  userId: z.string(),
  bio: z.string().min(10, 'Bio must be at least 10 characters long.'),
  resumeUrl: z.string().optional(),
});

const PostJobSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  company: z.string().min(2, 'Company name is required.'),
  description: z.string().min(20, 'Description must be at least 20 characters.'),
  type: z.enum(['Internship', 'Full-time', 'Training']),
  salary: z.string().optional(),
  location: z.string().optional(),
  deadline: z.string().optional(),
  eligibility: z.string().min(1, 'Eligibility is required.'),
  tags: z.string().min(1, 'At least one tag/skill is required.'),
  logoUrl: z.string().optional(),
});

// ─── State Types ──────────────────────────────────────────────────────────────

export type LoginState = {
  errors?: { email?: string[]; password?: string[] };
  message?: string | null;
};

export type SignupState = {
  errors?: { name?: string[]; email?: string[]; password?: string[]; role?: string[] };
  message?: string | null;
  success?: boolean;
};

export type ProfileState = {
  errors?: { bio?: string[] };
  message?: string | null;
  success?: boolean;
};

export type PostJobState = {
  errors?: Record<string, string[]>;
  message?: string | null;
  success?: boolean;
};

export type ApplyState = {
  message?: string | null;
  success?: boolean;
  alreadyApplied?: boolean;
};

// ─── Auth Actions ─────────────────────────────────────────────────────────────

export async function authenticate(
  prevState: LoginState | undefined,
  formData: FormData
) {
  const validatedFields = LoginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid fields. Failed to login.',
    };
  }

  const { email, password } = validatedFields.data;
  const user = await findUserByEmail(email);

  if (!user) {
    return { message: 'Invalid credentials. Please try again.' };
  }

  const isValidPassword =
    user.password === password ||
    (await verifyPassword(password, user.password));

  if (!isValidPassword) {
    return { message: 'Invalid credentials. Please try again.' };
  }

  const session = {
    userId: user.id,
    role: user.role,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };

  const token = await signSession(session);

  (await cookies()).set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(session.expires),
    sameSite: 'lax',
    path: '/',
  });

  revalidatePath('/');
  redirect('/dashboard');
}

export async function signup(
  prevState: SignupState | undefined,
  formData: FormData
): Promise<SignupState> {
  const validatedFields = SignupSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid fields. Failed to create account.',
      success: false,
    };
  }

  const { name, email, password, role } = validatedFields.data;
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    return { message: 'An account with this email already exists.', success: false };
  }

  const newUser = {
    name,
    email,
    password,
    role: role as Role,
    avatarUrl: `https://picsum.photos/seed/${Math.random()}/200/200`,
  };

  const createdUser = await createUser(newUser);
  if (!createdUser) {
    return { message: 'Database error: Failed to create user.', success: false };
  }

  if (createdUser.role === 'Student') {
    await findProfileByUserId(createdUser.id);
  }

  const params = new URLSearchParams();
  params.set('email', createdUser.email);
  params.set('success', 'true');
  redirect(`/login??${params.toString()}`);
}

// ─── Profile Actions ──────────────────────────────────────────────────────────

export async function updateProfile(
  prevState: ProfileState | undefined,
  formData: FormData
): Promise<ProfileState> {
  const validatedFields = ProfileSchema.safeParse({
    userId: formData.get('userId'),
    bio: formData.get('bio'),
    resumeUrl: formData.get('resumeUrl') || '',
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid fields. Failed to update profile.',
      success: false,
    };
  }

  const { userId, bio, resumeUrl } = validatedFields.data;
  const updated = await updateUserProfile(userId, { bio, resumeUrl });

  if (!updated) {
    return { message: 'Database error: Failed to update profile.', success: false };
  }

  revalidatePath('/profile');
  return { message: 'Profile updated successfully!', success: true };
}

export async function updateSkills(
  userId: string,
  skills: Skill[]
): Promise<{ success: boolean; message: string }> {
  const updated = await updateUserProfile(userId, { skills });
  if (!updated) return { success: false, message: 'Failed to update skills.' };
  revalidatePath('/profile');
  return { success: true, message: 'Skills updated!' };
}

export async function updateAcademics(
  userId: string,
  academics: AcademicRecord[]
): Promise<{ success: boolean; message: string }> {
  const updated = await updateUserProfile(userId, { academics });
  if (!updated) return { success: false, message: 'Failed to update academics.' };
  revalidatePath('/profile');
  return { success: true, message: 'Academics updated!' };
}

// ─── Opportunity Actions ──────────────────────────────────────────────────────

export async function applyToOpportunity(
  opportunityId: string
): Promise<ApplyState> {
  const user = await getUser();
  if (!user || user.role !== 'Student') {
    return { message: 'You must be logged in as a student to apply.', success: false };
  }

  const existing = (await getApplicationsByUserId(user.id)).find(
    (a) => a.opportunityId === opportunityId
  );
  if (existing) {
    return { message: 'You have already applied to this opportunity.', success: false, alreadyApplied: true };
  }

  const application = await addApplication(user.id, opportunityId);
  if (!application) {
    return { message: 'Failed to submit application.', success: false };
  }

  revalidatePath('/dashboard');
  revalidatePath('/opportunities');
  return { message: 'Application submitted successfully!', success: true };
}

export async function postOpportunity(
  prevState: PostJobState | undefined,
  formData: FormData
): Promise<PostJobState> {
  const user = await getUser();
  if (!user) return { message: 'Not authenticated.', success: false };

  const raw = Object.fromEntries(formData.entries());
  const validatedFields = PostJobSchema.safeParse(raw);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please fix the errors above.',
      success: false,
    };
  }

  const data = validatedFields.data;
  await addOpportunity({
    title: data.title,
    company: data.company,
    description: data.description,
    type: data.type,
    salary: data.salary,
    location: data.location,
    deadline: data.deadline,
    eligibility: data.eligibility.split(',').map((s) => s.trim()),
    tags: data.tags.split(',').map((s) => s.trim()),
    logoUrl: data.logoUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
    employerId: user.id,
  });

  revalidatePath('/opportunities');
  revalidatePath('/dashboard');
  return { message: 'Opportunity posted successfully!', success: true };
}

// ─── Application Status Pipeline Action ────────────────────────────────────────

export async function updateApplicationStatusAction(
  applicationId: string,
  newStatus: ApplicationStatus
): Promise<{ success: boolean; message: string }> {
  const user = await getUser();
  if (!user || (user.role !== 'Employer' && user.role !== 'PlacementCell')) {
    return { success: false, message: 'Unauthorized.' };
  }

  const { updateApplicationStatusAndNotify } = await import('@/lib/data');
  const updated = await updateApplicationStatusAndNotify(applicationId, newStatus);
  if (!updated) {
    return { success: false, message: 'Failed to update application status.' };
  }

  revalidatePath('/dashboard');
  return { success: true, message: `Application status updated to ${newStatus}.` };
}

// ─── Google Sign-In Action ───────────────────────────────────────────────────

export async function signInWithGoogleAction(role: Role = 'Student') {
  const googleEmail = 'google.student@campuspath.edu';
  let user: User | null = await findUserByEmail(googleEmail);

  if (!user) {
    user = await createUser({
      name: 'Google Scholar',
      email: googleEmail,
      password: 'google_oauth_verified_account',
      role: role,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
    });
  }

  if (!user) {
    throw new Error('Failed to authenticate Google user');
  }

  if (user.role === 'Student') {
    await findProfileByUserId(user.id);
  }

  const session = {
    userId: user.id,
    role: user.role,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };

  const token = await signSession(session);

  (await cookies()).set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(session.expires),
    sameSite: 'lax',
    path: '/',
  });

  revalidatePath('/');
  redirect('/dashboard');
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE_NAME);
  redirect('/login');
}