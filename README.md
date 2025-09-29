# CampusPath

An intelligent platform designed to connect students, faculty, and employers, streamlining the campus placement process with AI-powered opportunity recommendations.

## ✨ Key Features

- **Role-Based Dashboards:** Customized views for Students, Faculty, Employers, and the Placement Cell.
- **Secure Authentication:** Robust login and signup functionality for all user types.
- **Opportunity Listings:** A central hub to post, browse, and apply for jobs and internships.
- **AI-Powered Recommendations:** Leverages Google's Genkit to provide students with personalized opportunity suggestions based on their profile and interests.
- **User Profile Management:** Easy-to-use interface for users to update their information.
- **Responsive Design:** Fully accessible on both desktop and mobile devices.

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **AI Integration:** [Google Genkit](https://firebase.google.com/docs/genkit)
- **Deployment:** [Vercel](https://vercel.com/)

## 🛠️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or later recommended)
- [npm](https://www.npmjs.com/) or another package manager like yarn or pnpm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/CampusPath.git
    cd CampusPath
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env.local` in the root of your project and add the necessary environment variables. Your `.env` file can be used as a reference.

    ```env
    # Example variables (replace with your actual credentials)
    DATABASE_URL="your_database_connection_string"
    NEXTAUTH_URL="http://localhost:3000"
    NEXTAUTH_SECRET="a_secure_random_string_for_session_signing"
    GOOGLE_API_KEY="your_google_api_key_for_genkit"
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🌐 Deployment

This project is optimized for deployment on [Vercel](https://campuspath-ten.vercel.app/).

---

## 🔑 Mock User Accounts for Testing

Since the application is currently not connected to a live database, you can use the following mock accounts for testing all features.

### 🔒 Shared Password

The password is the same for **all** accounts listed below.

| Field | Value |
| :--- | :--- |
| **Password** | `password123` |

---

### 👥 Mock User Roles and Emails

Use one of the email addresses listed under the desired role along with the shared password above.

| Role | Email Examples | Access Level |
| :--- | :--- | :--- |
| **Student** | `student@example.com` | View job postings, apply for jobs. |
| | `student@nitp.ac.in` | |
| | `student@iitp.ac.in` | |
| **Placement Cell** | `placement@example.com` | Manage students, employers, and job postings. |
| | `placement@nitp.ac.in` | |
| | `placement@iitp.ac.in` | |
| **Faculty Mentor** | `faculty@example.com` | Approve student applications/mentorship tasks. |
| **Employer** | `employer@example.com` | Post jobs and view applications. |

---

1.  **Push to GitHub:** Ensure your latest code is pushed to your GitHub repository.
2.  **Import to Vercel:** Import the repository into Vercel. It will automatically detect the Next.js framework.
3.  **Add Environment Variables:** In your Vercel project settings, add the same environment variables from your `.env.local` file.
4.  **Deploy:** Vercel will build and deploy your application. Any subsequent pushes to the `main` branch will trigger automatic redeployments.
