'use client';

import { useState, useMemo, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { Opportunity, Role } from '@/lib/definitions';
import OpportunityCard from './opportunity-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, X, Briefcase, Bookmark, RefreshCw, Radio } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useToast } from '@/hooks/use-toast';

const ALL_TAG = '__all__';
type PlatformFilter = 'All' | 'LinkedIn' | 'Indeed' | 'Internshala' | 'Unstop' | 'Campus';

export default function OpportunityList({
  opportunities,
  userRole,
}: {
  opportunities: Opportunity[];
  userRole: Role | undefined;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSyncing, startSyncTransition] = useTransition();
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState(ALL_TAG);
  const [activePlatform, setActivePlatform] = useState<PlatformFilter>('All');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const handleSyncLiveJobs = () => {
    startSyncTransition(async () => {
      try {
        const res = await fetch('/api/opportunities/sync', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          toast({
            title: '✨ Live Jobs Synchronized!',
            description: data.message,
          });
          router.refresh();
        } else {
          toast({
            title: 'Sync Notice',
            description: data.message || 'Could not fetch additional live jobs.',
            variant: 'destructive',
          });
        }
      } catch (err: any) {
        toast({
          title: 'Sync Error',
          description: err?.message || 'Failed to connect to live job sync endpoint.',
          variant: 'destructive',
        });
      }
    });
  };

  useEffect(() => {
    const updateSaved = () => {
      try {
        const saved = JSON.parse(localStorage.getItem('campuspath_saved_opps') || '[]');
        setSavedIds(saved);
      } catch {
        // ignore
      }
    };
    updateSaved();
    window.addEventListener('campuspath_saved_changed', updateSaved);
    return () => window.removeEventListener('campuspath_saved_changed', updateSaved);
  }, []);

  // Calculate platform counts
  const platformCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: opportunities.length,
      LinkedIn: 0,
      Indeed: 0,
      Internshala: 0,
      Unstop: 0,
      Campus: 0,
    };
    opportunities.forEach((o) => {
      const p = o.sourcePlatform || 'Campus';
      if (counts[p] !== undefined) counts[p]++;
    });
    return counts;
  }, [opportunities]);

  // Build unique tag list from all opportunities
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    opportunities.forEach((o) => o.tags.forEach((t) => tags.add(t)));
    return Array.from(tags).slice(0, 10);
  }, [opportunities]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return opportunities.filter((o) => {
      if (showSavedOnly && !savedIds.includes(o.id)) return false;

      const oppPlatform = o.sourcePlatform || 'Campus';
      if (activePlatform !== 'All' && oppPlatform !== activePlatform) return false;

      const matchesQuery =
        !q ||
        o.title.toLowerCase().includes(q) ||
        o.company.toLowerCase().includes(q) ||
        o.tags.some((t) => t.toLowerCase().includes(q)) ||
        (o.location?.toLowerCase().includes(q) ?? false);
      const matchesTag = activeTag === ALL_TAG || o.tags.includes(activeTag);
      return matchesQuery && matchesTag;
    });
  }, [opportunities, query, activeTag, activePlatform, showSavedOnly, savedIds]);

  const hasFilters = query || activeTag !== ALL_TAG || activePlatform !== 'All' || showSavedOnly;

  const platforms: { id: PlatformFilter; label: string; dotColor?: string }[] = [
    { id: 'All', label: 'All Platforms' },
    { id: 'LinkedIn', label: 'LinkedIn', dotColor: 'bg-[#0A66C2]' },
    { id: 'Indeed', label: 'Indeed', dotColor: 'bg-[#2164f3]' },
    { id: 'Internshala', label: 'Internshala', dotColor: 'bg-[#00A5EC]' },
    { id: 'Unstop', label: 'Unstop', dotColor: 'bg-[#7B3FE4]' },
    { id: 'Campus', label: 'Campus Exclusive', dotColor: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-4 mt-4">
      {/* Live Feed Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-muted/40 border border-border/70 text-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-foreground">Live Opportunity Feed</span>
          <span className="text-muted-foreground hidden sm:inline">
            • Real-world positions synced directly from active job boards & platforms
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSyncLiveJobs}
          disabled={isSyncing}
          className="h-7 text-xs gap-1.5 px-2.5 shadow-2xs"
        >
          <RefreshCw className={`h-3 w-3 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Syncing Live Jobs…' : 'Sync Live Jobs'}
        </Button>
      </div>

      {/* Platform Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b no-scrollbar">
        {platforms.map((p) => {
          const isActive = activePlatform === p.id;
          const count = platformCounts[p.id] || 0;
          return (
            <button
              key={p.id}
              onClick={() => setActivePlatform(p.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
              }`}
            >
              {p.dotColor && (
                <span className={`w-2 h-2 rounded-full ${p.dotColor} ${isActive ? 'ring-2 ring-white/50' : ''}`} />
              )}
              {p.label}
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search + Filter bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, company, skill, or location…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {hasFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setQuery(''); setActiveTag(ALL_TAG); setActivePlatform('All'); setShowSavedOnly(false); }}
            className="gap-1.5 whitespace-nowrap"
          >
            <X className="h-3.5 w-3.5" /> Clear filters
          </Button>
        )}
      </div>

      {/* Tag & Saved filter chips */}
      <div className="flex flex-wrap gap-2 items-center">
        <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
        <button
          onClick={() => { setActiveTag(ALL_TAG); setShowSavedOnly(false); }}
          className={`text-xs px-3 py-1 rounded-full border transition-colors ${
            activeTag === ALL_TAG && !showSavedOnly
              ? 'bg-secondary text-secondary-foreground font-medium border-border'
              : 'border-border hover:border-primary/50 text-muted-foreground'
          }`}
        >
          All Skills
        </button>

        {/* Saved Filter Chip */}
        <button
          onClick={() => setShowSavedOnly(!showSavedOnly)}
          className={`text-xs px-3 py-1 rounded-full border transition-colors flex items-center gap-1.5 ${
            showSavedOnly
              ? 'bg-amber-500 text-white border-amber-500 font-semibold shadow-sm'
              : 'border-border hover:border-amber-500/50 text-muted-foreground'
          }`}
        >
          <Bookmark className={`h-3 w-3 ${showSavedOnly ? 'fill-white' : ''}`} />
          Saved ({savedIds.length})
        </button>

        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(activeTag === tag ? ALL_TAG : tag)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
              activeTag === tag
                ? 'bg-primary text-primary-foreground border-primary font-medium'
                : 'border-border hover:border-primary/50 text-muted-foreground'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        {filtered.length} opportunit{filtered.length !== 1 ? 'ies' : 'y'} found
        {hasFilters && ' matching your filters'}
      </p>

      {/* Cards grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} userRole={userRole} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No opportunities match your search.</p>
          <p className="text-sm mt-1">Try different keywords or clear your filters.</p>
        </div>
      )}
    </div>
  );
}
