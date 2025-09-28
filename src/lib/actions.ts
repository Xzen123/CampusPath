'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { findUserByEmail, createUser, findProfileByUserId, updateUserProfile } from '@/lib/data';
import { revalidatePath } from 'next/cache';
import type { Role, User } from './definitions';

const SESSION_COOKIE_NAME = 'campus_path_session';

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
    bio: z.string().min(10, "Bio must be at least 10 characters long."),
});


export type LoginState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string | null;
};

export type SignupState = {
    errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        role?: string[];
    };
    message?: string | null;
    success?: boolean;
}

export type ProfileState = {
    errors?: {
        bio?: string[];
    };
    message?: string | null;
    success?: boolean;
}

export async function authenticate(
  prevState: LoginState | undefined,
  formData: FormData,
) {
  const validatedFields = LoginSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid fields. Failed to login.',
    };
  }

  const { email, password } = validatedFields.data;
  const user = await findUserByEmail(email);

  if (!user || user.password !== password) {
    return {
      message: 'Invalid credentials. Please try again.',
    };
  }
  
  const session = {
      userId: user.id,
      role: user.role,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  };

  cookies().set(SESSION_COOKIE_NAME, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: session.expires,
    sameSite: 'lax',
    path: '/',
  });

  revalidatePath('/');
  redirect('/dashboard');
}

export async function signup(
    prevState: SignupState | undefined,
    formData: FormData,
): Promise<SignupState> {
    const validatedFields = SignupSchema.safeParse(
        Object.fromEntries(formData.entries())
    );

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
        return {
            message: 'An account with this email already exists.',
            success: false,
        }
    }

    const newUser: Omit<User, 'id'> = {
        name,
        email,
        password, // Storing plaintext password for this app
        role: role as Role,
        avatarUrl: `https://picsum.photos/seed/${Math.random()}/200/200`,
    };

    const createdUser = await createUser(newUser);

    if (!createdUser) {
        return {
            message: 'Database error: Failed to create user.',
            success: false,
        }
    }

    // If the new user is a student, create a default profile.
    if (createdUser.role === 'Student') {
        await findProfileByUserId(createdUser.id);
    }

    // Redirect to login page with a success message and prefilled email
    const params = new URLSearchParams();
    params.set('email', createdUser.email);
    params.set('success', 'true');
    redirect(`/login??${params.toString()}`);
}

export async function updateProfile(prevState: ProfileState | undefined, formData: FormData): Promise<ProfileState> {
    const validatedFields = ProfileSchema.safeParse({
        userId: formData.get('userId'),
        bio: formData.get('bio'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Invalid fields. Failed to update profile.',
            success: false
        };
    }
    
    const { userId, bio } = validatedFields.data;

    const updatedProfile = await updateUserProfile(userId, bio);

    if(!updatedProfile){
        return {
            message: 'Database error: Failed to update profile.',
            success: false
        }
    }

    revalidatePath('/profile');
    
    return {
        message: 'Profile updated successfully!',
        success: true
    }
}


export async function logout() {
  cookies().delete(SESSION_COOKIE_NAME);
  redirect('/login');
}