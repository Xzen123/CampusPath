import type { User } from '@/lib/definitions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Users, BookOpen, TrendingUp, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '../ui/badge';
import { getAllStudents, getApplicationsByUserId } from '@/lib/data';

// Mock mentee assignment — first 3 students are assigned to this mentor
const MENTEE_LIMIT = 3;

export default async function FacultyDashboard({ user }: { user: User }) {
  const allStudents = await getAllStudents();
  const mentees = allStudents.slice(0, MENTEE_LIMIT);

  // Fetch application counts for each mentee
  const menteeData = await Promise.all(
    mentees.map(async (m) => {
      const apps = await getApplicationsByUserId(m.id);
      return {
        ...m,
        totalApps: apps.length,
        offers: apps.filter((a) => a.status === 'Offer').length,
        interviews: apps.filter((a) => a.status === 'Interview').length,
      };
    })
  );

  const totalPlaced = menteeData.filter((m) => m.offers > 0).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mentor Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, {user.name}. Track your mentees below.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-l-4 border-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mentees Assigned</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mentees.length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-violet-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Interview Stage</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{menteeData.filter((m) => m.interviews > 0).length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Placed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPlaced}</div>
          </CardContent>
        </Card>
      </div>

      {/* Mentee List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" /> My Mentees
          </CardTitle>
          <CardDescription>Application progress of your assigned students.</CardDescription>
        </CardHeader>
        <CardContent className="divide-y">
          {menteeData.map((mentee) => (
            <div key={mentee.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
              <Image
                src={mentee.avatarUrl}
                alt={mentee.name}
                width={40}
                height={40}
                className="rounded-full border flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{mentee.name}</p>
                <p className="text-xs text-muted-foreground truncate">{mentee.email}</p>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-muted-foreground">{mentee.totalApps} apps</span>
                {mentee.offers > 0 ? (
                  <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20">🎉 Placed</Badge>
                ) : mentee.interviews > 0 ? (
                  <Badge className="bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20">Interview</Badge>
                ) : (
                  <Badge variant="outline">Applying</Badge>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
