'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { signup } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, UserPlus } from 'lucide-react';
import type { Role } from '@/lib/definitions';

const roles: { value: Role, label: string }[] = [
    { value: 'Student', label: 'Student' },
    { value: 'PlacementCell', label: 'Placement Cell' },
    { value: 'FacultyMentor', label: 'Faculty / Mentor' },
    { value: 'Employer', label: 'Employer / Recruiter' }
]

export function SignupForm() {
  const [state, dispatch] = useFormState(signup, undefined);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>
          Create an account to join the platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={dispatch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" type="text" placeholder="John Doe" required />
            {state?.errors?.name && (
              <p className="text-sm text-destructive">{state.errors.name}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="name@example.com" required />
            {state?.errors?.email && (
              <p className="text-sm text-destructive">{state.errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required minLength={6} />
             {state?.errors?.password && (
              <p className="text-sm text-destructive">{state.errors.password}</p>
            )}
          </div>
           <div className="space-y-2">
            <Label htmlFor="role">I am a...</Label>
            <Select name="role" required defaultValue="Student">
              <SelectTrigger id="role">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map(role => (
                  <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
             {state?.errors?.role && (
              <p className="text-sm text-destructive">{state.errors.role}</p>
            )}
          </div>

          {state?.message && (
            <Alert variant={state.success ? "default" : "destructive"} className={`flex items-center gap-2 ${state.success ? 'bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400' : ''}`}>
               {!state.success && <AlertCircle className="h-4 w-4" />}
              <AlertDescription>
                {state.message}
              </AlertDescription>
            </Alert>
          )}
          <SignupButton />
        </form>
      </CardContent>
    </Card>
  );
}

function SignupButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" aria-disabled={pending} disabled={pending}>
      {pending ? 'Creating account...' : 'Create Account'}
      <UserPlus className="ml-2 h-4 w-4" />
    </Button>
  );
}
