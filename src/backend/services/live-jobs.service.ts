import { connectDB } from '@/backend/db/mongoose';
import OpportunityModel from '@/backend/db/models/Opportunity.model';
import type { Opportunity } from '@/lib/definitions';

function stripHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>?/gm, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Fetch live jobs from Remotive API (Real-world tech jobs, free & public)
 */
async function fetchRemotiveJobs(): Promise<Omit<Opportunity, 'id' | 'postedAt'>[]> {
  try {
    const res = await fetch('https://remotive.com/api/remote-jobs?category=software-dev&limit=35', {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      console.warn(`[LiveJobs] Remotive API returned status ${res.status}`);
      return [];
    }
    const data = await res.json();
    const jobs = data.jobs || [];

    return jobs.map((job: any): Omit<Opportunity, 'id' | 'postedAt'> => {
      const cleanDesc = stripHtml(job.description).slice(0, 500) + '...';
      const tags = (job.tags || []).slice(0, 5);
      if (tags.length === 0) tags.push('Software Engineering', 'Full Stack');

      const isIntern = job.title.toLowerCase().includes('intern');

      return {
        title: job.title,
        company: job.company_name,
        logoUrl: job.company_logo || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=300&auto=format&fit=crop',
        description: cleanDesc,
        eligibility: ['B.Tech / M.Tech / MCA', 'Relevant experience or projects'],
        tags,
        type: isIntern ? 'Internship' : 'Full-time',
        salary: job.salary || 'Competitive / Industry Standard',
        location: job.candidate_required_location || 'Remote (Worldwide)',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        sourcePlatform: 'LinkedIn',
        externalUrl: job.url,
      };
    });
  } catch (error) {
    console.error('[LiveJobs] Failed to fetch from Remotive:', error);
    return [];
  }
}

/**
 * Fetch live jobs from Arbeitnow API (Real-world tech & engineering jobs, free & public)
 */
async function fetchArbeitnowJobs(): Promise<Omit<Opportunity, 'id' | 'postedAt'>[]> {
  try {
    const res = await fetch('https://www.arbeitnow.com/api/job-board-api', {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      console.warn(`[LiveJobs] Arbeitnow API returned status ${res.status}`);
      return [];
    }
    const data = await res.json();
    const jobs = data.data || [];

    return jobs.slice(0, 25).map((job: any): Omit<Opportunity, 'id' | 'postedAt'> => {
      const cleanDesc = stripHtml(job.description).slice(0, 500) + '...';
      const tags = (job.tags || []).slice(0, 5);
      if (tags.length === 0) tags.push('Engineering', 'Tech');

      const isIntern = job.title.toLowerCase().includes('intern') || job.title.toLowerCase().includes('trainee');

      return {
        title: job.title,
        company: job.company_name,
        logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=300&auto=format&fit=crop',
        description: cleanDesc,
        eligibility: ['Any Graduate / Engineering Degree'],
        tags,
        type: isIntern ? 'Internship' : 'Full-time',
        salary: 'As per industry norms',
        location: job.location || (job.remote ? 'Remote' : 'Hybrid'),
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        sourcePlatform: 'Indeed',
        externalUrl: job.url,
      };
    });
  } catch (error) {
    console.error('[LiveJobs] Failed to fetch from Arbeitnow:', error);
    return [];
  }
}

/**
 * Fetch live LinkedIn / Indeed jobs via RapidAPI / JSearch (if key configured)
 */
async function fetchRapidApiJobs(): Promise<Omit<Opportunity, 'id' | 'postedAt'>[]> {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) return [];

  try {
    const res = await fetch(
      'https://jsearch.p.rapidapi.com/search?query=software%20developer%20in%20india&num_pages=1',
      {
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
        },
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const jobs = data.data || [];

    return jobs.map((job: any): Omit<Opportunity, 'id' | 'postedAt'> => {
      const isIntern = job.job_title?.toLowerCase().includes('intern');
      const publisher = job.job_publisher?.toLowerCase() || '';
      let platform: 'LinkedIn' | 'Indeed' | 'Internshala' | 'Unstop' | 'Campus' = 'LinkedIn';
      if (publisher.includes('indeed')) platform = 'Indeed';
      else if (publisher.includes('internshala')) platform = 'Internshala';
      else if (publisher.includes('unstop')) platform = 'Unstop';

      return {
        title: job.job_title,
        company: job.employer_name,
        logoUrl: job.employer_logo || 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=300&auto=format&fit=crop',
        description: job.job_description ? job.job_description.slice(0, 500) + '...' : '',
        eligibility: job.job_highlights?.Qualifications || ['B.Tech / MCA / M.Tech'],
        tags: job.job_required_skills || ['Software Development', 'Problem Solving'],
        type: isIntern ? 'Internship' : 'Full-time',
        salary: job.job_min_salary ? `₹${job.job_min_salary} - ₹${job.job_max_salary}` : 'Competitive',
        location: `${job.job_city || ''}, ${job.job_country || 'India'}`.trim(),
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        sourcePlatform: platform,
        externalUrl: job.job_apply_link || job.job_google_link,
      };
    });
  } catch (error) {
    console.error('[LiveJobs] Failed to fetch RapidAPI jobs:', error);
    return [];
  }
}

/**
 * Fetch all available live jobs from real APIs
 */
export async function fetchAllLiveJobs(): Promise<Omit<Opportunity, 'id' | 'postedAt'>[]> {
  const [remotiveJobs, arbeitnowJobs, rapidApiJobs] = await Promise.all([
    fetchRemotiveJobs(),
    fetchArbeitnowJobs(),
    fetchRapidApiJobs(),
  ]);

  const combined = [...rapidApiJobs, ...remotiveJobs, ...arbeitnowJobs];
  console.log(`[LiveJobs] Total live jobs fetched: ${combined.length}`);
  return combined;
}

/**
 * Syncs live jobs directly into MongoDB Atlas Opportunity collection
 */
export async function syncLiveJobsToDatabase(): Promise<{ count: number; message: string }> {
  await connectDB();
  const liveJobs = await fetchAllLiveJobs();

  if (liveJobs.length === 0) {
    return { count: 0, message: 'No live jobs returned from APIs at this moment.' };
  }

  let upsertedCount = 0;
  for (const job of liveJobs) {
    // Avoid duplicate insertions by matching on company + title or externalUrl
    const filter = job.externalUrl
      ? { externalUrl: job.externalUrl }
      : { title: job.title, company: job.company };

    await OpportunityModel.findOneAndUpdate(
      filter,
      {
        $set: {
          title: job.title,
          company: job.company,
          logoUrl: job.logoUrl,
          description: job.description,
          eligibility: job.eligibility,
          tags: job.tags,
          type: job.type,
          salary: job.salary,
          location: job.location,
          deadline: job.deadline,
          sourcePlatform: job.sourcePlatform,
          externalUrl: job.externalUrl,
        },
      },
      { upsert: true, returnDocument: 'after' }
    );
    upsertedCount++;
  }

  return {
    count: upsertedCount,
    message: `Successfully synchronized ${upsertedCount} live opportunities from live job boards into MongoDB!`,
  };
}
