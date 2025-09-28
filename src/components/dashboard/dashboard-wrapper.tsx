import { getUser } from '@/lib/session';
import { redirect } from 'next/navigation';
import StudentDashboard from '@/components/dashboard/student-dashboard';
import PlacementCellDashboard from '@/components/dashboard/placement-cell-dashboard';
import FacultyDashboard from '@/components/dashboard/faculty-dashboard';
import EmployerDashboard from '@/components/dashboard/employer-dashboard';
import { findProfileByUserId, getOpportunities } from '@/lib/data';

const dashboardComponents = {
  Student: StudentDashboard,
  PlacementCell: PlacementCellDashboard,
  FacultyMentor: FacultyDashboard,
  Employer: EmployerDashboard,
};

export default async function DashboardWrapper() {
  const user = await getUser();
  if (!user) {
    redirect('/login');
  }

  const DashboardComponent = dashboardComponents[user.role];

  let studentProfile = null;
  if(user.role === 'Student') {
    studentProfile = await findProfileByUserId(user.id);
  }

  const opportunities = await getOpportunities();

  return <DashboardComponent user={user} profile={studentProfile} opportunities={opportunities} />;
}
