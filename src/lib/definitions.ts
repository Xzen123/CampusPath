
export type Role = 'Student' | 'PlacementCell' | 'FacultyMentor' | 'Employer';

export type User = {
  id: string;
  email: string;
  name: string;
  password?: string;
  role: Role;
  avatarUrl: string;
};

export type Opportunity = {
  id: string;
  title: string;
  company: string;
  logoUrl: string;
  description: string;
  eligibility: string[];
  tags: string[];
  type: 'Internship' | 'Full-time' | 'Training';
  postedAt: string;
  salary?: string;
  location?: string;
  deadline?: string;
  employerId?: string;
  sourcePlatform?: 'LinkedIn' | 'Indeed' | 'Internshala' | 'Unstop' | 'Campus';
  externalUrl?: string;
};

export type Skill = {
  id: string;
  name: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  projectUrl: string;
};

export type AcademicRecord = {
  id: string;
  degree: string;
  institution: string;
  year: string;
  gpa: string;
};

export type StudentProfile = {
  id: string;
  userId: string;
  bio: string;
  skills: Skill[];
  projects: Project[];
  academics: AcademicRecord[];
  resumeUrl?: string;
};

export type ApplicationStatus = 'Applied' | 'Under Review' | 'Interview' | 'Offer' | 'Rejected';

export type Application = {
  id: string;
  userId: string;
  opportunityId: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
};

export type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: 'info' | 'success' | 'warning';
};

export type Testimonial = {
    id: string;
    quote: string;
    name: string;
    role: string;
    college: string;
    avatarUrl: string;
}

export type HeroSlide = {
    imageUrl: string;
    alt: string;
    hint: string;
}
