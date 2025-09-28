import { SignupForm } from '@/components/auth/signup-form';
import { GraduationCap } from 'lucide-react';

export default function SignupPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center justify-center text-center">
          <div className="mb-4 rounded-full bg-primary p-4 text-primary-foreground">
            <GraduationCap className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-bold text-primary">Campus Path</h1>
          <p className="mt-2 text-muted-foreground">Create your account to get started.</p>
        </div>
        <SignupForm />
      </div>
    </main>
  );
}
