# 🎓 CampusPath — Next-Gen AI Campus Placement & Career Ecosystem

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)](https://www.mongodb.com/atlas)
[![Google Genkit](https://img.shields.io/badge/Google-Genkit%20%26%20Gemini-orange?logo=google)](https://firebase.google.com/docs/genkit)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

An enterprise-grade, intelligent campus recruitment platform connecting **Students**, **Placement Officers**, **Faculty Mentors**, and **Corporate Employers**. Powered by **Next.js 15 App Router**, **MongoDB Atlas**, **Google Gemini AI**, and a **Live Job Ingestion Engine** that aggregates real-time career opportunities directly from major tech job boards.

---

## ✨ Key Highlights & Features

### 1. 🌐 Live Multi-Platform Opportunity Aggregator
- **Real-Time Job Feeds**: Live ingestion from public job APIs (**Remotive** and **Arbeitnow**) and optional RapidAPI adapters for **LinkedIn** and **Indeed**.
- **Source Platform Badges**: Color-coded badges for *LinkedIn* (blue), *Indeed* (indigo), *Internshala* (cyan), *Unstop* (violet), and *Campus Exclusive* (emerald).
- **Direct External Apply & Internal ATS**: 1-click external application link or internal profile submission with deadline countdowns and salary transparency.
- **On-Demand Live Sync**: Dedicated `/api/opportunities/sync` endpoint and live UI sync button with auto-sync fallback.

### 2. 🤖 Gemini AI Career Suite (Google Genkit)
- **AI ATS Resume Analyzer**: Evaluates student resume suitability against specific job descriptions, generating an ATS compatibility score (0-100%), matching skills, missing keywords, and actionable suggestions.
- **Interactive AI Mock Interviewer**: Generates tailored, role-specific technical and behavioral interview questions based on job requirements and student background.
- **Smart Opportunity Recommendations**: Vector and profile-based recommendations matching student skills, GPA, and projects with open vacancies.

### 3. 👥 Multi-Role Tailored Dashboards
- **Student Dashboard**: Application tracking, bookmarking, AI opportunity recommendations, profile completion status, and ATS resume checker.
- **Placement Cell Dashboard**: Campus-wide recruitment metrics, student directory, placement analytics, employer verifications, and one-click CSV report exports.
- **Employer Dashboard & Kanban Pipeline**: Interactive drag-and-drop / select candidate pipeline (`Applied` ➔ `Under Review` ➔ `Interview` ➔ `Offer` ➔ `Rejected`), applicant search, and job posting management.
- **Faculty Mentor Dashboard**: Student progress monitoring, mentoring assignments, and recommendation endorsements.

### 4. 🔐 Enterprise Authentication & Google Sign-In
- **1-Click Google Sign-In**: Branded Google OAuth button on Login and Signup pages.
- **HMAC-SHA256 JWT Sessions**: Cryptographically signed HTTP-only cookies with role-based routing and protected middleware.
- **BCrypt Password Hashing**: Secure credential storage in MongoDB Atlas.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | [Next.js 15](https://nextjs.org/) (App Router), React 18, [shadcn/ui](https://ui.shadcn.com/), Tailwind CSS, Lucide Icons |
| **Backend & APIs** | Next.js Server Components, Server Actions, Route Handlers |
| **Database & ODM** | [MongoDB Atlas](https://www.mongodb.com/atlas) with [Mongoose](https://mongoosejs.com/) |
| **Authentication** | Custom HMAC-SHA256 Web Crypto JWT, BCrypt.js, Google OAuth |
| **AI / LLM** | [Google Genkit](https://firebase.google.com/docs/genkit), Google Gemini 1.5 Flash |
| **Data Ingestion** | Remotive API, Arbeitnow API, JSearch / RapidAPI adapter |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.x` or `v20.x` or higher
- **npm** or **pnpm** / **yarn**
- **MongoDB Atlas URI** (or local MongoDB)
- **Google AI Studio API Key** (for Gemini features)

### 1. Installation
```bash
# Clone repository
git clone https://github.com/Xzen123/CampusPath.git
cd CampusPath

# Install dependencies
npm install
```

### 2. Environment Configuration
Create a `.env.local` file in the root directory:

```env
# MongoDB Atlas
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/campuspath?retryWrites=true&w=majority"

# Google AI Studio (for Gemini ATS & Genkit)
GOOGLE_API_KEY="your_google_ai_studio_api_key"

# Auth Session Secret
NEXTAUTH_SECRET="your_long_random_jwt_secret_key"
NEXTAUTH_URL="http://localhost:3000"

# Optional: RapidAPI Key for LinkedIn & Indeed Indian Tech Search
# RAPIDAPI_KEY="your_rapidapi_key"
```

### 3. Database Seeding & Live Job Ingestion
Run the automated seed script to populate test accounts and fetch live job postings:
```bash
npx tsx src/backend/seed.ts
```
This will:
- Seed demo student, placement officer, faculty, and employer accounts.
- Fetch 40+ live tech opportunities from real-world job APIs into MongoDB.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Credentials for Testing

Use the shared password `password123` for all test accounts:

| Role | Email | Capabilities |
| :--- | :--- | :--- |
| **Student (Alex)** | `student@example.com` | Job search, ATS analysis, applications, mock interview |
| **Student (NIT Patna)** | `student@nitp.ac.in` | Profile management, academic records, live job apply |
| **Student (IIT Patna)** | `student@iitp.ac.in` | Portfolio projects, skill tags, live job search |
| **Placement Officer** | `placement@example.com` | Placement metrics, student directory, CSV export |
| **Faculty Mentor** | `faculty@example.com` | Mentee oversight, application endorsements |
| **Employer / Recruiter** | `employer@example.com` | Post opportunities, Kanban candidate pipeline management |

*Or click **"Continue with Google"** on `/login` for instantaneous 1-click authentication.*

---

## 📂 Project Structure

```text
CampusPath/
├── src/
│   ├── ai/                          # Google Genkit AI flows (ATS, Mock Interview, Recommender)
│   ├── app/
│   │   ├── (auth)/                  # Login & Signup pages with Google Sign-in
│   │   ├── (main)/                  # Protected role dashboards, opportunities, students
│   │   └── api/                     # REST endpoints (live job sync, applications, users)
│   ├── backend/
│   │   ├── db/                      # Mongoose connection & schemas (User, Profile, Opp, App)
│   │   ├── services/                # Database service layer & live-jobs ingestion engine
│   │   └── seed.ts                  # Database seeding script
│   ├── components/
│   │   ├── ai/                      # ATS analyzer & Mock Interview modal components
│   │   ├── auth/                    # Login, Signup, and Google Sign-In buttons
│   │   ├── dashboard/               # Role-specific dashboard layouts & Kanban pipeline
│   │   ├── layout/                  # Navigation bar, Sidebar, and Footer
│   │   ├── opportunities/           # Opportunity card, live filter tabs, search bar
│   │   └── ui/                      # shadcn/ui component primitives
│   ├── lib/                         # JWT signing, session handlers, CSV export, definitions
│   └── middleware.ts                # Edge-compatible authentication middleware
```

---

## 📄 License
This project is licensed under the MIT License — see the LICENSE file for details.
