'use client';

import type { User, Opportunity } from '@/lib/definitions';
import { Activity, Briefcase, Users, CheckCircle, BarChart3, Building2, GraduationCap, TrendingUp, Award, Banknote } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const placementByCompany = [
  { company: 'Innovate Inc.', placed: 18 },
  { company: 'Data Insights', placed: 12 },
  { company: 'Creative Sol.', placed: 15 },
  { company: 'ScaleUp Infra', placed: 9 },
  { company: 'Product-First', placed: 11 },
  { company: 'CodeMasters', placed: 17 },
];

const branchWisePlacement = [
  { branch: 'CSE', rate: 94 },
  { branch: 'IT', rate: 91 },
  { branch: 'ECE', rate: 84 },
  { branch: 'EE', rate: 76 },
  { branch: 'Mech', rate: 72 },
  { branch: 'Civil', rate: 68 },
];

const ctcDistribution = [
  { range: '< 6 LPA', students: 45, fill: '#60a5fa' },
  { range: '6-12 LPA', students: 120, fill: '#3b82f6' },
  { range: '12-20 LPA', students: 85, fill: '#8b5cf6' },
  { range: '20+ LPA', students: 32, fill: '#10b981' },
];

const applicationFunnel = [
  { name: 'Applied', value: 573, color: '#3b82f6' },
  { name: 'Reviewed', value: 340, color: '#8b5cf6' },
  { name: 'Interview', value: 180, color: '#f59e0b' },
  { name: 'Offer', value: 82, color: '#10b981' },
];

const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#f43f5e', '#6366f1'];

function StatCard({ title, value, sub, icon: Icon, accent }: {
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

export default function PlacementCellDashboard({ user, opportunities }: { user: User; opportunities: Opportunity[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Placement Cell Dashboard</h1>
          <p className="text-muted-foreground">Overview of campus placement activity.</p>
        </div>
        <Button asChild>
          <Link href="/opportunities/new"><Briefcase className="mr-2 h-4 w-4" /> Add New Opportunity</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Opportunities" value={opportunities.length} sub="+2 this month" icon={Briefcase} accent="border-blue-500" />
        <StatCard title="Student Registrations" value="1,245" sub="+180 from last month" icon={Users} accent="border-violet-500" />
        <StatCard title="Total Applications" value="573" sub="+201 since last week" icon={Activity} accent="border-amber-500" />
        <StatCard title="Placements Made" value="82" sub="+12 since last month" icon={CheckCircle} accent="border-emerald-500" />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Placements by Company
            </CardTitle>
            <CardDescription>Top companies by number of students placed</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={placementByCompany} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="company" tick={{ fontSize: 10 }} className="text-muted-foreground" />
                <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Bar dataKey="placed" radius={[4, 4, 0, 0]}>
                  {placementByCompany.map((_, idx) => (
                    <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Application Funnel
            </CardTitle>
            <CardDescription>Breakdown of application stages this semester</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={applicationFunnel} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {applicationFunnel.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                />
                <Legend iconType="circle" iconSize={8} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Branch-wise & CTC Distribution */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Branch-wise Placement Rate */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Branch-wise Placement Rate
            </CardTitle>
            <CardDescription>Percentage of registered students placed by engineering discipline</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={branchWisePlacement} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="branch" tick={{ fontSize: 11 }} className="text-muted-foreground" />
                <YAxis unit="%" domain={[0, 100]} tick={{ fontSize: 11 }} className="text-muted-foreground" />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Placement Rate']}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                />
                <Bar dataKey="rate" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Salary CTC Distribution */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Banknote className="h-5 w-5 text-primary" />
                  Salary Package Distribution
                </CardTitle>
                <CardDescription>Annual CTC breakdown across placed students</CardDescription>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded border border-emerald-500/20">
                  Highest: ₹44 LPA
                </span>
                <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold px-2 py-0.5 rounded border border-blue-500/20">
                  Avg: ₹14.2 LPA
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={ctcDistribution} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="range" tick={{ fontSize: 10 }} className="text-muted-foreground" />
                <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" />
                <Tooltip
                  formatter={(val: any) => [`${val} students`, 'Count']}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                />
                <Bar dataKey="students" radius={[4, 4, 0, 0]}>
                  {ctcDistribution.map((entry, idx) => (
                    <Cell key={idx} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Opportunities Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Opportunities</CardTitle>
              <CardDescription>A list of the most recently added opportunities.</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/opportunities">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Posted On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {opportunities.slice(0, 5).map((opp) => (
                <TableRow key={opp.id}>
                  <TableCell className="font-medium">{opp.company}</TableCell>
                  <TableCell>{opp.title}</TableCell>
                  <TableCell><Badge variant="outline">{opp.type}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{opp.location || '—'}</TableCell>
                  <TableCell className="text-muted-foreground">{new Date(opp.postedAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
