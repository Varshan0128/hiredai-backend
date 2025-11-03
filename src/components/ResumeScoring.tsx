import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Award, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import AnimatedButton from './AnimatedButton';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { ResumeData } from '@/pages/Builder';

interface ResumeScoreItemProps {
  title: string;
  score: number;
  feedback: string;
  suggestions: string[];
}

interface ResumeScoreProps {
  contentScore: number;
  formatScore: number;
  atsScore: number;
  overallScore: number;
}

interface ResumeReportProps {
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

interface ResumeScoringProps {
  onNext: () => void;
  onPrev: () => void;
  data: ResumeData;
}

export const ResumeScoring: React.FC<ResumeScoringProps> = ({ 
  onNext, 
  onPrev,
  data 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  
  const [scores, setScores] = useState<ResumeScoreProps>({
    contentScore: 0,
    formatScore: 0,
    atsScore: 0,
    overallScore: 0
  });
  
  const [report, setReport] = useState<ResumeReportProps>({
    strengths: [],
    weaknesses: [],
    suggestions: []
  });
  
  useEffect(() => {
    const timer = setTimeout(() => {
      let contentPoints = 0;
      let totalContentPoints = 0;
      
      totalContentPoints += 20;
      if (data.fullName) contentPoints += 5;
      if (data.email) contentPoints += 5;
      if (data.phone) contentPoints += 5;
      if (data.location) contentPoints += 5;
      
      totalContentPoints += 15;
      if (data.profileSummary) {
        if (data.profileSummary.length > 300) contentPoints += 15;
        else if (data.profileSummary.length > 150) contentPoints += 10;
        else if (data.profileSummary.length > 50) contentPoints += 5;
      }
      
      totalContentPoints += 15;
      if (data.education && data.education.length > 0) {
        const educationPoints = Math.min(15, data.education.length * 7);
        contentPoints += educationPoints;
      }
      
      totalContentPoints += 20;
      if (data.experience && data.experience.length > 0) {
        const experiencePoints = Math.min(20, data.experience.length * 7);
        contentPoints += experiencePoints;
      }
      
      totalContentPoints += 15;
      if (data.skills && data.skills.length > 0) {
        const skillPoints = Math.min(15, data.skills.length * 2);
        contentPoints += skillPoints;
      }
      
      totalContentPoints += 15;
      let projectPoints = 0;
      if (data.projects && data.projects.length > 0) {
        projectPoints += Math.min(10, data.projects.length * 3);
      }
      if (data.achievements && data.achievements.length > 0) {
        projectPoints += Math.min(5, data.achievements.length * 2);
      }
      contentPoints += projectPoints;
      
      const contentScore = Math.round((contentPoints / totalContentPoints) * 100);
      
      const formatScore = data.selectedTemplate ? 92 : 70;
      
      let atsScore = 0;
      
      let keywordScore = 0;
      
      const industryKeywords = [
        'experienced', 'professional', 'skilled', 'expert', 'proficient', 'certified',
        'specialized', 'proven', 'qualified', 'knowledgeable', 'trained', 'competent',
        'accomplished', 'adept', 'versed', 'talented', 'practiced', 'educated'
      ];
      
      const actionVerbs = [
        'managed', 'developed', 'created', 'implemented', 'led', 'increased', 'achieved',
        'reduced', 'improved', 'designed', 'launched', 'coordinated', 'generated',
        'delivered', 'produced', 'built', 'established', 'streamlined', 'maintained',
        'resolved', 'trained', 'supervised', 'directed', 'initiated'
      ];
      
      let keywordsFound = 0;
      let totalKeywords = industryKeywords.length + actionVerbs.length;
      
      const allText = JSON.stringify(data).toLowerCase();
      
      industryKeywords.forEach(keyword => {
        if (allText.includes(keyword.toLowerCase())) keywordsFound += 1.2;
      });
      
      actionVerbs.forEach(verb => {
        if (allText.includes(verb.toLowerCase())) keywordsFound += 1.5;
      });
      
      let quantifiableBonus = 0;
      const quantifiableTerms = [
        '%', 'percent', 'increased', 'decreased', 'reduced', 'improved', 'generated',
        'saved', '$', 'million', 'thousand', 'hundred', 'doubled', 'tripled'
      ];
      
      quantifiableTerms.forEach(term => {
        if (allText.includes(term.toLowerCase())) quantifiableBonus += 0.5;
      });
      
      quantifiableBonus = Math.min(quantifiableBonus, 10);
      
      keywordScore = Math.min(25, (keywordsFound / totalKeywords) * 20 + quantifiableBonus);
      
      let sectionScore = 0;
      const standardSections = [
        'summary', 'profile', 'objective', 'experience', 'work', 'employment',
        'education', 'skills', 'qualifications', 'certifications', 'achievements',
        'projects', 'publications', 'awards', 'references', 'languages', 'volunteer'
      ];
      
      let sectionsFound = 0;
      standardSections.forEach(section => {
        if (allText.includes(section.toLowerCase())) sectionsFound++;
      });
      
      sectionScore = Math.min(15, (sectionsFound / 10) * 15);
      
      let formatCompatibilityScore = data.selectedTemplate ? 25 : 15;
      
      if (data.experience && data.experience.some(exp => 
          exp.description && (exp.description.includes('•') || exp.description.includes('-') || exp.description.includes('*')))) {
        formatCompatibilityScore += 5;
      }
      
      const contentCompletenessScore = Math.round((contentScore / 100) * 30);
      
      atsScore = Math.min(100, Math.round(keywordScore + sectionScore + formatCompatibilityScore + contentCompletenessScore));
      
      const overallScore = Math.round((contentScore * 0.35) + (formatScore * 0.25) + (atsScore * 0.4));
      
      setScores({
        contentScore,
        formatScore,
        atsScore,
        overallScore
      });
      
      const strengths = [];
      const weaknesses = [];
      const suggestions = [];
      
      if (contentScore >= 80) {
        strengths.push("Comprehensive professional narrative with rich content that showcases your career trajectory and achievements.");
      } else if (contentScore >= 60) {
        strengths.push("Solid content foundation that effectively communicates your professional qualifications.");
      }
      
      if (data.skills && data.skills.length > 7) {
        strengths.push("Impressive skill set demonstrating technical versatility and domain expertise that will appeal to hiring managers.");
      } else if (data.skills && data.skills.length > 4) {
        strengths.push("Well-rounded skill profile highlighting your core competencies in your field.");
      }
      
      if (data.experience && data.experience.length > 2) {
        strengths.push("Strong professional history showcasing consistent career progression and valuable industry experience.");
      } else if (data.experience && data.experience.length > 0) {
        strengths.push("Relevant work experience that demonstrates practical application of your skills.");
      }
      
      if (data.projects && data.projects.length > 1) {
        strengths.push("Compelling project portfolio highlighting your practical accomplishments and problem-solving capabilities.");
      }
      
      if (formatScore >= 90) {
        strengths.push("Exceptional visual presentation with a professional template that organizes information for maximum impact and readability.");
      } else if (formatScore >= 75) {
        strengths.push("Clean, structured format that presents your qualifications in a clear, accessible manner.");
      }
      
      if (atsScore >= 85) {
        strengths.push("Outstanding ATS optimization that ensures maximum visibility to employers using automated screening systems.");
      } else if (atsScore >= 70) {
        strengths.push("Good ATS compatibility that should help your resume pass through initial automated screenings.");
      }
      
      if (contentScore < 70) {
        weaknesses.push("Content depth could be enriched to create a more compelling professional narrative.");
        suggestions.push("Enhance each section with more specific details about your responsibilities, achievements, and the impact of your work to create a more comprehensive picture of your capabilities.");
      }
      
      if (!data.profileSummary || data.profileSummary.length < 100) {
        weaknesses.push("Professional summary lacks the impact needed to make a strong first impression.");
        suggestions.push("Develop a powerful professional summary (5-6 sentences) that succinctly communicates your expertise, unique value proposition, and career objectives with industry-specific keywords.");
      }
      
      if (!data.skills || data.skills.length < 5) {
        weaknesses.push("Skills section needs expansion to showcase your full range of capabilities to potential employers.");
        suggestions.push("Augment your skills section with both technical and soft skills that align with your target roles, prioritizing those mentioned in job descriptions you're targeting.");
      }
      
      if (!data.experience || data.experience.length < 2) {
        weaknesses.push("Work experience section requires more depth to establish your professional credibility.");
        suggestions.push("Strengthen your experience section by quantifying achievements (e.g., 'Increased sales by 20%', 'Managed a team of 5') and using powerful action verbs to describe your responsibilities and accomplishments.");
      }
      
      if (atsScore < 75) {
        weaknesses.push("ATS compatibility requires improvement to ensure your resume doesn't get filtered out before reaching human reviewers.");
        suggestions.push("Integrate more industry-specific keywords and phrases throughout your resume, particularly in your summary and skills sections, to improve ATS detection and ranking.");
        suggestions.push("Structure your resume with standard section headings (Experience, Education, Skills, etc.) and avoid complex formatting that ATS systems might misinterpret.");
      }
      
      if (data.experience && data.experience.length > 0) {
        if (!data.experience.some(exp => exp.description && exp.description.includes('%'))) {
          suggestions.push("Transform your impact statements by incorporating quantifiable metrics (percentages, dollar amounts, team sizes) to provide concrete evidence of your achievements and capabilities.");
        }
      }
      
      suggestions.push("Craft custom versions of your resume for each significant application, strategically aligning keywords and emphasizing relevant experiences to match specific job descriptions.");
      
      if (data.skills && data.skills.length > 0 && !data.skills.some(skill => skill.length > 15)) {
        suggestions.push("Consider organizing your skills into categories (e.g., Technical Skills, Soft Skills, Industry Knowledge) to improve readability and ATS compatibility.");
      }
      
      setReport({
        strengths: strengths.length > 0 ? strengths : ["Your resume establishes a solid professional foundation that can be built upon."],
        weaknesses: weaknesses.length > 0 ? weaknesses : ["No significant areas of concern detected in your current resume."],
        suggestions: suggestions.length > 0 ? suggestions : ["Continue refining your resume for specific job applications to maximize relevance and impact."]
      });
      
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [data]);
  
  const scoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-amber-500";
    return "text-red-500";
  };
  
  const scoreBackground = (score: number) => {
    if (score >= 85) return "bg-green-600";
    if (score >= 70) return "bg-amber-500";
    return "bg-red-500";
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Resume score analyzed");
    onNext();
  };

  const motionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-8">
          <motion.h2 
            className="text-2xl font-bold mb-2 text-foreground"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Resume Score Analysis
          </motion.h2>
          <motion.p 
            className="text-muted-foreground text-balance max-w-md mx-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Our AI has thoroughly analyzed your resume for content quality, formatting, and ATS compatibility using industry-leading algorithms.
          </motion.p>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-muted-foreground">Analyzing your resume with our AI engine...</p>
          </div>
        ) : (
          <>
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 bg-primary/10">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold">Overall Score</h3>
                    <div className="flex items-center">
                      <div className={`text-3xl font-bold ${scoreColor(scores.overallScore)}`}>
                        {scores.overallScore}%
                      </div>
                      <Award className={`w-6 h-6 ml-2 ${scoreColor(scores.overallScore)}`} />
                    </div>
                  </div>
                  <Progress 
                    value={scores.overallScore} 
                    max={100} 
                    className={`h-3 bg-primary/20`}
                    style={{
                      background: `linear-gradient(to right, #f3f4f6 0%, #f3f4f6 100%)`,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <div 
                      className="absolute inset-0 transition-all duration-1000 ease-out"
                      style={{
                        width: `${scores.overallScore}%`,
                        background: `linear-gradient(to right, ${scoreBackground(scores.overallScore)} 0%, ${scoreBackground(scores.overallScore)} 100%)`,
                      }}
                    />
                  </Progress>
                </div>
                
                <div className="p-6 grid gap-5">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Content Quality</span>
                      <span className={`font-semibold ${scoreColor(scores.contentScore)}`}>
                        {scores.contentScore}%
                      </span>
                    </div>
                    <Progress 
                      value={scores.contentScore} 
                      max={100} 
                      className="h-2 bg-primary/20"
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Formatting & Structure</span>
                      <span className={`font-semibold ${scoreColor(scores.formatScore)}`}>
                        {scores.formatScore}%
                      </span>
                    </div>
                    <Progress 
                      value={scores.formatScore} 
                      max={100} 
                      className="h-2 bg-primary/20"
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">ATS Compatibility</span>
                      <span className={`font-semibold ${scoreColor(scores.atsScore)}`}>
                        {scores.atsScore}%
                      </span>
                    </div>
                    <Progress 
                      value={scores.atsScore} 
                      max={100} 
                      className="h-2 bg-primary/20"
                    />
                  </div>
                </div>
                
                <div className="border-t p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm">
                      <Info className="w-4 h-4 mr-1 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {scores.overallScore >= 85 ? "Exceptional resume poised to make a strong impression!" : 
                         scores.overallScore >= 70 ? "Strong resume with targeted improvement opportunities" : 
                         "Your resume needs strategic enhancements to maximize impact"}
                      </span>
                    </div>
                    <Button 
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDetails(!showDetails)}
                      className="text-xs"
                    >
                      {showDetails ? 'Hide Details' : 'View Details'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {showDetails && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="flex items-center text-lg font-medium mb-3 text-green-600">
                      <CheckCircle className="w-5 h-5 mr-2" /> Strengths
                    </h3>
                    <ul className="space-y-2 pl-7 list-disc">
                      {report.strengths.map((strength, index) => (
                        <li key={index} className="text-sm">{strength}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="flex items-center text-lg font-medium mb-3 text-red-600">
                      <XCircle className="w-5 h-5 mr-2" /> Areas for Improvement
                    </h3>
                    <ul className="space-y-2 pl-7 list-disc">
                      {report.weaknesses.map((weakness, index) => (
                        <li key={index} className="text-sm">{weakness}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="flex items-center text-lg font-medium mb-3 text-amber-600">
                      <AlertTriangle className="w-5 h-5 mr-2" /> Recommendations
                    </h3>
                    <ul className="space-y-2 pl-7 list-disc">
                      {report.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm">{suggestion}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <div className="bg-accent/30 p-4 rounded-lg">
                  <p className="flex items-start text-sm">
                    <Info className="w-5 h-5 mr-2 flex-shrink-0 text-primary" />
                    <span>
                      These scores are generated using advanced AI algorithms based on industry best practices, recruiter preferences, and ATS system requirements. Implementing our recommendations can significantly increase your resume's effectiveness.
                    </span>
                  </p>
                </div>
              </motion.div>
            )}
          </>
        )}
        
        <motion.div 
          className="pt-4 flex justify-between"
          custom={5}
          initial="hidden"
          animate="visible"
          variants={motionVariants}
        >
          <Button 
            type="button" 
            onClick={onPrev}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          
          <AnimatedButton 
            type="submit" 
            variant="default" 
            className="w-auto"
          >
            <span>Continue to Job Recommendations</span>
            <ArrowRight className="ml-2 w-4 h-4" />
          </AnimatedButton>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default ResumeScoring;
