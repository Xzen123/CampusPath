'use client';

import { useState, useTransition } from 'react';
import type { Opportunity, Application, ApplicationStatus, User } from '@/lib/definitions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Download,
  Search,
  Filter,
  Users,
  CheckCircle2,
  Clock,
  Briefcase,
  Loader2,
} from 'lucide-react';
import { exportToCsv } from '@/lib/export-csv';
import { updateApplicationStatusAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

export default function EmployerApplicantPipeline({
  opportunities,
  applications,
  students,
}: {
  opportunities: Opportunity[];
  applications: Application[];
  students: User[];
}) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [selectedOppId, setSelectedOppId] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [apps, setApps] = useState<Application[]>(applications);

  // Student lookup map
  const studentMap = new Map<string, User>();
  students.forEach((s) => studentMap.set(s.id, s));

  // Opportunity lookup map
  const oppMap = new Map<string, Opportunity>();
  opportunities.forEach((o) => oppMap.set(o.id, o));

  // Filtered applications
  const filteredApps = apps.filter((app) => {
    if (selectedOppId !== 'ALL' && app.opportunityId !== selectedOppId) return false;
    if (selectedStatus !== 'ALL' && app.status !== selectedStatus) return false;

    if (searchQuery.trim()) {
      const student = studentMap.get(app.userId);
      const opp = oppMap.get(app.opportunityId);
      const q = searchQuery.toLowerCase();
      const nameMatch = student?.name?.toLowerCase().includes(q) || false;
      const emailMatch = student?.email?.toLowerCase().includes(q) || false;
      const oppMatch = opp?.title?.toLowerCase().includes(q) || false;
      if (!nameMatch && !emailMatch && !oppMatch) return false;
    }

    return true;
  });

  const handleStatusChange = (appId: string, newStatus: ApplicationStatus) => {
    startTransition(async () => {
      // Optimistic update
      setApps((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
      );

      const res = await updateApplicationStatusAction(appId, newStatus);
      if (res.success) {
        toast({
          title: 'Status Updated',
          description: res.message,
        });
      } else {
        toast({
          title: 'Update Failed',
          description: res.message,
          variant: 'destructive',
        });
      }
    });
  };

  const handleExportCsv = () => {
    const headers = ['Student Name', 'Student Email', 'Job Title', 'Company', 'Status', 'Applied Date'];
    const rows = filteredApps.map((app) => {
      const student = studentMap.get(app.userId);
      const opp = oppMap.get(app.opportunityId);
      return [
        student?.name || 'Unknown',
        student?.email || 'Unknown',
        opp?.title || 'Unknown',
        opp?.company || 'Company',
        app.status,
        new Date(app.appliedAt).toLocaleDateString(),
      ];
    });

    exportToCsv('campuspath-applicants', headers, rows);
    toast({
      title: 'CSV Exported',
      description: `Downloaded ${rows.length} applicant records.`,
    });
  };

  const getStatusBadgeClass = (status: ApplicationStatus) => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30';
      case 'Under Review':
        return 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30';
      case 'Interview':
        return 'bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/30';
      case 'Offer':
        return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
      case 'Rejected':
        return 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30';
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b bg-gradient-to-r from-primary/5 via-transparent to-transparent">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Applicant Pipeline & Status Management
            </CardTitle>
            <CardDescription>
              Manage student applications, advance candidates across stages, and export applicant data.
            </CardDescription>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            disabled={filteredApps.length === 0}
            className="gap-2 self-start sm:self-auto"
          >
            <Download className="h-4 w-4" />
            Export CSV ({filteredApps.length})
          </Button>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by student or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>

          <Select value={selectedOppId} onValueChange={setSelectedOppId}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="All Opportunities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Opportunities ({opportunities.length})</SelectItem>
              {opportunities.map((o) => (
                <SelectItem key={o.id} value={o.id}>
                  {o.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Stages</SelectItem>
              <SelectItem value="Applied">Applied</SelectItem>
              <SelectItem value="Under Review">Under Review</SelectItem>
              <SelectItem value="Interview">Interview</SelectItem>
              <SelectItem value="Offer">Offer</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {filteredApps.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-sm space-y-1">
            <p className="font-semibold text-foreground">No applicants found</p>
            <p className="text-xs">Try adjusting your filters or job selection above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs text-muted-foreground uppercase border-b">
                <tr>
                  <th className="py-3 px-4 text-left">Student</th>
                  <th className="py-3 px-4 text-left">Applied Role</th>
                  <th className="py-3 px-4 text-left">Applied</th>
                  <th className="py-3 px-4 text-left">Current Stage</th>
                  <th className="py-3 px-4 text-right">Update Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredApps.map((app) => {
                  const student = studentMap.get(app.userId);
                  const opp = oppMap.get(app.opportunityId);
                  const timeAgo = formatDistanceToNow(new Date(app.appliedAt), { addSuffix: true });

                  return (
                    <tr key={app.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-foreground">{student?.name || 'Student'}</div>
                        <div className="text-xs text-muted-foreground">{student?.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium">{opp?.title || 'Job'}</div>
                        <div className="text-xs text-muted-foreground">{opp?.company}</div>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-muted-foreground">
                        {timeAgo}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant="outline" className={getStatusBadgeClass(app.status)}>
                          {app.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Select
                          value={app.status}
                          onValueChange={(val) => handleStatusChange(app.id, val as ApplicationStatus)}
                          disabled={isPending}
                        >
                          <SelectTrigger className="w-36 h-8 text-xs ml-auto">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Applied">Applied</SelectItem>
                            <SelectItem value="Under Review">Under Review</SelectItem>
                            <SelectItem value="Interview">Interview</SelectItem>
                            <SelectItem value="Offer">Offer</SelectItem>
                            <SelectItem value="Rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
