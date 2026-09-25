'use client';

import { useState, useTransition } from 'react';
import {
  recommendOpportunities,
  type RecommendedOpportunity,
  type RecommendOpportunitiesOutput,
} from '@/ai/flows/smart-opportunity-recommendations';
import type { Opportunity } from '@/lib/definitions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  Loader2,
  Zap,
  Trophy,
  TrendingUp,
  BrainCircuit,
  RefreshCw,
  CheckCircle2,
  Info,
} from 'lucide-react';

// ─── Match Score Ring ──────────────────────────────────────────────────────

function MatchScoreRing({ score }: { score: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const color =
    score >= 80
      ? 'text-emerald-500'
      : score >= 60
      ? 'text-blue-500'
      : score >= 40
      ? 'text-amber-500'
      : 'text-rose-500';

  const strokeColor =
    score >= 80
      ? '#10b981'
      : score >= 60
      ? '#3b82f6'
      : score >= 40
      ? '#f59e0b'
      : '#f43f5e';

  return (
    <div className="relative flex items-center justify-center w-16 h-16 flex-shrink-0">
      <svg className="w-16 h-16 -rotate-90" viewBox="0 0 72 72">
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          className="text-muted/30"
        />
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="5"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
        />
      </svg>
      <span className={`absolute text-sm font-bold ${color}`}>{score}%</span>
    </div>
  );
}

// ─── Rank Badge ────────────────────────────────────────────────────────────

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
        <Trophy className="h-3 w-3" /> Best Match
      </span>
    );
  if (rank === 2)
    return (
      <span className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
        <TrendingUp className="h-3 w-3" /> Strong Match
      </span>
    );
  return (
    <span className="flex items-center gap-1 text-xs font-semibold text-violet-600 dark:text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full">
      <Zap className="h-3 w-3" /> Good Match
    </span>
  );
}

// ─── Skeleton Loader ───────────────────────────────────────────────────────

