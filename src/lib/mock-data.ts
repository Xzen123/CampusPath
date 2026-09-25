import type { Testimonial, HeroSlide, Opportunity, User, StudentProfile, Application, Notification } from './definitions';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Alex Doe',
    email: 'student@example.com',
    password: 'password123',
    role: 'Student',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop'
  },
  {
    id: 'user-nitp',
    name: 'Rohan Kumar',
    email: 'student@nitp.ac.in',
    password: 'password123',
    role: 'Student',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1974&auto=format&fit=crop'
  },
  {
    id: 'user-iitp',
    name: 'Sneha Verma',
    email: 'student@iitp.ac.in',
    password: 'password123',
    role: 'Student',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop'
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'placement@example.com',
    password: 'password123',
    role: 'PlacementCell',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop'
  },
  {
    id: 'user-p-nitp',
    name: 'Rajesh Singh',
    email: 'placement@nitp.ac.in',
    password: 'password123',
    role: 'PlacementCell',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop'
  },
  {
    id: 'user-p-iitp',
    name: 'Priya Singh',
    email: 'placement@iitp.ac.in',
    password: 'password123',
    role: 'PlacementCell',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'user-3',
    name: 'Dr. Emily Carter',
    email: 'faculty@example.com',
    password: 'password123',
    role: 'FacultyMentor',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop'
  },
  {
    id: 'user-4',
    name: 'David Lee',
    email: 'employer@example.com',
    password: 'password123',
    role: 'Employer',
    avatarUrl: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=2070&auto=format&fit=crop'
  },
];

export const mockProfiles: StudentProfile[] = [
  {
    id: 'profile-1',
    userId: 'user-1',
    bio: 'A passionate computer science student with a keen interest in web development and AI. Eager to learn and contribute to challenging projects.',
    skills: [
      { id: 'skill-1', name: 'React' },
      { id: 'skill-2', name: 'Node.js' },
      { id: 'skill-3', name: 'Python' },
      { id: 'skill-4', name: 'Machine Learning' }
    ],
    projects: [
      {
        id: 'proj-1',
        title: 'E-commerce Website',
        description: 'Developed a full-stack e-commerce platform using the MERN stack with payment gateway integration.',
        imageUrl: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070&auto=format&fit=crop',
        projectUrl: '#'
      },
      {
        id: 'proj-2',
        title: 'Sentiment Analysis API',
        description: 'Built a REST API using Flask and NLTK to perform sentiment analysis on text data.',
        imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2070&auto=format&fit=crop',
        projectUrl: '#'
      }
    ],
    academics: [
      {
        id: 'acad-1',
        degree: 'B.Tech in Computer Science',
        institution: 'Example University',
        year: '2021-2025',
        gpa: '8.8'
      }
    ]
  },
  {
    id: 'profile-nitp',
    userId: 'user-nitp',
    bio: 'Final year B.Tech student at NIT Patna, passionate about data science and cloud computing.',
    skills: [
      { id: 'skill-n1', name: 'Python' },
      { id: 'skill-n2', name: 'SQL' },
      { id: 'skill-n3', name: 'AWS' },
      { id: 'skill-n4', name: 'Docker' }
    ],
    projects: [],
    academics: [
      { id: 'acad-n1', degree: 'B.Tech in Computer Science', institution: 'NIT Patna', year: '2020-2024', gpa: '8.2' }
    ]
  },
  {
    id: 'profile-iitp',
    userId: 'user-iitp',
    bio: 'Aspiring product manager with a strong technical background. Interested in user research and agile methodologies.',
    skills: [
      { id: 'skill-i1', name: 'Product Management' },
      { id: 'skill-i2', name: 'Agile' },
      { id: 'skill-i3', name: 'JIRA' },
      { id: 'skill-i4', name: 'Figma' }
    ],
    projects: [],
    academics: [
      { id: 'acad-i1', degree: 'B.Tech in Information Technology', institution: 'IIT Patna', year: '2020-2024', gpa: '9.1' }
    ]
  }
];

// Opportunities are now fetched live from Remotive, Arbeitnow, and Job APIs.
// Mock data is reserved strictly for test users and student profiles.
export const mockOpportunities: Opportunity[] = [];

