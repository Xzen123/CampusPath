import type { User } from '@/lib/definitions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { ShieldCheck, Briefcase } from 'lucide-react';

export default function EmployerDashboard({ user }: { user: User }) {
  // In a real app, this would come from the user's data record
  const isApproved = false;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Employer Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {user.name}</CardTitle>
          <CardDescription>
            Manage your job postings and connect with top talent.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isApproved && (
            <Alert variant="default" className="bg-yellow-500/10 border-yellow-500/30 text-yellow-700 dark:text-yellow-400">
              <ShieldCheck className="h-4 w-4 !text-yellow-600 dark:!text-yellow-500" />
              <AlertTitle className='font-bold'>Account Pending Approval</AlertTitle>
              <AlertDescription>
                Your account is currently under review by the placement cell. You will be notified once it's approved. You can post jobs after approval.
              </AlertDescription>
            </Alert>
          )}

           <div className="flex items-center p-6 bg-muted/50 rounded-lg">
                <Briefcase className="h-10 w-10 text-primary mr-4"/>
                <div>
                    <p className="text-2xl font-bold">0 Active Job Postings</p>
                    <p className="text-muted-foreground">Use the 'Post Job' link in the sidebar to create a new opportunity.</p>
                </div>
            </div>

        </CardContent>
      </Card>
    </div>
  );
}
