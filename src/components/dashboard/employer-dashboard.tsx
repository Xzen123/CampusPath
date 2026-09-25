import type { User, Opportunity } from '@/lib/definitions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { ShieldCheck, Briefcase, PlusCircle, Users } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import Link from 'next/link';
import { getAllApplications, getAllStudents } from '@/lib/data';
import { formatDistanceToNow } from 'date-fns';
import EmployerApplicantPipeline from './employer-applicant-pipeline';

export default async function EmployerDashboard({ user, opportunities }: { user: User; opportunities: Opportunity[] }) {
  // Opportunities posted by this employer
  const myOpportunities = opportunities.filter((o) => o.employerId === user.id);
  const [allApplications, allStudents] = await Promise.all([
    getAllApplications(),
    getAllStudents(),
  ]);

  const myOppIds = new Set(myOpportunities.map((o) => o.id));
  const employerApplications = allApplications.filter((a) => myOppIds.has(a.opportunityId));

  // App count per opportunity
  const appsByOpp: Record<string, number> = {};
  allApplications.forEach((a) => {
    appsByOpp[a.opportunityId] = (appsByOpp[a.opportunityId] || 0) + 1;
  });

  const isApproved = myOpportunities.length > 0;
  const totalApplicants = myOpportunities.reduce((sum, o) => sum + (appsByOpp[o.id] || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employer Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome, {user.name}.</p>
        </div>
        <Button asChild>
          <Link href="/opportunities/new"><PlusCircle className="mr-2 h-4 w-4" /> Post New Job</Link>
        </Button>
      </div>

      {/* Pending approval banner */}
      {!isApproved && (
        <Alert className="bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400">
          <ShieldCheck className="h-4 w-4 !text-amber-600 dark:!text-amber-500" />
          <AlertTitle className="font-bold">Account Pending Approval</AlertTitle>
          <AlertDescription>
            Your account is under review. You can post jobs and they'll be visible after approval by the placement cell.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-l-4 border-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jobs Posted</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myOpportunities.length}</div>
            <p className="text-xs text-muted-foreground">Active listings</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-violet-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplicants}</div>
            <p className="text-xs text-muted-foreground">Across all postings</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Applicants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {myOpportunities.length > 0 ? Math.round(totalApplicants / myOpportunities.length) : 0}
            </div>
            <p className="text-xs text-muted-foreground">Per job posting</p>
          </CardContent>
        </Card>
      </div>

      {/* My Job Postings */}
      {myOpportunities.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Your Job Postings</CardTitle>
            <CardDescription>Manage your active listings and view applicants.</CardDescription>
          </CardHeader>
          <CardContent className="divide-y">
            {myOpportunities.map((opp) => (
              <div key={opp.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{opp.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {opp.location || 'Remote'} • {opp.salary || 'Salary not specified'} •{' '}
                    {formatDistanceToNow(new Date(opp.postedAt), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{opp.type}</Badge>
                  <span className="text-sm font-medium">{appsByOpp[opp.id] || 0} applicants</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Briefcase className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <p className="font-semibold text-lg">No job postings yet</p>
            <p className="text-muted-foreground text-sm mt-1 mb-5">Get started by posting your first opportunity.</p>
            <Button asChild>
              <Link href="/opportunities/new"><PlusCircle className="mr-2 h-4 w-4" /> Post a Job</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Candidate Pipeline */}
      {myOpportunities.length > 0 && (
        <EmployerApplicantPipeline
          opportunities={myOpportunities}
          applications={employerApplications}
          students={allStudents}
        />
      )}
    </div>
  );
}
