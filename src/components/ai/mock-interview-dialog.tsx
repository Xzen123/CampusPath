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
import {
  Target,
  Sparkles,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Lightbulb,
  CheckCircle2,
  RefreshCw,
  HelpCircle,
} from 'lucide-react';
import { generateMockInterview, type GenerateInterviewOutput } from '@/ai/flows/mock-interview-generator';

export default function MockInterviewDialog({
  opportunityId,
  opportunityTitle,
  company,
  userId,
}: {
  opportunityId: string;
  opportunityTitle: string;
  company: string;
  userId?: string;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<GenerateInterviewOutput | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const fetchQuestions = () => {
    startTransition(async () => {
      try {
        const res = await generateMockInterview({ opportunityId, userId });
        setData(res);
        setCurrentIndex(0);
        setShowAnswer(false);
      } catch (err) {
        console.error('Failed to generate mock interview:', err);
      }
    });
  };

  const onOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen && !data) {
      fetchQuestions();
    }
  };

  const currentQ = data?.questions[currentIndex];

  const typeBadgeVariant = (type: string) => {
    switch (type) {
      case 'Technical':
        return 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30';
      case 'Behavioral':
        return 'bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/30';
      default:
        return 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="gap-2 shadow-sm">
          <Target className="h-4 w-4 text-primary" />
          Prepare for Interview
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl">AI Interview Prep</DialogTitle>
              <DialogDescription>
                Tailored interview questions for <strong>{opportunityTitle}</strong> at {company}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isPending ? (
          <div className="py-12 text-center space-y-3">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
            <p className="text-sm font-medium">Generating company-specific questions & answer guides...</p>
            <p className="text-xs text-muted-foreground">Analyzing {company}'s tech stack and role expectations</p>
          </div>
        ) : data && currentQ ? (
          <div className="space-y-6 pt-2">
            {/* Company Overview Tip */}
            <div className="p-3.5 rounded-lg border bg-primary/5 text-xs text-muted-foreground flex items-start gap-2.5">
              <HelpCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
              <span>{data.companyOverview}</span>
            </div>

            {/* Stepper / Progress */}
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
                {data.questions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentIndex(i);
                      setShowAnswer(false);
                    }}
                    className={`h-2 rounded-full transition-all ${
                      i === currentIndex
                        ? 'w-8 bg-primary'
                        : i < currentIndex
                        ? 'w-4 bg-primary/50'
                        : 'w-4 bg-muted'
                    }`}
                    aria-label={`Go to question ${i + 1}`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-muted-foreground">
                Question {currentIndex + 1} of {data.questions.length}
              </span>
            </div>

            {/* Question Card */}
            <div className="p-5 rounded-xl border bg-card space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className={typeBadgeVariant(currentQ.type)}>
                  {currentQ.type} Question
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchQuestions}
                  disabled={isPending}
                  className="h-7 text-xs gap-1"
                >
                  <RefreshCw className="h-3 w-3" /> New Set
                </Button>
              </div>

              <h3 className="text-lg font-semibold leading-snug">
                "{currentQ.question}"
              </h3>

              {/* Reveal Answer / Guide Button */}
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="gap-2"
                >
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  {showAnswer ? 'Hide Sample Answer Guide' : 'View Sample Answer Guide'}
                </Button>
              </div>

              {/* Expandable Answer Guide */}
              {showAnswer && (
                <div className="space-y-3 pt-2 border-t mt-4 text-sm animate-in fade-in duration-200">
                  <div className="p-3.5 rounded-lg bg-muted/40 border space-y-1.5">
                    <div className="font-semibold text-xs text-primary flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" /> What a Strong Answer Includes
                    </div>
                    <p className="text-muted-foreground leading-relaxed text-xs">
                      {currentQ.sampleAnswerGuide}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300">
                    <strong>💡 Interviewer Tip:</strong> {currentQ.tips}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCurrentIndex((prev) => Math.max(0, prev - 1));
                  setShowAnswer(false);
                }}
                disabled={currentIndex === 0}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>

              <Button
                size="sm"
                onClick={() => {
                  setCurrentIndex((prev) => Math.min(data.questions.length - 1, prev + 1));
                  setShowAnswer(false);
                }}
                disabled={currentIndex === data.questions.length - 1}
                className="gap-1"
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
