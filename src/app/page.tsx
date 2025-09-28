
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
        <section className="w-full py-20 md:py-28 lg:py-32 bg-muted/20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none">
                    The Smart Bridge for Every
                  </h1>
                   <Link href="/login" className="group">
                        <div className="text-5xl sm:text-6xl xl:text-7xl/none font-bold text-destructive h-20 group-hover:underline">
                        <span className="typing-effect">{displayedRole}</span>
                        <span className="caret">|</span>
                        </div>
                    </Link>
                  <p className="max-w-[700px] text-muted-foreground md:text-xl lg:text-2xl">
                    Campus Path connects students with employers, streamlines
                    placements, and empowers everyone in the campus recruitment
                    ecosystem.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/dashboard">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
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
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {featureCards.map((feature) => (
                    <Card key={feature.role} className="flex flex-col">
                        <CardHeader className={`flex items-center justify-center p-6 ${feature.bgColor} rounded-t-lg`}>
                            <feature.icon className={`h-12 w-12 ${feature.iconColor}`} />
                        </CardHeader>
                        <CardContent className="p-6 flex-grow">
                            <h3 className="text-xl font-bold mb-2">{feature.role}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
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
