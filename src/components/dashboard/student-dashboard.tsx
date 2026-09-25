import type { User, StudentProfile, Opportunity, Application, ApplicationStatus } from '@/lib/definitions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Briefcase, CheckCircle, Clock, TrendingUp, Trophy, XCircle, Eye } from 'lucide-react';
import OpportunityRecommendations from './opportunity-recommendations';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { formatDistanceToNow } from 'date-fns';

const statusConfig: Record<ApplicationStatus, { label: string; color: string; icon: React.ElementType }> = {
  'Applied':      { label: 'Applied',      color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',    icon: CheckCircle },
  'Under Review': { label: 'Under Review', color: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20', icon: Eye },
  'Interview':    { label: 'Interview',    color: 'bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20', icon: Clock },
  'Offer':        { label: 'Offer 🎉',     color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20', icon: Trophy },
  'Rejected':     { label: 'Rejected',     color: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',         icon: XCircle },
};

function StatCard({
  title, value, sub, icon: Icon, accent,
}: {
  title: string; value: string | number; sub: string; icon: React.ElementType; accent: string;
}) {
  return (
    <Card className={`border-l-4 ${accent}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{sub}</p>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: ApplicationStatus }) {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${config.color}`}>
      {config.label}
    </span>
  );
}

export default function StudentDashboard({
  user,
  profile,
  opportunities,
  applications,
}: {
  user: User;
  profile: StudentProfile | null;
  opportunities: Opportunity[];
  applications: Application[];
}) {
  if (!profile) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-muted-foreground">Loading your profile…</p>
      </div>
    );
  }

  const profileStrength = Math.min(
    100,
    (profile.skills.length > 0 ? 30 : 0) +
    (profile.projects.length > 0 ? 30 : 0) +
    (profile.academics.length > 0 ? 25 : 0) +
    (profile.bio.length > 50 ? 15 : 0)
  );

  // Enrich applications with opportunity details
  const enriched = applications.map((app) => ({
    ...app,
    opportunity: opportunities.find((o) => o.id === app.opportunityId),
  })).filter((a) => a.opportunity);

  const activeApps = applications.filter((a) => a.status !== 'Rejected').length;
  const pendingApps = applications.filter((a) => ['Applied', 'Under Review'].includes(a.status)).length;
  const offersCount = applications.filter((a) => a.status === 'Offer').length;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user.name.split(' ')[0]}! 👋
        </h1>
        <p className="text-muted-foreground">Here's a snapshot of your placement journey.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Opportunities" value={opportunities.length} sub="Available now" icon={Briefcase} accent="border-blue-500" />
        <StatCard title="Applications Sent" value={applications.length} sub={`${activeApps} active`} icon={CheckCircle} accent="border-emerald-500" />
        <StatCard title="Pending Response" value={pendingApps} sub="Awaiting update" icon={Clock} accent="border-amber-500" />
        <StatCard title="Offers Received" value={offersCount} sub={offersCount > 0 ? '🎉 Congratulations!' : 'Keep applying!'} icon={Trophy} accent="border-violet-500" />
      </div>

      {/* Profile Strength */}
      <Card className="bg-muted/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Profile Strength</CardTitle>
            <span className="text-sm font-bold text-primary">{profileStrength}%</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-700"
              style={{ width: `${profileStrength}%` }}
            />
          </div>
          {profile.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((s) => (
                <Badge key={s.id} variant="secondary">{s.name}</Badge>
              ))}
            </div>
          )}
          {profileStrength < 100 && (
            <p className="text-xs text-muted-foreground">
              💡 Add {!profile.skills.length ? 'skills, ' : ''}{!profile.projects.length ? 'projects, ' : ''}{!profile.academics.length ? 'academics' : ''} to strengthen your profile.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Application Tracker */}
      {enriched.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              My Applications
            </CardTitle>
            <CardDescription>Track the status of all your submitted applications.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enriched.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{app.opportunity?.title}</TableCell>
                    <TableCell className="text-muted-foreground">{app.opportunity?.company}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDistanceToNow(new Date(app.appliedAt), { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={app.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* AI Recommendations */}
      <OpportunityRecommendations userId={user.id} opportunities={opportunities} />
    </div>
  );
}
