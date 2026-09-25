'use server';

/**
 * @fileOverview AI flow for recommending opportunities to students.
 * Fetches the student's profile and all available opportunities from the
 * data layer and uses Gemini to return structured, ranked recommendations
 * with a match score and reasoning for each.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { findProfileByUserId, getOpportunities } from '@/lib/data';

// ─── Input / Output Schemas ────────────────────────────────────────────────

const RecommendOpportunitiesInputSchema = z.object({
  userId: z.string().describe('The ID of the student requesting recommendations.'),
});
export type RecommendOpportunitiesInput = z.infer<typeof RecommendOpportunitiesInputSchema>;

const RecommendedOpportunitySchema = z.object({
  id: z.string().describe('The exact ID of the opportunity from the provided list.'),
  title: z.string().describe('Job/internship title.'),
  company: z.string().describe('Company name.'),
  matchScore: z
    .number()
    .min(0)
    .max(100)
    .describe('A 0-100 score indicating how well this opportunity matches the student profile.'),
  reason: z
    .string()
    .describe('A concise, student-friendly explanation (2-3 sentences) of why this opportunity is a great match.'),
  keySkillsMatched: z
    .array(z.string())
    .describe('List of specific skills from the student profile that match this opportunity.'),
});
export type RecommendedOpportunity = z.infer<typeof RecommendedOpportunitySchema>;

const RecommendOpportunitiesOutputSchema = z.object({
  recommendations: z
    .array(RecommendedOpportunitySchema)
    .describe('List of recommended opportunities, ranked from highest to lowest match score.'),
  overallInsight: z
    .string()
    .describe(
      'A short, motivating overall insight (1-2 sentences) about the student\'s profile strengths and areas for growth.'
    ),
});
export type RecommendOpportunitiesOutput = z.infer<typeof RecommendOpportunitiesOutputSchema>;

// ─── Internal helpers ──────────────────────────────────────────────────────

function formatProfileForAI(profile: {
  bio: string;
  skills: { name: string }[];
  projects: { title: string; description: string }[];
  academics: { degree: string; institution: string; gpa: string }[];
}): string {
  const skills = profile.skills.map((s) => s.name).join(', ') || 'None listed';
  const projects = profile.projects
    .map((p) => `- ${p.title}: ${p.description}`)
    .join('\n') || 'None listed';
  const academics = profile.academics
    .map((a) => `${a.degree} from ${a.institution} (GPA: ${a.gpa})`)
    .join(', ') || 'None listed';

  return `Bio: ${profile.bio}
Skills: ${skills}
Academic Background: ${academics}
Projects:
${projects}`;
}

function formatOpportunitiesForAI(
  opportunities: {
    id: string;
    title: string;
    company: string;
    type: string;
    description: string;
    eligibility: string[];
    tags: string[];
  }[]
): string {
  return opportunities
    .map(
      (opp) => `ID: ${opp.id}
Title: ${opp.title}
Company: ${opp.company}
Type: ${opp.type}
Description: ${opp.description}
Eligibility: ${opp.eligibility.join(', ')}
Required Skills/Tags: ${opp.tags.join(', ')}`
    )
    .join('\n---\n');
}

// ─── Prompt ────────────────────────────────────────────────────────────────

const prompt = ai.definePrompt({
  name: 'recommendOpportunitiesPrompt',
  input: {
    schema: z.object({
      studentProfile: z.string(),
      availableOpportunities: z.string(),
    }),
  },
  output: { schema: RecommendOpportunitiesOutputSchema },
  prompt: `You are an expert career counselor AI for a campus placement platform. 
Your job is to analyze a student's profile and recommend the best matching opportunities from the available list.

STUDENT PROFILE:
{{{studentProfile}}}

AVAILABLE OPPORTUNITIES:
{{{availableOpportunities}}}

INSTRUCTIONS:
1. Carefully analyze the student's skills, academics, projects, and bio.
2. For each opportunity, calculate a match score (0-100) based on skill overlap, eligibility, and overall fit.
3. Recommend the TOP 3 best matching opportunities only.
4. Rank them from highest to lowest match score.
5. For each recommendation, provide:
   - The EXACT opportunity ID from the list
   - A matchScore (integer 0-100)
   - A friendly, specific reason (2-3 sentences) explaining the match
   - List of specific skills from the student's profile that match
6. Also provide a short overallInsight about the student's profile strengths.
7. Be encouraging and constructive in tone.
8. If the student's profile has very few skills listed, still recommend the 3 best fits with lower scores.

Return a valid JSON object matching the output schema exactly.`,
});

// ─── Genkit Flow ───────────────────────────────────────────────────────────

const recommendOpportunitiesFlow = ai.defineFlow(
  {
    name: 'recommendOpportunitiesFlow',
    inputSchema: RecommendOpportunitiesInputSchema,
    outputSchema: RecommendOpportunitiesOutputSchema,
  },
  async (input) => {
    // Fetch data directly from the data layer — this is the "database connection"
    const [profile, allOpportunities] = await Promise.all([
      findProfileByUserId(input.userId),
      getOpportunities(),
    ]);

    if (!profile) {
      return {
        recommendations: [],
        overallInsight:
          'Your profile is incomplete. Please add your skills, projects, and academic background to get personalized recommendations.',
      };
    }

    if (allOpportunities.length === 0) {
      return {
        recommendations: [],
        overallInsight: 'No opportunities are currently available. Check back soon!',
      };
    }

    const studentProfile = formatProfileForAI(profile);
    const availableOpportunities = formatOpportunitiesForAI(allOpportunities);

    // Attempt AI prompt with automatic retry and graceful fallback
    try {
      const { output } = await prompt({ studentProfile, availableOpportunities });
      if (output && output.recommendations.length > 0) {
        return output;
      }
    } catch (aiErr: any) {
      console.warn('AI prompt encountered an error, trying retry...', aiErr?.message);
      // Short delay before retry (helps with temporary 503 spikes)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      try {
        const { output } = await prompt({ studentProfile, availableOpportunities });
        if (output && output.recommendations.length > 0) {
          return output;
        }
      } catch (retryErr: any) {
        console.warn('AI retry also failed, falling back to smart profile matching:', retryErr?.message);
      }
    }

    // Heuristic Fallback: Match student skills with opportunities if AI service is busy (503)
    const studentSkills = (profile.skills || []).map((s) => s.name.toLowerCase());

    const scored = allOpportunities.map((opp) => {
      const oppTags = (opp.tags || []).map((t) => t.toLowerCase());
      const oppText = `${opp.title} ${opp.description} ${(opp.eligibility || []).join(' ')}`.toLowerCase();

      const matched = (profile.skills || []).filter((s) => {
        const skillName = s.name.toLowerCase();
        return oppTags.some((t) => t.includes(skillName) || skillName.includes(t)) ||
               oppText.includes(skillName);
      });

      const matchedSkillNames = matched.map((m) => m.name);
      const matchScore = Math.min(
        95,
        Math.max(50, 45 + matchedSkillNames.length * 15)
      );

      const reason =
        matchedSkillNames.length > 0
          ? `Your background in ${matchedSkillNames.join(', ')} aligns directly with the requirements for this role at ${opp.company}.`
          : `This ${opp.type.toLowerCase()} at ${opp.company} is a strong match for your academic discipline and career interests.`;

      return {
        id: opp.id,
        title: opp.title,
        company: opp.company,
        matchScore,
        reason,
        keySkillsMatched: matchedSkillNames.length > 0 ? matchedSkillNames : ['General Aptitude'],
      };
    });

    // Sort descending by match score and take top 3
    scored.sort((a, b) => b.matchScore - a.matchScore);
    const top3 = scored.slice(0, 3);

    return {
      recommendations: top3,
      overallInsight:
        profile.skills && profile.skills.length > 0
          ? `Profile analyzed: Your strongest technical focus areas (${profile.skills.map((s) => s.name).join(', ')}) provide a competitive foundation for these roles.`
          : 'Profile analyzed: Consider adding more technical skills and projects to further boost your match scores.',
    };
  }
);

// ─── Exported function (called from client via server action) ──────────────

export async function recommendOpportunities(
  input: RecommendOpportunitiesInput
): Promise<RecommendOpportunitiesOutput> {
  return recommendOpportunitiesFlow(input);
}
