import type { Testimonial, HeroSlide, Opportunity, User, StudentProfile } from './definitions';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Alex Doe',
    email: 'student@example.com',
    password: 'password123',
    role: 'Student',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 'user-nitp',
    name: 'Rohan Kumar',
    email: 'student@nitp.ac.in',
    password: 'password123',
    role: 'Student',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 'user-iitp',
    name: 'Sneha Verma',
    email: 'student@iitp.ac.in',
    password: 'password123',
    role: 'Student',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'placement@example.com',
    password: 'password123',
    role: 'PlacementCell',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
    {
    id: 'user-p-nitp',
    name: 'Rajesh Singh',
    email: 'placement@nitp.ac.in',
    password: 'password123',
    role: 'PlacementCell',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
    {
    id: 'user-p-iitp',
    name: 'Priya Singh',
    email: 'placement@iitp.ac.in',
    password: 'password123',
    role: 'PlacementCell',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 'user-3',
    name: 'Dr. Emily Carter',
    email: 'faculty@example.com',
    password: 'password123',
    role: 'FacultyMentor',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 'user-4',
    name: 'David Lee',
    email: 'employer@example.com',
    password: 'password123',
    role: 'Employer',
    avatarUrl: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
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
                imageUrl: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                projectUrl: '#'
            },
            {
                id: 'proj-2',
                title: 'Sentiment Analysis API',
                description: 'Built a REST API using Flask and NLTK to perform sentiment analysis on text data.',
                imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
    }
];

export const mockOpportunities: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'Software Engineer Intern',
    company: 'Innovate Inc.',
    logoUrl: 'https://images.unsplash.com/photo-1556761175-5773895a345e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Work on our flagship product and help us build the future of AI. You will be working with a team of experienced engineers on challenging problems.',
    eligibility: ['B.Tech', 'M.Tech'],
    tags: ['React', 'Node.js', 'TypeScript', 'AI'],
    type: 'Internship',
    postedAt: '2024-05-20T10:00:00Z',
  },
  {
    id: 'opp-2',
    title: 'Data Analyst',
    company: 'Data Insights Co.',
    logoUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Analyze large datasets to extract meaningful insights. You will be responsible for creating dashboards and reports for our clients.',
    eligibility: ['B.Sc (Stats)', 'B.Tech'],
    tags: ['SQL', 'Python', 'Tableau', 'Pandas'],
    type: 'Full-time',
    postedAt: '2024-05-18T14:30:00Z',
  },
  {
    id: 'opp-3',
    title: 'Product Management Intern',
    company: 'Product-First Ltd.',
    logoUrl: 'https://images.unsplash.com/photo-1556742212-5b321f3c26a5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Join our product team to define and ship new features. You will conduct user research, write specifications, and work with engineering.',
    eligibility: ['MBA', 'B.Tech'],
    tags: ['Product Management', 'Agile', 'JIRA'],
    type: 'Internship',
    postedAt: '2024-05-19T11:00:00Z',
  },
  {
    id: 'opp-4',
    title: 'Advanced Java Training',
    company: 'CodeMasters Academy',
    logoUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'A 6-week intensive training program on advanced Java concepts, including Spring Boot, Microservices, and Hibernate.',
    eligibility: ['B.Tech', 'M.Tech', 'MCA'],
    tags: ['Java', 'Spring Boot', 'Microservices'],
    type: 'Training',
    postedAt: '2024-05-15T09:00:00Z',
  },
  {
    id: 'opp-5',
    title: 'Frontend Developer',
    company: 'Creative Solutions',
    logoUrl: 'https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'We are looking for a creative frontend developer to build beautiful and responsive user interfaces for our clients.',
    eligibility: ['Any Graduate'],
    tags: ['HTML', 'CSS', 'JavaScript', 'Next.js'],
    type: 'Full-time',
    postedAt: '2024-05-21T18:00:00Z',
  },
  {
    id: 'opp-6',
    title: 'Cloud DevOps Intern',
    company: 'ScaleUp Infra',
    logoUrl: 'https://images.unsplash.com/photo-1518432835214-3d3870455927?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Manage and automate our cloud infrastructure on AWS. You will learn about CI/CD, Docker, and Kubernetes.',
    eligibility: ['B.Tech', 'M.Tech'],
    tags: ['AWS', 'CI/CD', 'Docker', 'Kubernetes'],
    type: 'Internship',
    postedAt: '2024-05-22T12:00:00Z',
  },
];


export const testimonials: Testimonial[] = [
  {
    id: 'test-1',
    quote: 'Campus Path\'s AI recommendations were spot on! It connected me with an internship that perfectly matched my skills and interests.',
    name: 'Priya Sharma',
    role: 'Student',
    college: 'NIT Patna',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 'test-2',
    quote: 'Managing hundreds of applications used to be chaotic. Now, everything is streamlined, and we can easily track every student\'s progress.',
    name: 'Sunita Devi',
    role: 'Placement Officer',
    college: 'IIT Patna',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 'test-3',
    quote: 'We found exceptional talent for our engineering team through Campus Path. The quality of candidates from various colleges is outstanding.',
    name: 'John Hammond',
    role: 'Recruiter',
    college: 'Innovate Inc.',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
    id: 'test-4',
    quote: 'The analytics dashboard is a game-changer. We have a clear view of our placement statistics, which helps in our strategy.',
    name: 'Ravi Kumar',
    role: 'Placement Officer',
    college: 'IIT Bombay',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
    id: 'test-5',
    quote: 'As a mentor, I can easily track my students\' applications and provide them with targeted guidance. It\'s an invaluable tool.',
    name: 'Anjali Mehta',
    role: 'Professor',
    college: 'DTU',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
];


export const heroSlides: HeroSlide[] = [
  {
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Students collaborating",
    hint: "students collaborating",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Modern university campus",
    hint: "university campus",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1579566346927-c68383817a25?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Student presenting in a classroom",
    hint: "student presentation",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1516594798947-e65505dbb29d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Job interview",
    hint: "job interview",
  },
   {
    imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Placement cell office",
    hint: "modern office",
  },
];
