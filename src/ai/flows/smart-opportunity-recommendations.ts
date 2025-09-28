// This is a server-side file.
'use server';

/**
 * @fileOverview This file defines a Genkit flow for recommending opportunities to students based on their profile, skills, and academic background.
 * It exports the `recommendOpportunities` function, the `RecommendOpportunitiesInput` type, and the `RecommendOpportunitiesOutput` type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the recommendation flow.
const RecommendOpportunitiesInputSchema = z.object({
  studentProfile: z.string().describe('A detailed profile of the student, including skills, academic background, and interests.'),
  availableOpportunities: z.string().describe('A list of available opportunities (jobs, internships, trainings) with descriptions and requirements.'),
});
export type RecommendOpportunitiesInput = z.infer<typeof RecommendOpportunitiesInputSchema>;

// Define the output schema for the recommendation flow.
const RecommendOpportunitiesOutputSchema = z.object({
  recommendedOpportunities: z.string().describe('A list of opportunities recommended to the student, ranked by relevance.'),
  reasoning: z.string().describe('Explanation of why these opportunities were recommended.'),
});
export type RecommendOpportunitiesOutput = z.infer<typeof RecommendOpportunitiesOutputSchema>;

// Define the main function that will be called to get opportunity recommendations.
export async function recommendOpportunities(input: RecommendOpportunitiesInput): Promise<RecommendOpportunitiesOutput> {
  return recommendOpportunitiesFlow(input);
}

// Define the prompt for the LLM.
const prompt = ai.definePrompt({
  name: 'recommendOpportunitiesPrompt',
  input: {schema: RecommendOpportunitiesInputSchema},
  output: {schema: RecommendOpportunitiesOutputSchema},
  prompt: `You are an AI assistant designed to recommend opportunities to students based on their profile and available opportunities.

  Student Profile: {{{studentProfile}}}
  Available Opportunities: {{{availableOpportunities}}}

  Based on the student's profile, recommend the most relevant opportunities from the available list. Explain your reasoning for each recommendation.
  The output should be a JSON object containing a list of recommended opportunities ranked by relevance and a field explaining the reasoning behind each recommendation.
  `,
});

// Define the Genkit flow.
const recommendOpportunitiesFlow = ai.defineFlow(
  {
    name: 'recommendOpportunitiesFlow',
    inputSchema: RecommendOpportunitiesInputSchema,
    outputSchema: RecommendOpportunitiesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
