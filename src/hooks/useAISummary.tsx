
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ResumeData } from '@/pages/Builder';

export const useAISummary = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSummary = async (resumeData: ResumeData): Promise<string | null> => {
    setIsGenerating(true);
    
    try {
      console.log('Generating AI summary with data:', resumeData);
      
      const { data, error } = await supabase.functions.invoke('generate-summary', {
        body: { resumeData }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to generate summary');
      }

      if (data?.summary) {
        toast.success("AI summary generated successfully!");
        return data.summary;
      } else {
        throw new Error('No summary returned from AI');
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      toast.error(`Failed to generate summary: ${error.message}`);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generateSummary, isGenerating };
};
