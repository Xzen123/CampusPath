import Link from 'next/link';
import Image from 'next/image';
import { GraduationCap } from 'lucide-react';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link href="/" className="flex items-center justify-center">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="ml-2 font-bold text-lg">Campus Path</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
            <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">
              About Us
          </Link>
          <ThemeToggle />
          <Link
            href="/login"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Login
          </Link>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">About Campus Path</h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Our mission is to bridge the gap between students and their dream careers by creating a seamless, intelligent, and transparent campus recruitment ecosystem.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <Image
                src="https://picsum.photos/seed/501/600/500"
                width={600}
                height={500}
                alt="Our Team"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
                data-ai-hint="diverse team working"
              />
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Who We Are</h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Campus Path was founded by a team of passionate educators, technologists, and recruitment experts who saw the need for a modern solution to the age-old challenges of campus placements. We believe in empowering students, streamlining processes for colleges, and connecting employers with the right talent efficiently.
                  </p>
                </div>
              </div>
            </div>
             <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12 mt-16">
                 <div className="flex flex-col justify-center space-y-4 lg:order-last">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">What We Do</h2>
                        <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                           Our platform provides a centralized hub for all stakeholders in the campus recruitment process. From AI-powered job recommendations for students to streamlined applicant tracking for employers and comprehensive analytics for placement cells, Campus Path is designed to make every step of the journey smarter and more effective.
                        </p>
                    </div>
                </div>
              <Image
                src="https://picsum.photos/seed/502/600/500"
                width={600}
                height={500}
                alt="Our Product"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
                data-ai-hint="software interface screenshot"
              />
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Campus Path. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
