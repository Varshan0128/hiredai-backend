// 🔍 Test change: checking CodeRabbit review integration

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText, jobDescription } = await req.json();
    const affindaApiKey = Deno.env.get('AFFINDA_API_KEY');
    
    if (!affindaApiKey) {
      throw new Error('Missing Affinda API key');
    }
    
    if (!resumeText || !jobDescription) {
      throw new Error('Missing resume text or job description');
    }

    if (resumeText.trim().length < 50) {
      throw new Error('Resume is too short. Please provide a more detailed resume.');
    }

    if (jobDescription.trim().length < 50) {
      throw new Error('Job description is too short. Please provide a more detailed job description.');
    }

    // First, create a resume parsing request to Affinda
    const resumeResponse = await fetch("https://api.affinda.com/v3/documents", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${affindaApiKey}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        data: resumeText,
        file_name: "resume.txt",
        document_type: "resume"
      })
    });

    if (!resumeResponse.ok) {
      const errorText = await resumeResponse.text();
      console.error("Affinda resume parsing error:", errorText);
      throw new Error(`Failed to parse resume: ${resumeResponse.status}`);
    }

    const resumeData = await resumeResponse.json();
    const resumeDocumentId = resumeData.identifier;

    // Next, create a job description parsing request
    const jobResponse = await fetch("https://api.affinda.com/v3/documents", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${affindaApiKey}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        data: jobDescription,
        file_name: "job.txt",
        document_type: "job_description"
      })
    });

    if (!jobResponse.ok) {
      const errorText = await jobResponse.text();
      console.error("Affinda job parsing error:", errorText);
      throw new Error(`Failed to parse job description: ${jobResponse.status}`);
    }

    const jobData = await jobResponse.json();
    const jobDocumentId = jobData.identifier;

    // Finally, create an index match request to compare resume against job
    const matchResponse = await fetch("https://api.affinda.com/v3/index/match", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${affindaApiKey}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        indices: [
          {
            name: "resume",
            document_ids: [resumeDocumentId]
          }
        ],
        document_ids: [jobDocumentId]
      })
    });

    if (!matchResponse.ok) {
      const errorText = await matchResponse.text();
      console.error("Affinda match error:", errorText);
      throw new Error(`Failed to match resume with job: ${matchResponse.status}`);
    }

    const matchData = await matchResponse.json();
    
    // Transform Affinda's response to match our expected format
    const result = {
      atsScore: Math.round(matchData.match_percentage * 100) || 0,
      skillsMatch: Math.round(matchData.match_scores?.skills * 100) || 0,
      experienceMatch: Math.round(matchData.match_scores?.experience * 100) || 0,
      educationMatch: Math.round(matchData.match_scores?.education * 100) || 0,
      jobTitleMatch: Math.round(matchData.match_scores?.job_titles * 100) || 0,
      formattingIssues: matchData.missing_skills?.map(skill => `Missing skill: ${skill}`) || [],
      suggestions: [
        "Add keywords from the job description that are missing in your resume",
        "Use standard section headings that ATS systems can easily recognize",
        "Avoid using tables, headers, footers, and text boxes in your resume"
      ],
      analysis: matchData.match_analysis || "Your resume has been analyzed against the job description using Affinda's commercial ATS analysis system."
    };

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
