import { getAllEmployers, getOpportunities } from '@/lib/data';
import { getUser } from '@/lib/session';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Briefcase, CheckCircle, Clock } from 'lucide-react';

export default async function EmployersPage() {
  const user = await getUser();
  if (!user || user.role !== 'PlacementCell') {
    redirect('/dashboard');
  }

  const [employers, opportunities] = await Promise.all([
    getAllEmployers(),
    getOpportunities(),
  ]);

  const oppsByEmployer: Record<string, number> = {};
  opportunities.forEach((o) => {
    if (o.employerId) oppsByEmployer[o.employerId] = (oppsByEmployer[o.employerId] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Building2 className="h-7 w-7 text-primary" /> Registered Employers
        </h1>
        <p className="text-muted-foreground mt-1">{employers.length} employer{employers.length !== 1 ? 's' : ''} on the platform.</p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-l-4 border-blue-500">
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">{employers.length}</p>
            <p className="text-sm text-muted-foreground">Total Employers</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-emerald-500">
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">{opportunities.length}</p>
            <p className="text-sm text-muted-foreground">Active Opportunities</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-amber-500">
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">{employers.filter((e) => (oppsByEmployer[e.id] || 0) === 0).length}</p>
            <p className="text-sm text-muted-foreground">Pending Approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Employer Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {employers.map((employer) => {
          const postCount = oppsByEmployer[employer.id] || 0;
          const isActive = postCount > 0;
          return (
            <Card key={employer.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-5 space-y-4">
                <div className="flex items-center gap-4">
                  <Image
                    src={employer.avatarUrl}
                    alt={employer.name}
                    width={48}
                    height={48}
                    className="rounded-full border-2 border-border flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{employer.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{employer.email}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-1 text-center p-2 bg-muted/40 rounded-lg">
                    <p className="text-lg font-bold">{postCount}</p>
                    <p className="text-xs text-muted-foreground">Jobs Posted</p>
                  </div>
                  <div className="flex-1 flex items-center justify-center p-2 rounded-lg">
                    {isActive ? (
                      <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20">
                        <CheckCircle className="h-3 w-3 mr-1" /> Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-amber-600 border-amber-500/30">
                        <Clock className="h-3 w-3 mr-1" /> Pending
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {employers.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Building2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No employers registered yet.</p>
        </div>
      )}
    </div>
  );
}
