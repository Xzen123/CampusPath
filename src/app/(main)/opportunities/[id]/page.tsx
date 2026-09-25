import { getOpportunityById } from '@/lib/data';
import { getUser } from '@/lib/session';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import { MapPin, Clock, CalendarDays, GraduationCap, DollarSign, Briefcase, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { applyToOpportunity } from '@/lib/actions';
import { formatDistanceToNow } from 'date-fns';
import AtsCheckerModal from '@/components/ai/ats-checker-modal';
import MockInterviewDialog from '@/components/ai/mock-interview-dialog';

export default async function OpportunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [opp, user] = await Promise.all([
    getOpportunityById(id),
    getUser(),
  ]);

  if (!opp) notFound();

  const timeAgo = formatDistanceToNow(new Date(opp.postedAt), { addSuffix: true });

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      {/* Back */}
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link href="/opportunities"><ArrowLeft className="h-4 w-4 mr-1" /> Back to Opportunities</Link>
      </Button>

      {/* Header Card */}
      <Card className="overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary via-primary/60 to-transparent" />
        <CardHeader className="pt-6">
          <div className="flex items-start gap-5">
            <Image
              src={opp.logoUrl}
              alt={`${opp.company} logo`}
              width={64}
              height={64}
              className="rounded-xl border object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold tracking-tight">{opp.title}</h1>
              <p className="text-lg text-muted-foreground font-medium">{opp.company}</p>
              <div className="flex flex-wrap gap-3 mt-3 text-sm text-muted-foreground">
                {opp.location && (
                  <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{opp.location}</span>
                )}
                {opp.salary && (
                  <span className="flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5" />{opp.salary}</span>
                )}
                <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{timeAgo}</span>
                {opp.deadline && (
                  <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />Deadline: {new Date(opp.deadline).toLocaleDateString()}</span>
                )}
              </div>
            </div>
            <Badge variant="secondary" className="flex-shrink-0"><Briefcase className="h-3 w-3 mr-1" />{opp.type}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Action buttons */}
          {user?.role === 'Student' && (
            <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl border bg-muted/20">
              <form action={async () => {
                'use server';
                await applyToOpportunity(opp.id);
              }}>
                <Button type="submit" size="default" className="shadow-md">
                  Apply Now →
                </Button>
              </form>
              <AtsCheckerModal
                userId={user.id}
                opportunityId={opp.id}
                opportunityTitle={opp.title}
                company={opp.company}
              />
              <MockInterviewDialog
                opportunityId={opp.id}
                opportunityTitle={opp.title}
                company={opp.company}
                userId={user.id}
              />
            </div>
          )}

          {/* Description */}
          <div>
            <h2 className="font-semibold text-base mb-2">About this Role</h2>
            <p className="text-muted-foreground leading-relaxed">{opp.description}</p>
          </div>

          {/* Skills */}
          <div>
            <h2 className="font-semibold text-base mb-2">Skills Required</h2>
            <div className="flex flex-wrap gap-2">
              {opp.tags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>

          {/* Eligibility */}
          <div>
            <h2 className="font-semibold text-base mb-2 flex items-center gap-2">
              <GraduationCap className="h-4 w-4" /> Eligibility
            </h2>
            <div className="flex flex-wrap gap-2">
              {opp.eligibility.map((e) => (
                <Badge key={e} variant="outline">{e}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
