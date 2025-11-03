
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import ATSInputForm from './ATSInputForm';
import ATSResultsDisplay from './ATSResultsDisplay';
import { validateInputs, handleResumeFile } from './utils/atsUtils';

interface ATSAnalysis {
  atsScore: number;
  skillsMatch: number;
  experienceMatch: number;
  educationMatch: number;
  jobTitleMatch: number;
  formattingIssues: string[];
  suggestions: string[];
  analysis: string;
}

const ATSScoreCalculator: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleResumeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResumeText(e.target.value);
    if (error) setError(null);
  };
  
  const handleJobDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJobDescription(e.target.value);
    if (error) setError(null);
  };
  
  const clearForm = () => {
    setResumeText('');
    setJobDescription('');
    setAnalysis(null);
    setError(null);
  };
  
  const handleResumeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleResumeFile(e.target.files?.[0], setResumeText);
  };
  
  const analyzeResume = async () => {
    if (!validateInputs(resumeText, jobDescription)) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('ats-score', {
        body: { resumeText, jobDescription }
      });
      
      if (error) throw new Error(error.message);
      
      // Validate response structure
      if (!data || typeof data.atsScore !== 'number') {
        throw new Error("Invalid response format from ATS analysis");
      }
      
      setAnalysis(data);
    } catch (err: any) {
      console.error("Error analyzing resume:", err);
      setError(err.message || "An error occurred while analyzing your resume");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-bold">
              <Bot className="h-6 w-6 text-primary" /> 
              Commercial ATS Score Analyzer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!analysis ? (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  This tool uses a commercial ATS API to analyze your resume against a job description, 
                  giving you accurate insights into how Applicant Tracking Systems view your resume.
                </p>
                <ATSInputForm
                  resumeText={resumeText}
                  jobDescription={jobDescription}
                  isLoading={isLoading}
                  onResumeChange={handleResumeChange}
                  onJobDescriptionChange={handleJobDescriptionChange}
                  onResumeFile={handleResumeFileUpload}
                  onAnalyzeClick={analyzeResume}
                />
                
                {error && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </>
            ) : (
              <ATSResultsDisplay analysis={analysis} />
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={clearForm}
              disabled={isLoading}
            >
              Clear
            </Button>
            {analysis && (
              <Button onClick={() => setAnalysis(null)}>
                Calculate Another
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default ATSScoreCalculator;
