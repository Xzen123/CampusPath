
'use client';
import Link from 'next/link';
import { GraduationCap, ArrowRight, User, Building, Briefcase, BookUser } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { testimonials } from '@/lib/mock-data';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const roles = ['Student', 'Placement Cell', 'Employer', 'Mentor'];

const featureCards = [
  {
    icon: User,
    role: 'For Students',
    description: 'Discover tailored job opportunities, get AI-powered recommendations, and track your applications seamlessly.',
    bgColor: 'bg-blue-500/10',
    iconColor: 'text-blue-500'
  },
  {
    icon: Building,
    role: 'For Placement Cells',
    description: 'Streamline the entire placement process, manage companies, and gain insights with powerful analytics.',
    bgColor: 'bg-green-500/10',
    iconColor: 'text-green-500'
  },
  {
    icon: Briefcase,
    role: 'For Employers',
    description: 'Connect with a diverse talent pool, post job openings, and manage your recruitment pipeline efficiently.',
    bgColor: 'bg-purple-500/10',
    iconColor: 'text-purple-500'
  },
  {
    icon: BookUser,
    role: 'For Mentors',
    description: 'Guide and track the progress of your mentees, providing valuable insights for their career growth.',
    bgColor: 'bg-orange-500/10',
    iconColor: 'text-orange-500'
  }
];

export default function LandingPage() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayedRole, setDisplayedRole] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleTyping = () => {
      const fullRole = roles[roleIndex];
      if (isDeleting) {
        setDisplayedRole((prev) => prev.substring(0, prev.length - 1));
      } else {
        setDisplayedRole((prev) => fullRole.substring(0, prev.length + 1));
      }

      if (!isDeleting && displayedRole === fullRole) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && displayedRole === '') {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      }
    };

    const typingSpeed = isDeleting ? 50 : 100;
    const timer = setTimeout(handleTyping, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayedRole, isDeleting, roleIndex]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link href="#" className="flex items-center justify-center">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="ml-2 font-bold text-lg">Campus Path</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <Link
            href="/about"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
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
        <section className="relative w-full py-24 md:py-32 lg:py-40 overflow-hidden flex items-center justify-center min-h-[90vh]">
          {/* Modern abstract background */}
          <div className="absolute top-0 z-[-2] h-screen w-screen bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]"></div>
          
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-8 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm shadow-sm">
                ✨ Powered by Google Genkit AI
              </div>
              
              <div className="space-y-6 max-w-4xl mx-auto">
                <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl xl:text-8xl/none bg-clip-text text-transparent bg-gradient-to-br from-foreground via-foreground to-muted-foreground drop-shadow-sm pb-2">
                  The Smart Bridge for Every <br className="hidden sm:block" />
                  <Link href="/login" className="inline-block mt-4 group">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-600 dark:from-primary dark:to-indigo-400 group-hover:opacity-80 transition-opacity">
                      {displayedRole}
                    </span>
                    <span className="caret text-primary">|</span>
                  </Link>
                </h1>
                
                <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl lg:text-2xl leading-relaxed">
                  Campus Path connects students with top employers, streamlines placements, and empowers everyone in the modern recruitment ecosystem.
                </p>
              </div>

              <div className="flex flex-col gap-4 min-[400px]:flex-row justify-center mt-8 w-full max-w-md mx-auto sm:max-w-none">
                <Button asChild size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/25 hover:scale-105 transition-all group">
                  <Link href="/dashboard">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full backdrop-blur-sm bg-background/50 hover:bg-muted/50 hover:scale-105 transition-all">
                  <Link href="/about">
                    How it works
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats Section ── */}
        <section className="w-full py-10 border-y bg-gradient-to-r from-primary/5 via-transparent to-primary/5">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { value: '500+', label: 'Students Placed', color: 'text-blue-600 dark:text-blue-400' },
                { value: '120+', label: 'Partner Companies', color: 'text-violet-600 dark:text-violet-400' },
                { value: '50+', label: 'Colleges', color: 'text-emerald-600 dark:text-emerald-400' },
                { value: '95%', label: 'Placement Rate', color: 'text-amber-600 dark:text-amber-400' },
              ].map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <p className={`text-4xl font-extrabold tracking-tight ${stat.color}`}>{stat.value}</p>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">A Platform for Everyone</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Campus Path is designed to meet the unique needs of every user in the campus recruitment ecosystem.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {featureCards.map((feature) => (
                    <Card key={feature.role} className="flex flex-col bg-background/40 backdrop-blur-xl border-border/50 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden group">
                        <div className={`h-2 w-full ${feature.bgColor} transition-all duration-300 group-hover:h-3 opacity-50`} />
                        <CardHeader className="flex items-center justify-center p-8 pb-4">
                            <div className={`p-5 rounded-2xl ${feature.bgColor} shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                                <feature.icon className={`h-10 w-10 ${feature.iconColor}`} />
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 pt-2 flex-grow text-center">
                            <h3 className="text-xl font-bold mb-3">{feature.role}</h3>
                            <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
          </div>
        </section>


        <section
          id="testimonials"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted/40"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  What Our Users Say
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Hear from students, placement officers, and employers who are
                  transforming their campus recruitment experience with Campus
                  Path.
                </p>
              </div>
            </div>
            <div className="relative mt-12 marquee-container overflow-hidden">
                 <div className="marquee-content flex gap-4">
                    {[...testimonials, ...testimonials].map((testimonial, index) => (
                        <div key={index} className="flex-shrink-0 w-[380px] p-1">
                            <Card className="p-6 h-full">
                                <CardContent className="p-0 flex flex-col justify-between h-full">
                                    <div>
                                        <blockquote className="text-lg font-semibold leading-snug">
                                        “{testimonial.quote}”
                                        </blockquote>
                                    </div>
                                    <div className="mt-4 flex items-center gap-4">
                                        <Image
                                            src={testimonial.avatarUrl}
                                            alt={testimonial.name}
                                            width={48}
                                            height={48}
                                            className="rounded-full"
                                            data-ai-hint="person portrait"
                                        />
                                        <div>
                                            <p className="font-semibold">{testimonial.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                            {testimonial.role}, {testimonial.college}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                 </div>
            </div>
          </div>
        </section>

      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Campus Path. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
          >
            Privacy
          </Link>
        </nav>
      </footer>
      <style jsx>{`
        .caret {
          animation: blink 1s step-end infinite;
        }
        @keyframes blink {
          from,
          to {
            color: transparent;
          }
          50% {
            color: hsl(var(--destructive));
          }
        }
        .marquee-container {
          mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
        }
        .marquee-content {
            animation: marquee 30s linear infinite;
        }
        @keyframes marquee {
            from {
                transform: translateX(0%);
            }
            to {
                transform: translateX(-50%);
            }
        }
      `}</style>
    </div>
  );
}
