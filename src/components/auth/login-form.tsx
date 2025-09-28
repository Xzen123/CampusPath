'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, LogIn } from 'lucide-react';
import { useEffect } from 'react';

export function LoginForm({ prefilledEmail }: { prefilledEmail?: string }) {
  const [state, dispatch] = useFormState(authenticate, undefined);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your credentials to access your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={dispatch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              defaultValue={prefilledEmail}
            />
            {state?.errors?.email && (
              <p className="text-sm text-destructive">{state.errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required minLength={6} defaultValue={prefilledEmail ? 'password123' : ''} />
             {state?.errors?.password && (
              <p className="text-sm text-destructive">{state.errors.password}</p>
            )}
          </div>
          {state?.message && (
            <Alert variant="destructive" className="flex items-center gap-2">
               <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {state.message}
              </AlertDescription>
            </Alert>
          )}
          <LoginButton />
        </form>
      </CardContent>
    </Card>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" aria-disabled={pending} disabled={pending}>
      {pending ? 'Signing in...' : 'Sign In'}
      <LogIn className="ml-2 h-4 w-4" />
    </Button>
  );
}