// Mock applications for student user-1 (Alex Doe)
export const mockApplications: Application[] = [
  {
    id: 'app-1',
    userId: 'user-1',
    opportunityId: 'opp-1',
    status: 'Interview',
    appliedAt: '2024-05-21T10:00:00Z',
    updatedAt: '2024-05-25T14:00:00Z',
  },
  {
    id: 'app-2',
    userId: 'user-1',
    opportunityId: 'opp-5',
    status: 'Applied',
    appliedAt: '2024-05-22T09:00:00Z',
    updatedAt: '2024-05-22T09:00:00Z',
  },
  {
    id: 'app-3',
    userId: 'user-1',
    opportunityId: 'opp-2',
    status: 'Under Review',
    appliedAt: '2024-05-19T11:00:00Z',
    updatedAt: '2024-05-23T16:00:00Z',
  },
  {
    id: 'app-4',
    userId: 'user-nitp',
    opportunityId: 'opp-6',
    status: 'Applied',
    appliedAt: '2024-05-23T08:00:00Z',
    updatedAt: '2024-05-23T08:00:00Z',
  },
  {
    id: 'app-5',
    userId: 'user-nitp',
    opportunityId: 'opp-2',
    status: 'Offer',
    appliedAt: '2024-05-18T10:00:00Z',
    updatedAt: '2024-05-27T10:00:00Z',
  },
  {
    id: 'app-6',
    userId: 'user-iitp',
    opportunityId: 'opp-3',
    status: 'Interview',
    appliedAt: '2024-05-20T12:00:00Z',
    updatedAt: '2024-05-26T09:00:00Z',
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-1',
    title: 'Interview Scheduled',
    message: 'Innovate Inc. has scheduled an interview for Software Engineer Intern on June 1st.',
    read: false,
    createdAt: '2024-05-25T14:00:00Z',
    type: 'success',
  },
  {
    id: 'notif-2',
    userId: 'user-1',
    title: 'New Opportunity Match',
    message: 'A new Cloud DevOps Intern role at ScaleUp Infra matches your profile.',
    read: false,
    createdAt: '2024-05-22T12:00:00Z',
    type: 'info',
  },
  {
    id: 'notif-3',
    userId: 'user-1',
    title: 'Application Deadline Reminder',
    message: 'The deadline for Frontend Developer at Creative Solutions is in 7 days.',
    read: true,
    createdAt: '2024-05-21T09:00:00Z',
    type: 'warning',
  },
  {
    id: 'notif-4',
    userId: 'user-2',
    title: 'New Employer Registration',
    message: 'A new employer "ScaleUp Infra" has registered and is pending approval.',
    read: false,
    createdAt: '2024-05-22T12:00:00Z',
    type: 'info',
  },
  {
    id: 'notif-5',
    userId: 'user-2',
    title: 'Placement Milestone',
    message: 'Congratulations! 80 students have been placed this academic year.',
    read: false,
    createdAt: '2024-05-20T10:00:00Z',
    type: 'success',
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 'test-1',
    quote: "Campus Path's AI recommendations were spot on! It connected me with an internship that perfectly matched my skills and interests.",
    name: 'Priya Sharma',
    role: 'Student',
    college: 'NIT Patna',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop'
  },
  {
    id: 'test-2',
    quote: "Managing hundreds of applications used to be chaotic. Now, everything is streamlined, and we can easily track every student's progress.",
    name: 'Sunita Devi',
    role: 'Placement Officer',
    college: 'IIT Patna',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop'
  },
  {
    id: 'test-3',
    quote: "We found exceptional talent for our engineering team through Campus Path. The quality of candidates from various colleges is outstanding.",
    name: 'John Hammond',
    role: 'Recruiter',
    college: 'Innovate Inc.',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1974&auto=format&fit=crop'
  },
  {
    id: 'test-4',
    quote: "The analytics dashboard is a game-changer. We have a clear view of our placement statistics, which helps in our strategy.",
    name: 'Ravi Kumar',
    role: 'Placement Officer',
    college: 'IIT Bombay',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop'
  },
  {
    id: 'test-5',
    quote: "As a mentor, I can easily track my students' applications and provide them with targeted guidance. It's an invaluable tool.",
    name: 'Anjali Mehta',
    role: 'Professor',
    college: 'DTU',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop'
  },
];

export const heroSlides: HeroSlide[] = [
  {
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop",
    alt: "Students collaborating",
    hint: "students collaborating",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2072&auto=format&fit=crop",
    alt: "Modern university campus",
    hint: "university campus",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1579566346927-c68383817a25?q=80&w=2070&auto=format&fit=crop",
    alt: "Student presenting in a classroom",
    hint: "student presentation",
  },
];
