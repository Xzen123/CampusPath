import type { User } from '@/lib/definitions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Users } from 'lucide-react';

export default function FacultyDashboard({ user }: { user: User }) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Mentor Dashboard</h1>
      <Card>
        <CardHeader>
            <CardTitle>Welcome, {user.name}</CardTitle>
            <CardDescription>This is your dashboard to manage your mentees and track their progress.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-center p-6 bg-muted/50 rounded-lg">
                <Users className="h-10 w-10 text-primary mr-4"/>
                <div>
                    <p className="text-2xl font-bold">15 Mentees Assigned</p>
                    <p className="text-muted-foreground">You can view their profiles and progress from the 'My Mentees' section.</p>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
