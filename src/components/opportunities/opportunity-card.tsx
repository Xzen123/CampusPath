'use client';
import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Opportunity, Role } from '@/lib/definitions';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect, useTransition } from 'react';
import { Bookmark, Star, Edit, Trash2, MapPin, DollarSign, ExternalLink, Calendar, Flame, Zap, Clock } from 'lucide-react';
import { applyToOpportunity } from '@/lib/actions';
import { formatDistanceToNow } from 'date-fns';

export default function OpportunityCard({
  opportunity,
  userRole,
}: {
  opportunity: Opportunity;
  userRole: Role | undefined;
}) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('campuspath_saved_opps') || '[]');
      setIsSaved(saved.includes(opportunity.id));
    } catch {
      // ignore
    }
  }, [opportunity.id]);

  const toggleBookmark = () => {
    try {
      const saved: string[] = JSON.parse(localStorage.getItem('campuspath_saved_opps') || '[]');
      let updated: string[];
      if (saved.includes(opportunity.id)) {
        updated = saved.filter((id) => id !== opportunity.id);
        setIsSaved(false);
        toast({ title: 'Bookmark Removed' });
      } else {
        updated = [...saved, opportunity.id];
        setIsSaved(true);
        toast({ title: '⭐ Saved to Bookmarks!' });
      }
      localStorage.setItem('campuspath_saved_opps', JSON.stringify(updated));
      window.dispatchEvent(new Event('campuspath_saved_changed'));
    } catch {
      // ignore
    }
  };

  const handleApply = () => {
    startTransition(async () => {
      const result = await applyToOpportunity(opportunity.id);
      toast({
        title: result.success ? '✅ Application Submitted!' : result.alreadyApplied ? 'Already Applied' : '❌ Error',
        description: result.message ?? '',
        variant: result.success ? 'default' : 'destructive',
      });
    });
  };

  const timeAgo = formatDistanceToNow(new Date(opportunity.postedAt), { addSuffix: true });

  // Deadline calculation
  const getDeadlineBadge = () => {
    if (!opportunity.deadline) return null;
    const now = new Date();
    const deadlineDate = new Date(opportunity.deadline);
    const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return (
        <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-5">
          Closed
        </Badge>
      );
    }
    if (diffDays === 0) {
      return (
        <Badge className="bg-rose-500 hover:bg-rose-600 text-white text-[10px] px-1.5 py-0 h-5 animate-pulse flex items-center gap-1">
          <Flame className="h-3 w-3" /> Closes Today
        </Badge>
      );
    }
    if (diffDays <= 3) {
      return (
        <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[10px] px-1.5 py-0 h-5 flex items-center gap-1">
          <Zap className="h-3 w-3" /> {diffDays}d left
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 text-muted-foreground">
        {diffDays}d left
      </Badge>
    );
  };

  const platform = opportunity.sourcePlatform || 'Campus';
  const platformConfig: Record<string, { label: string; className: string }> = {
    LinkedIn: {
      label: 'LinkedIn',
      className: 'bg-[#0A66C2]/15 text-[#0A66C2] border-[#0A66C2]/30 dark:bg-[#0A66C2]/25 dark:text-[#70b5f9]',
    },
    Indeed: {
      label: 'Indeed',
      className: 'bg-[#2164f3]/15 text-[#2164f3] border-[#2164f3]/30 dark:bg-[#2164f3]/25 dark:text-[#6fa8ff]',
    },
    Internshala: {
      label: 'Internshala',
      className: 'bg-[#00A5EC]/15 text-[#008bd0] border-[#00A5EC]/30 dark:bg-[#00A5EC]/25 dark:text-[#38c2ff]',
    },
    Unstop: {
      label: 'Unstop',
      className: 'bg-[#7B3FE4]/15 text-[#7B3FE4] border-[#7B3FE4]/30 dark:bg-[#7B3FE4]/25 dark:text-[#c4a1ff]',
    },
    Campus: {
      label: 'Campus Exclusive',
      className: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:text-emerald-300 dark:bg-emerald-500/25',
    },
  };

  const currentPlatform = platformConfig[platform] || platformConfig.Campus;

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow group relative">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Image
              src={opportunity.logoUrl}
              alt={`${opportunity.company} logo`}
              width={44}
              height={44}
              className="rounded-lg border object-cover flex-shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-base leading-tight">{opportunity.title}</CardTitle>
                {getDeadlineBadge()}
              </div>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <CardDescription className="font-medium">{opportunity.company}</CardDescription>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border inline-flex items-center ${currentPlatform.className}`}>
                  {currentPlatform.label}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleBookmark}
              className="h-8 w-8 text-muted-foreground hover:text-amber-500"
              title={isSaved ? 'Remove from saved' : 'Save opportunity'}
            >
              <Bookmark
                className={`h-4 w-4 transition-colors ${
                  isSaved ? 'fill-amber-500 text-amber-500' : ''
                }`}
              />
            </Button>
            {userRole === 'PlacementCell' && (
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Edit className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-grow space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{opportunity.description}</p>

        {/* Meta info */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {opportunity.location && (
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{opportunity.location}</span>
          )}
          {opportunity.salary && (
            <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{opportunity.salary}</span>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {opportunity.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
          ))}
          {opportunity.tags.length > 4 && (
            <Badge variant="outline" className="text-xs">+{opportunity.tags.length - 4}</Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center pt-3 border-t">
        <div className="text-xs text-muted-foreground">{timeAgo}</div>
        <div className="flex gap-2 items-center">
          <Button variant="ghost" size="sm" asChild className="h-8">
            <Link href={`/opportunities/${opportunity.id}`}>
              Details
            </Link>
          </Button>

          {opportunity.externalUrl ? (
            <Button size="sm" asChild className="h-8 gap-1">
              <a href={opportunity.externalUrl} target="_blank" rel="noopener noreferrer">
                Apply <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          ) : (
            userRole === 'Student' && (
              <Button size="sm" onClick={handleApply} disabled={isPending} className="h-8">
                {isPending ? 'Applying…' : 'Apply'}
              </Button>
            )
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
