'use client';

import { useState, useTransition } from 'react';
import { postOpportunity, type PostJobState } from '@/lib/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useActionState } from 'react';
import { Briefcase, CheckCircle } from 'lucide-react';

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="text-xs text-destructive mt-1">{errors[0]}</p>;
}

export default function PostJobPage() {
  const [state, formAction] = useActionState<PostJobState | undefined, FormData>(
    postOpportunity,
    undefined
  );
  const [type, setType] = useState<string>('Internship');

  if (state?.success) {
    return (
      <div className="max-w-lg mx-auto mt-16 text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="h-8 w-8 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold">Opportunity Posted!</h2>
        <p className="text-muted-foreground">{state.message}</p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => window.location.reload()}>Post Another</Button>
          <Button asChild><a href="/opportunities">View All</a></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Briefcase className="h-7 w-7 text-primary" /> Post a New Opportunity
        </h1>
        <p className="text-muted-foreground mt-1">Fill in the details to list a new job, internship, or training.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Opportunity Details</CardTitle>
          <CardDescription>All fields marked * are required.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-5">
            {/* Hidden type field synced to Select */}
            <input type="hidden" name="type" value={type} />

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="title">Job Title *</Label>
                <Input id="title" name="title" placeholder="e.g. Software Engineer Intern" />
                <FieldError errors={state?.errors?.title} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="company">Company *</Label>
                <Input id="company" name="company" placeholder="e.g. Innovate Inc." />
                <FieldError errors={state?.errors?.company} />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Type *</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Internship">Internship</SelectItem>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Training">Training</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" placeholder="e.g. Bangalore / Remote" />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="salary">Salary / Stipend</Label>
                <Input id="salary" name="salary" placeholder="e.g. ₹40,000/month" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="deadline">Application Deadline</Label>
                <Input id="deadline" name="deadline" type="date" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Describe the role, responsibilities, and what the candidate will learn..."
              />
              <FieldError errors={state?.errors?.description} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="eligibility">Eligibility * <span className="text-muted-foreground text-xs">(comma-separated)</span></Label>
              <Input id="eligibility" name="eligibility" placeholder="e.g. B.Tech, M.Tech, MCA" />
              <FieldError errors={state?.errors?.eligibility} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tags">Required Skills * <span className="text-muted-foreground text-xs">(comma-separated)</span></Label>
              <Input id="tags" name="tags" placeholder="e.g. React, Node.js, TypeScript" />
              <FieldError errors={state?.errors?.tags} />
            </div>

            {state?.message && !state.success && (
              <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{state.message}</p>
            )}

            <Button type="submit" className="w-full" size="lg">
              Post Opportunity
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
