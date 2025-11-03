
import React from 'react';
import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

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

interface ATSResultsDisplayProps {
  analysis: ATSAnalysis;
}

const ATSResultsDisplay: React.FC<ATSResultsDisplayProps> = ({ analysis }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="text-center py-4">
        <h3 className="text-xl font-bold mb-2">Your ATS Score</h3>
        <div className="relative w-48 h-48 mx-auto">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold">{analysis.atsScore}</span>
          </div>
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle 
              cx="50" cy="50" r="45" 
              fill="none" 
              stroke="#e2e8f0" 
              strokeWidth="10" 
            />
            <circle 
              cx="50" cy="50" r="45" 
              fill="none" 
              stroke={
                analysis.atsScore >= 80 ? "#22c55e" : 
                analysis.atsScore >= 60 ? "#eab308" : 
                "#ef4444"
              } 
              strokeWidth="10" 
              strokeLinecap="round"
              strokeDasharray="282.7"
              strokeDashoffset={282.7 - (282.7 * analysis.atsScore / 100)}
              transform="rotate(-90 50 50)"
            />
          </svg>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <h4 className="font-medium">Skills Match</h4>
          <div className="flex items-center gap-2">
            <Progress value={analysis.skillsMatch} className="h-2" />
            <span className="text-sm font-medium">{analysis.skillsMatch}%</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <h4 className="font-medium">Experience Match</h4>
          <div className="flex items-center gap-2">
            <Progress value={analysis.experienceMatch} className="h-2" />
            <span className="text-sm font-medium">{analysis.experienceMatch}%</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <h4 className="font-medium">Education Match</h4>
          <div className="flex items-center gap-2">
            <Progress value={analysis.educationMatch} className="h-2" />
            <span className="text-sm font-medium">{analysis.educationMatch}%</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <h4 className="font-medium">Job Title Match</h4>
          <div className="flex items-center gap-2">
            <Progress value={analysis.jobTitleMatch} className="h-2" />
            <span className="text-sm font-medium">{analysis.jobTitleMatch}%</span>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h4 className="font-medium">Analysis</h4>
        <p className="text-sm text-gray-700 dark:text-gray-300">{analysis.analysis}</p>
      </div>
      
      {analysis.formattingIssues && analysis.formattingIssues.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Formatting Issues</h4>
          <ul className="list-disc pl-5 space-y-1">
            {analysis.formattingIssues.map((issue, index) => (
              <li key={index} className="text-sm text-gray-700 dark:text-gray-300">
                <div className="flex items-start gap-2">
                  <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>{issue}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {analysis.suggestions && analysis.suggestions.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Suggestions</h4>
          <ul className="list-disc pl-5 space-y-1">
            {analysis.suggestions.map((suggestion, index) => (
              <li key={index} className="text-sm text-gray-700 dark:text-gray-300">
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{suggestion}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

export default ATSResultsDisplay;
