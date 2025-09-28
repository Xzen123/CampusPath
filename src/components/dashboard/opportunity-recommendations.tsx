'use client';
import { useState, useTransition } from 'react';
import { recommendOpportunities } from '@/ai/flows/smart-opportunity-recommendations';
import type { StudentProfile, Opportunity } from '@/lib/definitions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Sparkles, Lightbulb, Loader2 } from 'lucide-react';
import { Badge } from '../ui/badge';

function formatProfileForAI(profile: StudentProfile): string {
  const skills = profile.skills.map(s => s.name).join(', ');
  const projects = profile.projects.map(p => `${p.title}: ${p.description}`).join('\n');
  const academics = profile.academics.map(a => `${a.degree} from ${a.institution} (GPA: ${a.gpa})`).join(', ');

  return `
    Bio: ${profile.bio}
    Skills: ${skills}
    Academic Background: ${academics}
    Projects:
    ${projects}
  `;
}

function formatOpportunitiesForAI(opportunities: Opportunity[]): string {
  return opportunities.map(opp => `
    ID: ${opp.id}
    Title: ${opp.title}
    Company: ${opp.company}
    Type: ${opp.type}
    Description: ${opp.description}
    Eligibility: ${opp.eligibility.join(', ')}
    Required Tags/Skills: ${opp.tags.join(', ')}
  `).join('\n---\n');
}

type Recommendation = {
    id: string;
    title: string;
    company: string;
    reason: string;
}

export default function OpportunityRecommendations({ profile, opportunities }: { profile: StudentProfile; opportunities: Opportunity[] }) {
  const [isPending, startTransition] = useTransition();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGetRecommendations = () => {
    startTransition(async () => {
      setError(null);
      setRecommendations([]);
      try {
        const studentProfile = formatProfileForAI(profile);
        const availableOpportunities = formatOpportunitiesForAI(opportunities);
        
        const result = await recommendOpportunities({ studentProfile, availableOpportunities });
        
        // This is a simplified parsing. A real app should have robust validation.
        const parsedRecs = JSON.parse(result.recommendedOpportunities) as any[];
        const parsedRecsWithReasons = parsedRecs.map(r => ({...r, id: r.id ?? `rec-${Math.random()}`}));

        setRecommendations(parsedRecsWithReasons);

      } catch (e) {
        console.error(e);
        setError('Failed to generate recommendations. The AI model might be busy. Please try again in a moment.');
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="text-accent" />
                    AI-Powered Recommendations
                </CardTitle>
                <CardDescription>Discover opportunities tailored just for you.</CardDescription>
            </div>
            <Button onClick={handleGetRecommendations} disabled={isPending}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                {isPending ? 'Generating...' : 'Generate For Me'}
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isPending && (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="p-4 border rounded-lg animate-pulse">
                        <div className="h-5 w-3/4 bg-muted rounded"></div>
                        <div className="h-4 w-1/2 bg-muted rounded mt-2"></div>
                        <div className="h-4 w-full bg-muted rounded mt-4"></div>
                    </div>
                ))}
            </div>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {!isPending && recommendations.length === 0 && !error && (
            <div className="text-center py-8">
                <p className="text-muted-foreground">Click the "Generate For Me" button to get your personalized recommendations.</p>
            </div>
        )}
        {recommendations.length > 0 && (
            <div className="space-y-4">
                {recommendations.map((rec) => {
                    const originalOpp = opportunities.find(o => o.id === rec.id || o.title.includes(rec.title));
                    return (
                        <div key={rec.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                            <h3 className="font-bold text-lg text-primary">{rec.title}</h3>
                            <p className="text-sm text-muted-foreground font-medium">{rec.company}</p>
                            {originalOpp && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {originalOpp.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                                </div>
                            )}
                            <Alert className="mt-3 bg-accent/10 border-accent/30">
                                <Lightbulb className="h-4 w-4 text-accent" />
                                <AlertTitle className="text-accent/90">Why it's a match</AlertTitle>
                                <AlertDescription>
                                    {rec.reason}
                                </AlertDescription>
                            </Alert>
                        </div>
                    );
                })}
            </div>
        )}
      </CardContent>
    </Card>
  );
}
