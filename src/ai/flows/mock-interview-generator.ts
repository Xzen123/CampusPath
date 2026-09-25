'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getOpportunityById, findProfileByUserId } from '@/lib/data';

const GenerateInterviewInputSchema = z.object({
  opportunityId: z.string(),
  userId: z.string().optional(),
});
export type GenerateInterviewInput = z.infer<typeof GenerateInterviewInputSchema>;

const InterviewQuestionSchema = z.object({
  id: z.number(),
  question: z.string().describe('The interview question'),
  type: z.enum(['Technical', 'Behavioral', 'Situational']),
  sampleAnswerGuide: z.string().describe('Key points, STAR method outline, or technical concepts to include in a great response'),
  tips: z.string().describe('Interviewer perspective or common pitfalls to avoid'),
});
export type InterviewQuestion = z.infer<typeof InterviewQuestionSchema>;

const GenerateInterviewOutputSchema = z.object({
  companyOverview: z.string().describe('Brief 1-2 sentence tip on what this company typically looks for'),
  questions: z.array(InterviewQuestionSchema).describe('5 tailored interview questions'),
});
export type GenerateInterviewOutput = z.infer<typeof GenerateInterviewOutputSchema>;

const interviewPrompt = ai.definePrompt(
  {
    name: 'mockInterviewGeneratorPrompt',
    input: {
      schema: z.object({
        jobTitle: z.string(),
        company: z.string(),
        jobDescription: z.string(),
        eligibility: z.string(),
        tags: z.string(),
        studentSkills: z.string(),
      }),
    },
    output: {
      schema: GenerateInterviewOutputSchema,
    },
  },
  `You are a senior technical hiring manager and career coach preparing a college candidate for an interview.

=== TARGET ROLE ===
Title: {{jobTitle}}
Company: {{company}}
Description: {{jobDescription}}
Requirements: {{eligibility}}
Tags: {{tags}}

=== CANDIDATE SKILLS ===
{{studentSkills}}

=== INSTRUCTIONS ===
1. Provide a brief overview of what {{company}} typically values in candidates for {{jobTitle}}.
2. Generate exactly 5 realistic, high-yield interview questions:
   - 2-3 Technical questions testing core concepts from the job requirements
   - 1-2 Behavioral questions (e.g. teamwork, resolving challenges using STAR method)
   - 1 Situational / problem-solving question
3. For each question, provide:
   - "sampleAnswerGuide": An outline of an exceptional answer
   - "tips": Practical guidance from the interviewer's perspective

Return a valid JSON object matching the output schema.`
);

export async function generateMockInterview(
  input: GenerateInterviewInput
): Promise<GenerateInterviewOutput> {
  const [opp, profile] = await Promise.all([
    getOpportunityById(input.opportunityId),
    input.userId ? findProfileByUserId(input.userId) : Promise.resolve(null),
  ]);

  if (!opp) {
    throw new Error('Opportunity not found.');
  }

  const jobTitle = opp.title;
  const company = opp.company;
  const jobDescription = opp.description;
  const eligibility = (opp.eligibility || []).join(', ');
  const tags = (opp.tags || []).join(', ');
  const studentSkills = (profile?.skills || []).map((s) => s.name).join(', ') || 'General Engineering';

  // Try AI generation with retry
  try {
    const { output } = await interviewPrompt({
      jobTitle,
      company,
      jobDescription,
      eligibility,
      tags,
      studentSkills,
    });
    if (output && output.questions.length > 0) return output;
  } catch (err: any) {
    console.warn('Mock interview AI generation failed, using intelligent fallback:', err?.message);
  }

  // Heuristic Fallback questions tailored to the role
  const primaryTag = opp.tags?.[0] || 'Software';
  const secondaryTag = opp.tags?.[1] || 'Problem Solving';

  return {
    companyOverview: `${company} emphasizes strong technical fundamentals, hands-on problem-solving, and a collaborative team mindset for their ${jobTitle} positions.`,
    questions: [
      {
        id: 1,
        type: 'Technical',
        question: `Can you explain how you would design and optimize a feature utilizing ${primaryTag} in a production environment?`,
        sampleAnswerGuide: `Discuss core architecture, error handling, performance bottlenecks, and testing strategies. Mention real-world trade-offs you encountered in past projects.`,
        tips: `Be specific with technical terminology and highlight how you measure system reliability.`,
      },
      {
        id: 2,
        type: 'Technical',
        question: `What are the most common challenges you face when working with ${secondaryTag}, and how do you debug them?`,
        sampleAnswerGuide: `Walk through a concrete scenario: identify the root cause, explain your debugging workflow (logs, profiling), and how you prevented recurrence.`,
        tips: `Interviewers want to see your systematic problem-solving approach rather than quick guesses.`,
      },
      {
        id: 3,
        type: 'Behavioral',
        question: `Tell me about a challenging team project where you had a disagreement on the technical direction. How did you resolve it?`,
        sampleAnswerGuide: `Use the STAR method: Situation (project & team goal), Task (conflict or divergence), Action (data-driven discussion, prototyping), Result (successful delivery).`,
        tips: `Focus on constructive communication and staying focused on the end-user's needs.`,
      },
      {
        id: 4,
        type: 'Situational',
        question: `Imagine you are assigned a task with vague requirements and an approaching deadline at ${company}. What are your first three steps?`,
        sampleAnswerGuide: `1. Clarify expectations with mentors/stakeholders. 2. Break down into an MVP and prioritize critical path. 3. Communicate timeline risks early.`,
        tips: `Show proactive ownership rather than waiting passively for complete specifications.`,
      },
      {
        id: 5,
        type: 'Behavioral',
        question: `Why are you interested in joining ${company} as a ${jobTitle}, and what do you hope to achieve here?`,
        sampleAnswerGuide: `Connect ${company}'s products or engineering culture to your personal career aspirations and past learnings.`,
        tips: `Avoid generic answers—mention specific tech stacks or values that resonate with you.`,
      },
    ],
  };
}
