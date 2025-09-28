import type { User, Opportunity, StudentProfile, Role } from './definitions';
import { mockOpportunities, mockUsers, mockProfiles } from './mock-data';

// --- DATA ACCESS FUNCTIONS (MOCK) ---

export async function getOpportunities(): Promise<Opportunity[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 50));
  return mockOpportunities;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  const user = mockUsers.find((user) => user.email === email);
  return user ? { ...user } : null;
}

export async function findUserById(userId: string): Promise<User | null> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  const user = mockUsers.find((user) => user.id === userId);
  return user ? { ...user } : null;
}

export async function createUser(userData: Omit<User, 'id'>): Promise<User | null> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  const newUser: User = {
    id: `user-${Date.now()}`,
    ...userData,
  };
  mockUsers.push(newUser);
  return { ...newUser };
}

export async function findProfileByUserId(userId: string): Promise<StudentProfile | null> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  
  const profile = mockProfiles.find((p) => p.userId === userId);
  
  if (profile) {
    return { ...profile };
  }

  // If no profile, check if the user exists and is a student
  const user = await findUserById(userId);
  if (user && user.role === 'Student') {
    // Create and return a default profile if one doesn't exist for a student
    const newProfile: StudentProfile = {
      id: `profile-${Date.now()}`,
      userId: userId,
      bio: `A new student at ${user.email.split('@')[1] || 'your university'}.`,
      skills: [],
      projects: [],
      academics: [],
    };
    mockProfiles.push(newProfile);
    return { ...newProfile };
  }

  return null;
}

export async function updateUserProfile(userId: string, bio: string): Promise<StudentProfile | null> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  const profileIndex = mockProfiles.findIndex((p) => p.userId === userId);

  if (profileIndex !== -1) {
    mockProfiles[profileIndex].bio = bio;
    return { ...mockProfiles[profileIndex] };
  }
  
  // If profile doesn't exist, create it (shouldn't happen with findProfileByUserId logic)
  const user = await findUserById(userId);
  if (user && user.role === 'Student') {
    const newProfile: StudentProfile = {
      id: `profile-${Date.now()}`,
      userId: userId,
      bio: bio,
      skills: [],
      projects: [],
      academics: [],
    };
    mockProfiles.push(newProfile);
    return { ...newProfile };
  }
  
  return null;
}
