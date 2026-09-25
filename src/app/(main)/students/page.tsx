import { getAllStudents, getAllApplications } from '@/lib/data';
import { getUser } from '@/lib/session';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, GraduationCap, TrendingUp } from 'lucide-react';

export default async function StudentsPage() {
  const user = await getUser();
  if (!user || (user.role !== 'PlacementCell' && user.role !== 'FacultyMentor')) {
    redirect('/dashboard');
  }

  const [students, allApplications] = await Promise.all([
    getAllStudents(),
    getAllApplications(),
  ]);

  const appCountByUser: Record<string, number> = {};
  allApplications.forEach((a) => {
    appCountByUser[a.userId] = (appCountByUser[a.userId] || 0) + 1;
  });

  const offerCountByUser: Record<string, number> = {};
  allApplications.filter((a) => a.status === 'Offer').forEach((a) => {
    offerCountByUser[a.userId] = (offerCountByUser[a.userId] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-7 w-7 text-primary" />
            {user.role === 'FacultyMentor' ? 'My Mentees' : 'All Students'}
          </h1>
          <p className="text-muted-foreground mt-1">{students.length} students registered on the platform.</p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-l-4 border-blue-500">
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">{students.length}</p>
            <p className="text-sm text-muted-foreground">Total Students</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-emerald-500">
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">{allApplications.length}</p>
            <p className="text-sm text-muted-foreground">Total Applications</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-amber-500">
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">{Object.values(offerCountByUser).reduce((a, b) => a + b, 0)}</p>
            <p className="text-sm text-muted-foreground">Offers Received</p>
          </CardContent>
        </Card>
      </div>

      {/* Students Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {students.map((student) => {
          const apps = appCountByUser[student.id] || 0;
          const offers = offerCountByUser[student.id] || 0;
          return (
            <Card key={student.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-5">
                <div className="flex items-center gap-4">
                  <Image
                    src={student.avatarUrl}
                    alt={student.name}
                    width={48}
                    height={48}
                    className="rounded-full border-2 border-border flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{student.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{student.email}</p>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <div className="flex-1 text-center p-2 bg-muted/40 rounded-lg">
                    <p className="text-lg font-bold">{apps}</p>
                    <p className="text-xs text-muted-foreground">Applications</p>
                  </div>
                  <div className="flex-1 text-center p-2 bg-emerald-500/10 rounded-lg">
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{offers}</p>
                    <p className="text-xs text-muted-foreground">Offers</p>
                  </div>
                </div>
                {offers > 0 && (
                  <Badge className="mt-3 w-full justify-center bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20">
                    🎉 Placed
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
