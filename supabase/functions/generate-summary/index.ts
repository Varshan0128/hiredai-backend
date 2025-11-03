
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
    const { resumeData } = await req.json();
    const geminiApiKey = Deno.env.get('gemini_api');
    
    if (!geminiApiKey) {
      throw new Error('Missing Gemini API key');
    }

    // Create a comprehensive prompt based on resume data
    const createPrompt = (data: any) => {
      let prompt = `Create a compelling 2-3 sentence professional summary for a resume based on the following information:

Name: ${data.fullName || 'Professional'}
`;

      if (data.experience && data.experience.length > 0) {
        prompt += `\nWork Experience:\n`;
        data.experience.forEach((exp: any, index: number) => {
          prompt += `${index + 1}. ${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate})\n`;
          if (exp.description) {
            prompt += `   Description: ${exp.description}\n`;
          }
        });
      }

      if (data.education && data.education.length > 0) {
        prompt += `\nEducation:\n`;
        data.education.forEach((edu: any, index: number) => {
          prompt += `${index + 1}. ${edu.degree} in ${edu.fieldOfStudy || 'N/A'} from ${edu.institution}\n`;
        });
      }

      if (data.skills && data.skills.length > 0) {
        prompt += `\nKey Skills: ${data.skills.join(', ')}\n`;
      }

      if (data.projects && data.projects.length > 0) {
        prompt += `\nNotable Projects:\n`;
        data.projects.forEach((project: any, index: number) => {
          prompt += `${index + 1}. ${project.title}: ${project.description}\n`;
        });
      }

      prompt += `\nPlease write a professional summary that:
1. Highlights their most relevant experience and skills
2. Shows their career progression and achievements
3. Is tailored for job applications
4. Is concise but impactful (2-3 sentences maximum)
5. Uses action-oriented language

The summary should be written in third person and focus on what makes this candidate unique and valuable to potential employers.`;

      return prompt;
    };

    const prompt = createPrompt(resumeData);

    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are an expert resume writer and career coach. Create compelling, professional summaries that help candidates stand out to employers.\n\n${prompt}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 200,
        },
      }),
    });

    const result = await response.json();
    
    if (result.error) {
      throw new Error(`Gemini API error: ${result.error.message}`);
    }

    const generatedSummary = result.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to generate summary at this time.";

    return new Response(
      JSON.stringify({ summary: generatedSummary }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating summary:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
