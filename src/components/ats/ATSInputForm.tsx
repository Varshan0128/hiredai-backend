
import React from 'react';
import { Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ATSInputFormProps {
  resumeText: string;
  jobDescription: string;
  isLoading: boolean;
  onResumeChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onJobDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onResumeFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAnalyzeClick: () => void;
}

const ATSInputForm: React.FC<ATSInputFormProps> = ({
  resumeText,
  jobDescription,
  isLoading,
  onResumeChange,
  onJobDescriptionChange,
  onResumeFile,
  onAnalyzeClick
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="font-medium">Your Resume</label>
          <Button 
            variant="outline" 
            size="sm" 
            className="relative"
            onClick={() => document.getElementById('resume-file')?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload
            <input
              id="resume-file"
              type="file"
              accept=".txt,.pdf,.doc,.docx"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={onResumeFile}
            />
          </Button>
        </div>
        <Textarea 
          value={resumeText}
          onChange={onResumeChange}
          placeholder="Paste your resume text here... (minimum 50 characters)"
          className="min-h-[200px]"
        />
        {resumeText && resumeText.length < 50 && (
          <p className="text-xs text-amber-500">Resume is too short. Add more details for better analysis.</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label className="font-medium">Job Description</label>
        <Textarea 
          value={jobDescription}
          onChange={onJobDescriptionChange}
          placeholder="Paste the job description here... (minimum 50 characters)"
          className="min-h-[200px]"
        />
        {jobDescription && jobDescription.length < 50 && (
          <p className="text-xs text-amber-500">Job description is too short. Add more details for better analysis.</p>
        )}
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={onAnalyzeClick}
          disabled={isLoading || !resumeText.trim() || !jobDescription.trim() || resumeText.length < 50 || jobDescription.length < 50}
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              Analyzing...
            </>
          ) : (
            <>
              <span>Analyze Resume</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ATSInputForm;