function RecommendationSkeleton() {
  return (
    <div className="space-y-4 mt-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="p-5 border rounded-xl animate-pulse bg-muted/30"
          style={{ animationDelay: `${i * 150}ms` }}
        >
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-muted flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-2/3 bg-muted rounded" />
              <div className="h-4 w-1/3 bg-muted rounded" />
              <div className="flex gap-2 mt-3">
                <div className="h-5 w-16 bg-muted rounded-full" />
                <div className="h-5 w-16 bg-muted rounded-full" />
                <div className="h-5 w-20 bg-muted rounded-full" />
              </div>
              <div className="h-16 w-full bg-muted/60 rounded-lg mt-2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Recommendation Card ───────────────────────────────────────────────────

function RecommendationCard({
  rec,
  rank,
  originalOpp,
}: {
  rec: RecommendedOpportunity;
  rank: number;
  originalOpp?: Opportunity;
}) {
  const borderAccent =
    rank === 1
      ? 'border-amber-500/30 dark:border-amber-500/20'
      : rank === 2
      ? 'border-blue-500/30 dark:border-blue-500/20'
      : 'border-violet-500/30 dark:border-violet-500/20';

  const bgAccent =
    rank === 1
      ? 'bg-amber-500/5'
      : rank === 2
      ? 'bg-blue-500/5'
      : 'bg-violet-500/5';

  return (
    <div
      className={`group relative p-5 border ${borderAccent} ${bgAccent} rounded-xl hover:shadow-md transition-all duration-200`}
    >
      {/* Rank indicator strip */}
      <div
        className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${
          rank === 1
            ? 'bg-amber-500'
            : rank === 2
            ? 'bg-blue-500'
            : 'bg-violet-500'
        }`}
      />

      <div className="flex items-start gap-4 pl-2">
        {/* Match Score Ring */}
        <MatchScoreRing score={rec.matchScore} />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
            <div>
              <h3 className="font-bold text-base text-foreground leading-tight">
                {rec.title}
              </h3>
              <p className="text-sm text-muted-foreground font-medium">{rec.company}</p>
            </div>
            <RankBadge rank={rank} />
          </div>

          {/* Type badge */}
          {originalOpp && (
            <Badge variant="outline" className="text-xs mb-3">
              {originalOpp.type}
            </Badge>
          )}

          {/* Matched Skills */}
          {rec.keySkillsMatched && rec.keySkillsMatched.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {rec.keySkillsMatched.map((skill) => (
                <span
                  key={skill}
                  className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                >
                  <CheckCircle2 className="h-2.5 w-2.5" />
                  {skill}
                </span>
              ))}
            </div>
          )}

          {/* AI Reason */}
          <div className="flex gap-2 p-3 rounded-lg bg-background/60 border border-border/60">
            <BrainCircuit className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">{rec.reason}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Empty / Prompt State ─────────────────────────────────────────────────

function EmptyState({ onGenerate }: { onGenerate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="relative mb-5">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <Sparkles className="h-9 w-9 text-primary" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
          <Zap className="h-3 w-3 text-white" />
        </div>
      </div>
      <h3 className="font-bold text-lg mb-1">Discover Your Perfect Matches</h3>
      <p className="text-muted-foreground text-sm max-w-sm mb-6">
        Our AI analyses your skills, projects, and academic background to find the
        opportunities most likely to land you an interview.
      </p>
      <Button onClick={onGenerate} size="lg" className="gap-2 shadow-md">
        <Sparkles className="h-4 w-4" />
        Generate My Recommendations
      </Button>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function OpportunityRecommendations({
  userId,
  opportunities,
}: {
  userId: string;
  opportunities: Opportunity[];
}) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<RecommendOpportunitiesOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetRecommendations = () => {
    startTransition(async () => {
      setError(null);
      try {
        const output = await recommendOpportunities({ userId });
        setResult(output);
      } catch (e: any) {
        console.error(e);
        const msg = e?.message || '';
        if (msg.includes('API_KEY') || msg.includes('api key') || msg.includes('credential')) {
          setError('api_key');
        } else if (msg.includes('network') || msg.includes('ECONNREFUSED') || msg.includes('wsarecv') || msg.includes('timeout') || msg.includes('connection')) {
          setError('network');
        } else {
          setError('generic');
        }
      }
    });
  };

  const hasResults = result && result.recommendations.length > 0;

  const errorMessage =
    error === 'api_key'
      ? { title: 'API Key Required', body: 'Add your GOOGLE_API_KEY to .env.local to enable AI recommendations. Get a free key at aistudio.google.com.' }
      : error === 'network'
      ? { title: 'Network Error', body: 'Could not reach Google AI servers. Please check your internet connection and ensure GOOGLE_API_KEY is set in .env.local, then restart the server.' }
      : error === 'generic'
      ? { title: 'Generation Failed', body: 'The AI model returned an unexpected error. Please try again in a moment.' }
      : null;

  return (
    <Card className="overflow-hidden">
      {/* ── Header ── */}
      <CardHeader className="bg-gradient-to-r from-primary/5 via-primary/10 to-transparent border-b">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">AI-Powered Recommendations</CardTitle>
              <p className="text-sm text-muted-foreground">
                Personalised matches based on your live profile data
              </p>
            </div>
          </div>

          {(hasResults || error) && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleGetRecommendations}
              disabled={isPending}
              className="gap-2"
            >
              {isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
              Regenerate
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-5">
        {/* Loading */}
        {isPending && <RecommendationSkeleton />}

        {/* Error */}
        {!isPending && error && errorMessage && (
          <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-destructive flex-shrink-0" />
              <p className="font-semibold text-sm text-destructive">{errorMessage.title}</p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{errorMessage.body}</p>
            {(error === 'api_key' || error === 'network') && (
              <div className="p-3 bg-muted rounded-lg text-xs font-mono text-muted-foreground">
                <p className="text-[10px] uppercase tracking-wide font-semibold text-muted-foreground/70 mb-1">.env.local</p>
                GOOGLE_API_KEY=your_key_here
                <p className="mt-2 text-[10px] not-italic">
                  👉 <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-primary underline">Get a free API key at aistudio.google.com</a>
                  {' — '}then restart the dev server.
                </p>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={handleGetRecommendations} className="gap-2">
              <RefreshCw className="h-3.5 w-3.5" /> Try Again
            </Button>
          </div>
        )}

        {/* Empty / initial */}
        {!isPending && !error && !hasResults && (
          <EmptyState onGenerate={handleGetRecommendations} />
        )}

        {/* Results */}
        {!isPending && hasResults && (
          <div className="space-y-4 mt-2">
            {/* Overall Insight Banner */}
            {result.overallInsight && (
              <div className="flex gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="p-1.5 rounded-md bg-primary/10 flex-shrink-0 h-fit">
                  <BrainCircuit className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-0.5">
                    AI Profile Insight
                  </p>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {result.overallInsight}
                  </p>
                </div>
              </div>
            )}

            {/* Recommendation Cards */}
            {result.recommendations.map((rec, index) => {
              const originalOpp = opportunities.find(
                (o) => o.id === rec.id || o.title === rec.title
              );
              return (
                <RecommendationCard
                  key={rec.id || index}
                  rec={rec}
                  rank={index + 1}
                  originalOpp={originalOpp}
                />
              );
            })}

            <p className="text-center text-xs text-muted-foreground pt-2">
              Recommendations are generated from your live profile — update your skills & projects for better matches.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
