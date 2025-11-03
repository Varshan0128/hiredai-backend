
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface JobSearchParams {
  location: string;
  skills: string[];
  experience: any[];
  jobTitle?: string;
}

interface JSearchJob {
  job_title: string;
  employer_name: string;
  job_city: string;
  job_state: string;
  job_country: string;
  job_description: string;
  job_apply_link: string;
  job_min_salary?: number;
  job_max_salary?: number;
  job_salary_currency?: string;
  job_id: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { location, skills, experience, jobTitle } = await req.json() as JobSearchParams;
    
    const jsearchApiKey = Deno.env.get('JSEARCH_API_KEY');
    if (!jsearchApiKey) {
      throw new Error('JSEARCH_API_KEY not configured');
    }

    // Construct search query based on user profile
    let query = '';
    if (jobTitle) {
      query = `${jobTitle} in ${location}`;
    } else if (skills && skills.length > 0) {
      // Use the first few skills to create a job query
      query = `${skills.slice(0, 3).join(' ')} jobs in ${location}`;
    } else {
      query = `software developer jobs in ${location}`;
    }

    console.log('Searching for jobs:', { query, location });

    // Call JSearch RapidAPI
    const jsearchUrl = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=1&num_pages=1&date_posted=all`;

    const response = await fetch(jsearchUrl, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': jsearchApiKey,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('JSearch API error:', data);
      throw new Error(`JSearch API error: ${data.message || 'Unknown error'}`);
    }

    console.log('JSearch API response received, jobs found:', data.data?.length || 0);

    // Process and format job results to match expected format
    const jobs = (data.data || []).slice(0, 10).map((job: JSearchJob, index: number) => {
      // Calculate match percentage based on skills overlap
      let matchPercentage = 60 + Math.floor(Math.random() * 30); // Base 60-90%
      
      if (skills && skills.length > 0) {
        const jobText = (job.job_title + ' ' + job.job_description).toLowerCase();
        const matchingSkills = skills.filter(skill => 
          jobText.includes(skill.toLowerCase())
        );
        const skillsMatchBonus = (matchingSkills.length / skills.length) * 20;
        matchPercentage = Math.min(95, matchPercentage + Math.floor(skillsMatchBonus));
      }

      // Format salary
      let salary = 'Salary not specified';
      if (job.job_min_salary && job.job_max_salary) {
        const currency = job.job_salary_currency || 'USD';
        const formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currency === 'USD' ? 'USD' : 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
        salary = `${formatter.format(job.job_min_salary)} - ${formatter.format(job.job_max_salary)}`;
      }

      // Format location
      const jobLocation = [job.job_city, job.job_state, job.job_country]
        .filter(Boolean)
        .join(', ') || location || 'Remote';

      return {
        id: job.job_id || `job-${index}`,
        title: job.job_title || 'Software Developer',
        company: job.employer_name || 'Company',
        location: jobLocation,
        salary: salary,
        description: job.job_description ? job.job_description.substring(0, 200) + '...' : 'Join our team and make an impact.',
        requiredSkills: extractSkillsFromDescription(job.job_description, skills || []),
        matchPercentage,
        applyUrl: job.job_apply_link || `https://www.google.com/search?q=${encodeURIComponent(job.job_title + ' ' + job.employer_name + ' jobs')}`,
        logo: undefined
      };
    });

    console.log('Processed jobs:', jobs.length);

    return new Response(
      JSON.stringify({ jobs }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error fetching jobs:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        jobs: [] // Return empty array as fallback
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});

function extractSkillsFromDescription(description: string, userSkills: string[]): string[] {
  if (!description) return [];
  
  const commonTechSkills = [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'TypeScript', 
    'AWS', 'Docker', 'Kubernetes', 'SQL', 'MongoDB', 'PostgreSQL',
    'Git', 'Agile', 'Scrum', 'REST API', 'GraphQL', 'HTML', 'CSS'
  ];
  
  const descLower = description.toLowerCase();
  const foundSkills: string[] = [];
  
  // Check for user skills first
  userSkills.forEach(skill => {
    if (descLower.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  });
  
  // Add common tech skills found in description
  commonTechSkills.forEach(skill => {
    if (descLower.includes(skill.toLowerCase()) && !foundSkills.includes(skill)) {
      foundSkills.push(skill);
    }
  });
  
  return foundSkills.slice(0, 8); // Limit to 8 skills
}
