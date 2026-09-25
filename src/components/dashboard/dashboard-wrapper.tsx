import { getUser } from '@/lib/session';
import { redirect } from 'next/navigation';
import StudentDashboard from '@/components/dashboard/student-dashboard';
import PlacementCellDashboard from '@/components/dashboard/placement-cell-dashboard';
import FacultyDashboard from '@/components/dashboard/faculty-dashboard';
import EmployerDashboard from '@/components/dashboard/employer-dashboard';
import { findProfileByUserId, getOpportunities, getApplicationsByUserId } from '@/lib/data';

export default async function DashboardWrapper() {
  const user = await getUser();
  if (!user) {
    redirect('/login');
  }

  const opportunities = await getOpportunities();

  if (user.role === 'Student') {
    const [profile, applications] = await Promise.all([
      findProfileByUserId(user.id),
      getApplicationsByUserId(user.id),
    ]);
    return (
      <StudentDashboard
        user={user}
        profile={profile}
        opportunities={opportunities}
        applications={applications}
      />
    );
  }

  if (user.role === 'PlacementCell') {
    return <PlacementCellDashboard user={user} opportunities={opportunities} />;
  }

  if (user.role === 'FacultyMentor') {
    return <FacultyDashboard user={user} />;
  }

  if (user.role === 'Employer') {
    return <EmployerDashboard user={user} opportunities={opportunities} />;
  }

  return null;
}
