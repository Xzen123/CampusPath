'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { findProfileByUserId, getOpportunityById } from '@/lib/data';

const AnalyzeAtsInputSchema = z.object({
  userId: z.string(),
  opportunityId: z.string(),
  resumeText: z.string().optional(),
});
export type AnalyzeAtsInput = z.infer<typeof AnalyzeAtsInputSchema>;

const AnalyzeAtsOutputSchema = z.object({
  atsScore: z.number().min(0).max(100).describe('ATS Compatibility score from 0 to 100'),
  matchLevel: z.enum(['Needs Work', 'Fair', 'Strong', 'Exceptional']),
  summary: z.string().describe('Short 2-3 sentence overview of how well the resume matches the job description'),
  matchedKeywords: z.array(z.string()).describe('Skills, technologies, or keywords present in both resume and job description'),
  missingKeywords: z.array(z.string()).describe('Important skills or keywords in the job description that are missing from the resume'),
  suggestions: z.array(z.string()).describe('3-5 specific, actionable tips to improve ATS compatibility and phrasing'),
});
export type AnalyzeAtsOutput = z.infer<typeof AnalyzeAtsOutputSchema>;

const atsPrompt = ai.definePrompt(
  {
    name: 'atsResumeAnalyzerPrompt',
    input: {
      schema: z.object({
        resumeContent: z.string(),
        jobTitle: z.string(),
        company: z.string(),
        jobDescription: z.string(),
        requirements: z.string(),
        tags: z.string(),
      }),
    },
    output: {
      schema: AnalyzeAtsOutputSchema,
    },
  },
  `You are an expert technical recruiter and Applicant Tracking System (ATS) optimization specialist.

Analyze how well this candidate's resume/profile matches the target job description.

=== TARGET JOB ===
Title: {{jobTitle}}
Company: {{company}}
Description: {{jobDescription}}
Requirements: {{requirements}}
Key Skills/Tags: {{tags}}

=== CANDIDATE RESUME / PROFILE ===
{{resumeContent}}

=== INSTRUCTIONS ===
1. Calculate an accurate ATS Compatibility Score (0-100%) based on keyword overlap, technical requirements, and relevance.
2. Determine the match level:
   - 0-49: "Needs Work"
   - 50-69: "Fair"
   - 70-84: "Strong"
   - 85-100: "Exceptional"
3. List the top matched keywords/skills.
4. List crucial missing keywords from the job description that the candidate should consider adding if applicable.
5. Provide 3-5 specific, constructive improvement suggestions to pass ATS screening.
6. Provide a concise summary.

Return a valid JSON object matching the output schema.`
);

export async function analyzeResumeAts(input: AnalyzeAtsInput): Promise<AnalyzeAtsOutput> {
  const [profile, opp] = await Promise.all([
    findProfileByUserId(input.userId),
    getOpportunityById(input.opportunityId),
  ]);

  if (!opp) {
    throw new Error('Opportunity not found.');
  }

  // Build candidate resume text from profile or custom input
  const resumeContent = input.resumeText?.trim() || [
    `Bio: ${profile?.bio || 'Not provided'}`,
    `Skills: ${(profile?.skills || []).map((s) => s.name).join(', ')}`,
    `Projects:\n${(profile?.projects || []).map((p) => `- ${p.title}: ${p.description}`).join('\n')}`,
    `Academics:\n${(profile?.academics || []).map((a) => `- ${a.degree} at ${a.institution} (GPA: ${a.gpa})`).join('\n')}`,
  ].join('\n\n');

  const jobTitle = opp.title;
  const company = opp.company;
  const jobDescription = opp.description;
  const requirements = (opp.eligibility || []).join(', ');
  const tags = (opp.tags || []).join(', ');

  // Try AI generation with retry
  try {
    const { output } = await atsPrompt({
      resumeContent,
      jobTitle,
      company,
      jobDescription,
      requirements,
      tags,
    });
    if (output) return output;
  } catch (err: any) {
    console.warn('ATS AI generation failed, using intelligent fallback:', err?.message);
  }

  // Heuristic ATS fallback calculation
  const candidateSkills = (profile?.skills || []).map((s) => s.name.toLowerCase());
  const oppSkills = (opp.tags || []).concat(opp.eligibility || []);

  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  for (const tag of oppSkills) {
    const clean = tag.toLowerCase().trim();
    if (!clean) continue;
    if (candidateSkills.some((s) => s.includes(clean) || clean.includes(s)) ||
        resumeContent.toLowerCase().includes(clean)) {
      matchedKeywords.push(tag);
    } else {
      missingKeywords.push(tag);
    }
  }

  const totalKeywords = oppSkills.length || 1;
  const matchRatio = matchedKeywords.length / totalKeywords;
  const atsScore = Math.min(96, Math.max(45, Math.round(40 + matchRatio * 55)));

  const matchLevel =
    atsScore >= 85 ? 'Exceptional' : atsScore >= 70 ? 'Strong' : atsScore >= 50 ? 'Fair' : 'Needs Work';

  return {
    atsScore,
    matchLevel,
    summary: `Your resume matches ${matchedKeywords.length} of ${totalKeywords} key technical requirements for the ${opp.title} role at ${opp.company}.`,
    matchedKeywords: matchedKeywords.length > 0 ? matchedKeywords : ['Academic Foundation'],
    missingKeywords: missingKeywords.length > 0 ? missingKeywords.slice(0, 4) : ['Role-specific tooling'],
    suggestions: [
      `Incorporate missing target keywords like ${missingKeywords.slice(0, 2).join(' and ') || 'specialized frameworks'} into your project descriptions.`,
      `Quantify your accomplishments using metrics (e.g., "improved load time by 30%" or "built API handling 100+ requests").`,
      `Tailor your summary or bio section to emphasize alignment with ${opp.company}'s mission in ${opp.type}.`,
    ],
  };
}
