'use client';
import { LoginForm } from '@/components/auth/login-form';
import { GraduationCap, CheckCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || undefined;
  const signupSuccess = searchParams.get('success') === 'true';

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center justify-center text-center">
          <div className="mb-4 rounded-full bg-primary p-4 text-primary-foreground">
            <GraduationCap className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-bold text-primary">Campus Path</h1>
          <p className="mt-2 text-muted-foreground">Your journey to a dream career starts here.</p>
        </div>

        {signupSuccess && (
            <Alert variant="default" className="mb-4 bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400">
              <CheckCircle className="h-4 w-4 !text-green-600 dark:!text-green-500" />
              <AlertTitle className='font-bold'>Account Created!</AlertTitle>
              <AlertDescription>
                You can now log in with the credentials you just created.
              </AlertDescription>
            </Alert>
        )}

        <LoginForm prefilledEmail={email} />
         <p className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/signup" className="font-medium text-primary hover:underline">
                Sign Up
            </Link>
        </p>
      </div>
    </main>
  );
}
