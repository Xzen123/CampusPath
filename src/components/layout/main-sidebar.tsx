'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GraduationCap,
  Home,
  Briefcase,
  User,
  Settings,
  Users,
  Building,
  PlusCircle,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { User as UserType, Role } from '@/lib/definitions';
import { cn } from '@/lib/utils';

const navItems: { [key in Role]: { href: string; icon: React.ElementType; label: string }[] } = {
  Student: [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/opportunities', icon: Briefcase, label: 'Opportunities' },
    { href: '/profile', icon: User, label: 'My Profile' },
  ],
  PlacementCell: [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/opportunities', icon: Briefcase, label: 'Manage Opportunities' },
    { href: '/students', icon: Users, label: 'Students' },
    { href: '/employers', icon: Building, label: 'Employers' },
  ],
  FacultyMentor: [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/students', icon: Users, label: 'My Mentees' },
  ],
  Employer: [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/opportunities/new', icon: PlusCircle, label: 'Post Job' },
    { href: '/opportunities', icon: Briefcase, label: 'Browse Jobs' },
  ],
};

function NavLink({
  href,
  icon: Icon,
  label,
  isMobile,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  isMobile?: boolean;
}) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));

  if (isMobile) {
    return (
      <Link
        href={href}
        className={cn(
          'flex items-center gap-4 px-2.5 transition-colors',
          isActive
            ? 'text-primary font-semibold'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <Icon className="h-5 w-5" />
        {label}
      </Link>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg transition-all md:h-8 md:w-8',
            isActive
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
          )}
        >
          <Icon className="h-5 w-5" />
          <span className="sr-only">{label}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

export default function MainSidebar({
  user,
  isMobile = false,
}: {
  user: UserType;
  isMobile?: boolean;
}) {
  const userNavItems = navItems[user.role] || [];

  const commonNav = (
    <nav
      className={`flex ${
        isMobile ? 'flex-col gap-4' : 'flex-col items-center gap-4 px-2 sm:py-4'
      }`}
    >
      {isMobile && (
        <Link
          href="/dashboard"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <GraduationCap className="h-5 w-5 transition-all group-hover:scale-110" />
          <span className="sr-only">Campus Path</span>
        </Link>
      )}
      {userNavItems.map((item) => (
        <NavLink key={item.href} {...item} isMobile={isMobile} />
      ))}
    </nav>
  );

  if (isMobile) {
    return (
      <TooltipProvider>
        {commonNav}
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
          <NavLink href="/settings" icon={Settings} label="Settings" isMobile={isMobile} />
        </nav>
      </TooltipProvider>
    );
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <TooltipProvider>
        <div className="flex flex-col items-center gap-4 px-2 sm:py-4">
          <Link
            href="/dashboard"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <GraduationCap className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">Campus Path</span>
          </Link>
          {commonNav}
        </div>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
          <NavLink href="/settings" icon={Settings} label="Settings" />
        </nav>
      </TooltipProvider>
    </aside>
  );
}
