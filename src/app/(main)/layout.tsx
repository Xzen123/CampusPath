import { getUser } from '@/lib/session';
import { redirect } from 'next/navigation';
import Header from '@/components/layout/header';
import MainSidebar from '@/components/layout/main-sidebar';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <MainSidebar user={user} />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header user={user} />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
