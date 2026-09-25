'use client';

import { useState, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  FileCheck2,
  Sparkles,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
} from 'lucide-react';
import { analyzeResumeAts, type AnalyzeAtsOutput } from '@/ai/flows/resume-ats-analyzer';

export default function AtsCheckerModal({
  userId,
  opportunityId,
  opportunityTitle,
  company,
}: {
  userId: string;
  opportunityId: string;
  opportunityTitle: string;
  company: string;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<AnalyzeAtsOutput | null>(null);
  const [customResume, setCustomResume] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleAnalyze = (textToAnalyze?: string) => {
    startTransition(async () => {
      try {
        const data = await analyzeResumeAts({
          userId,
          opportunityId,
          resumeText: textToAnalyze || customResume || undefined,
        });
        setResult(data);
      } catch (err) {
        console.error('ATS analysis failed:', err);
      }
    });
  };

  const onOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen && !result) {
      handleAnalyze();
    }
  };

  const scoreColor =
    (result?.atsScore || 0) >= 80
      ? 'text-emerald-500'
      : (result?.atsScore || 0) >= 60
      ? 'text-blue-500'
      : (result?.atsScore || 0) >= 40
      ? 'text-amber-500'
      : 'text-rose-500';

  const badgeVariant =
    result?.matchLevel === 'Exceptional' || result?.matchLevel === 'Strong'
      ? 'default'
      : 'secondary';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 border-primary/30 hover:border-primary">
          <FileCheck2 className="h-4 w-4 text-primary" />
          Check ATS Score
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl">Resume ATS Score Analyzer</DialogTitle>
              <DialogDescription>
                Compatibility analysis for <strong>{opportunityTitle}</strong> at {company}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isPending ? (
          <div className="py-12 text-center space-y-3">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
            <p className="text-sm font-medium">Analyzing keywords, skills, and ATS alignment...</p>
            <p className="text-xs text-muted-foreground">Evaluating against {opportunityTitle} requirements</p>
          </div>
        ) : result ? (
          <div className="space-y-6 pt-2">
            {/* Score Banner */}
            <div className="flex items-center justify-between p-5 rounded-xl border bg-gradient-to-r from-primary/5 via-primary/10 to-transparent">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-black tracking-tight flex items-baseline gap-1">
                  <span className={scoreColor}>{result.atsScore}</span>
                  <span className="text-base text-muted-foreground font-normal">/100</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-base">ATS Compatibility</h3>
                    <Badge variant={badgeVariant}>{result.matchLevel}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{result.summary}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAnalyze()}
                disabled={isPending}
                className="gap-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Re-scan
              </Button>
            </div>

            {/* Keyword Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Matched Keywords */}
              <div className="p-4 rounded-lg border bg-emerald-500/5 border-emerald-500/20 space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                  <CheckCircle className="h-4 w-4" />
                  Matched Keywords ({result.matchedKeywords.length})
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {result.matchedKeywords.map((kw, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-xs"
                    >
                      {kw}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="p-4 rounded-lg border bg-amber-500/5 border-amber-500/20 space-y-2">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  Missing Keywords ({result.missingKeywords.length})
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {result.missingKeywords.map((kw, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="border-amber-500/40 text-amber-700 dark:text-amber-300 text-xs"
                    >
                      + {kw}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="p-4 rounded-lg border bg-muted/30 space-y-3">
              <div className="flex items-center gap-2 font-semibold text-sm">
                <Lightbulb className="h-4 w-4 text-primary" />
                Recommendations to Boost ATS Score
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {result.suggestions.map((suggestion, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Optional Custom Resume Input */}
            <div className="border-t pt-4">
              <button
                type="button"
                onClick={() => setShowCustomInput(!showCustomInput)}
                className="text-xs text-primary hover:underline font-medium"
              >
                {showCustomInput ? '▲ Hide custom resume input' : '▼ Test with custom resume / cover letter text'}
              </button>

              {showCustomInput && (
                <div className="mt-3 space-y-2">
                  <Label htmlFor="custom-resume" className="text-xs">
                    Paste Resume Text or Additional Experience
                  </Label>
                  <Textarea
                    id="custom-resume"
                    placeholder="Paste your updated bullet points, projects, or full resume text here..."
                    rows={4}
                    value={customResume}
                    onChange={(e) => setCustomResume(e.target.value)}
                  />
                  <Button
                    size="sm"
                    onClick={() => handleAnalyze(customResume)}
                    disabled={isPending || !customResume.trim()}
                    className="w-full sm:w-auto"
                  >
                    Analyze Custom Resume
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
