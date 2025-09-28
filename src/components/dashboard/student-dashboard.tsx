import type { User, StudentProfile, Opportunity } from '@/lib/definitions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Briefcase, CheckCircle, Clock } from 'lucide-react';
import OpportunityRecommendations from './opportunity-recommendations';

export default function StudentDashboard({ user, profile, opportunities }: { user: User; profile: StudentProfile | null; opportunities: Opportunity[] }) {
  if (!profile) {
    return <div>Loading profile...</div>
  }
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome back, {user.name.split(' ')[0]}!</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recommended Jobs
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Based on your profile
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Applications Sent
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Applications
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Awaiting response
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <OpportunityRecommendations profile={profile} opportunities={opportunities} />
      </div>
    </div>
  );
}
