import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, TrendingUp, Target, Lightbulb } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ATSAnalysis, ATSScoreBreakdown } from '@/lib/ats-analyzer';

interface EnhancedATSResultsDisplayProps {
  analysis: ATSAnalysis;
}

const EnhancedATSResultsDisplay: React.FC<EnhancedATSResultsDisplayProps> = ({ analysis }) => {
  const { score, missingKeywords, suggestions, strengths, formattingIssues, semanticMatches } = analysis;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Overall Score */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-3">
            <Target className="w-6 h-6 text-primary" />
            ATS Compatibility Score
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="relative w-48 h-48 mx-auto mb-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-5xl font-bold ${getScoreColor(score.overallScore)}`}>
                {score.overallScore}
              </span>
              <span className="text-2xl text-muted-foreground ml-2">/100</span>
            </div>
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle 
                cx="50" cy="50" r="45" 
                fill="none" 
                stroke="#e2e8f0" 
                strokeWidth="8" 
              />
              <circle 
                cx="50" cy="50" r="45" 
                fill="none" 
                stroke={
                  score.overallScore >= 80 ? "#22c55e" : 
                  score.overallScore >= 60 ? "#eab308" : 
                  "#ef4444"
                } 
                strokeWidth="8" 
                strokeLinecap="round"
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * score.overallScore / 100)}
                transform="rotate(-90 50 50)"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
          </div>
          
          <div className="space-y-2">
            <Badge variant={getScoreBadgeVariant(score.overallScore)} className="text-lg px-4 py-2">
              {score.overallScore >= 80 ? "Excellent ATS Match" : 
               score.overallScore >= 60 ? "Good ATS Match" : 
               "Needs Improvement"}
            </Badge>
            <p className="text-sm text-muted-foreground">
              {score.overallScore >= 80 ? "Your resume is highly compatible with ATS systems" :
               score.overallScore >= 60 ? "Your resume has good ATS compatibility with room for improvement" :
               "Your resume needs significant improvements for ATS compatibility"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Score Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Score Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Skills Match */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span className="font-medium">Skills Match</span>
                <Badge variant="outline" className="text-xs">40% Weight</Badge>
              </div>
              <span className={`font-bold ${getScoreColor(score.skillsMatch)}`}>
                {score.skillsMatch}%
              </span>
            </div>
            <Progress value={score.skillsMatch} className="h-3" />
          </div>

          {/* Experience Match */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span className="font-medium">Experience Match</span>
                <Badge variant="outline" className="text-xs">30% Weight</Badge>
              </div>
              <span className={`font-bold ${getScoreColor(score.experienceMatch)}`}>
                {score.experienceMatch}%
              </span>
            </div>
            <Progress value={score.experienceMatch} className="h-3" />
          </div>

          {/* Education Match */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span className="font-medium">Education Match</span>
                <Badge variant="outline" className="text-xs">15% Weight</Badge>
              </div>
              <span className={`font-bold ${getScoreColor(score.educationMatch)}`}>
                {score.educationMatch}%
              </span>
            </div>
            <Progress value={score.educationMatch} className="h-3" />
          </div>

          {/* Formatting Score */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span className="font-medium">ATS Formatting</span>
                <Badge variant="outline" className="text-xs">15% Weight</Badge>
              </div>
              <span className={`font-bold ${getScoreColor(score.formattingScore)}`}>
                {score.formattingScore}%
              </span>
            </div>
            <Progress value={score.formattingScore} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Strengths */}
      {strengths.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              Resume Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {strengths.map((strength, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{strength}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Missing Keywords */}
      {missingKeywords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="w-5 h-5" />
              Missing Keywords
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              These important keywords from the job description are missing from your resume:
            </p>
            <div className="flex flex-wrap gap-2">
              {missingKeywords.slice(0, 10).map((keyword, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {keyword}
                </Badge>
              ))}
              {missingKeywords.length > 10 && (
                <Badge variant="outline" className="text-xs">
                  +{missingKeywords.length - 10} more
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formatting Issues */}
      {formattingIssues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <XCircle className="w-5 h-5" />
              Formatting Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {formattingIssues.map((issue, index) => (
                <div key={index} className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{issue}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Semantic Matches */}
      {semanticMatches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Content Similarity Matches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Your resume content that closely matches the job description:
            </p>
            <div className="space-y-4">
              {semanticMatches.map((match, index) => (
                <div key={index} className="border rounded-lg p-3 bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {match.similarity}% match
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-medium text-muted-foreground">Your Resume:</span>
                      <p className="text-sm italic">"{match.resumeText}"</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-muted-foreground">Job Description:</span>
                      <p className="text-sm italic">"{match.jobText}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Lightbulb className="w-5 h-5" />
              Improvement Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{suggestion}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default EnhancedATSResultsDisplay;
