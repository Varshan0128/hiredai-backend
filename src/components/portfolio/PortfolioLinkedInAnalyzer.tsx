
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';
import { Briefcase, Linkedin, FileText, Link, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ResumeData } from '@/pages/Builder';
import { useLinkedInValidator } from '@/hooks/use-linkedin-validator';
import FeedbackSuggestion from '../feedback/FeedbackSuggestion';

interface PortfolioLinkedInAnalyzerProps {
  resumeData: ResumeData;
  onApplySuggestion: (field: string, value: string) => void;
}

const PortfolioLinkedInAnalyzer: React.FC<PortfolioLinkedInAnalyzerProps> = ({ 
  resumeData,
  onApplySuggestion
}) => {
  const isMobile = useIsMobile();
  const [linkedInUrl, setLinkedInUrl] = useState(resumeData.linkedIn || '');
  const [activeTab, setActiveTab] = useState<string>('portfolio');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const { validateLinkedInUrl, validationError } = useLinkedInValidator();
  
  // Mock data for demonstration
  const [portfolioInsights, setPortfolioInsights] = useState<{
    missingKeywords: string[];
    trendingSkills: string[];
    strengthScore: number;
    suggestions: Array<{title: string, original?: string, suggested: string, field: string}>;
  }>({
    missingKeywords: [],
    trendingSkills: [],
    strengthScore: 0,
    suggestions: []
  });
  
  const [linkedInInsights, setLinkedInInsights] = useState<{
    profileCompleteness: number;
    recommendedConnections: string[];
    visibilityScore: number;
    suggestions: Array<{title: string, original?: string, suggested: string, field: string}>;
  }>({
    profileCompleteness: 0,
    recommendedConnections: [],
    visibilityScore: 0,
    suggestions: []
  });
  
  const analyzePortfolio = () => {
    setIsAnalyzing(true);
    
    // Simulate API call
    setTimeout(() => {
      const projectTitles = resumeData.projects?.map(p => p.title.toLowerCase()) || [];
      const projectDescriptions = resumeData.projects?.map(p => p.description.toLowerCase()) || [];
      const allProjectText = [...projectTitles, ...projectDescriptions].join(' ');
      const userSkills = resumeData.skills || [];
      
      // Check for important keywords in tech portfolios
      const techKeywords = ['responsive', 'optimization', 'scalable', 'performance', 'accessibility', 'testing', 'user experience', 'security'];
      const missingKeywords = techKeywords.filter(keyword => !allProjectText.includes(keyword.toLowerCase()));
      
      // Current trending skills that might be missing from the user's skills
      const trendingSkills = ['React', 'TypeScript', 'Next.js', 'AI integration', 'Cloud services', 'Data visualization']
        .filter(skill => !userSkills.some(userSkill => 
          userSkill.toLowerCase() === skill.toLowerCase()
        ));
      
      // Calculate strength score based on projects and skills
      const projectCount = resumeData.projects?.length || 0;
      const skillCount = resumeData.skills?.length || 0;
      const hasDetailedDescriptions = resumeData.projects?.every(p => p.description.length > 50) || false;
      const strengthScore = Math.min(85, 
        (projectCount > 0 ? 30 : 0) + 
        (skillCount > 3 ? 30 : skillCount * 10) + 
        (hasDetailedDescriptions ? 25 : 0)
      );
      
      // Generate suggestions
      const suggestions = [];
      
      if (resumeData.projects && resumeData.projects.length > 0) {
        const sampleProject = resumeData.projects[0];
        if (sampleProject.description && sampleProject.description.length < 100) {
          suggestions.push({
            title: "Enhance project description",
            original: sampleProject.description,
            suggested: `${sampleProject.description} This project demonstrated my skills in problem-solving and collaboration, resulting in improved user engagement and performance metrics.`,
            field: `projects.0.description`
          });
        }
      }
      
      if (!resumeData.profileSummary || resumeData.profileSummary.length < 100) {
        suggestions.push({
          title: "Add a comprehensive profile summary",
          original: resumeData.profileSummary || "",
          suggested: "Dedicated and innovative professional with a passion for creating user-centered solutions. Skilled in modern web technologies with a track record of delivering high-quality projects on time. Eager to contribute my technical expertise and creative problem-solving to impactful projects.",
          field: "profileSummary"
        });
      }
      
      setPortfolioInsights({
        missingKeywords,
        trendingSkills,
        strengthScore,
        suggestions
      });
      
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      toast.success("Portfolio analysis complete!");
    }, 2000);
  };
  
  const analyzeLinkedIn = () => {
    if (!validateLinkedInUrl(linkedInUrl)) {
      return;
    }
    
    setIsAnalyzing(true);
    
    // Simulate API call
    setTimeout(() => {
      // Calculate profile completeness based on resume data
      const hasName = !!resumeData.fullName;
      const hasEmail = !!resumeData.email;
      const hasPhone = !!resumeData.phone;
      const hasLocation = !!resumeData.location;
      const hasEducation = resumeData.education && resumeData.education.length > 0;
      const hasExperience = resumeData.experience && resumeData.experience.length > 0;
      const hasSkills = resumeData.skills && resumeData.skills.length > 0;
      
      const profileCompleteness = Math.round(
        ((hasName ? 15 : 0) +
        (hasEmail ? 10 : 0) +
        (hasPhone ? 10 : 0) +
        (hasLocation ? 10 : 0) +
        (hasEducation ? 15 : 0) +
        (hasExperience ? 20 : 0) +
        (hasSkills ? 20 : 0))
      );
      
      // Mock recommended connections based on industry/field
      const recommendedConnections = [
        "Connect with hiring managers in your target companies",
        "Engage with alumni from your educational institutions",
        "Join industry-specific groups related to your skills"
      ];
      
      // Calculate visibility score
      const visibilityScore = Math.min(90, profileCompleteness + 
        (resumeData.linkedIn ? 15 : 0) + 
        (resumeData.website ? 10 : 0));
      
      // Generate LinkedIn suggestions
      const suggestions = [];
      
      if (!resumeData.linkedIn || resumeData.linkedIn !== linkedInUrl) {
        suggestions.push({
          title: "Update LinkedIn URL in your profile",
          original: resumeData.linkedIn || "",
          suggested: linkedInUrl,
          field: "linkedIn"
        });
      }
      
      suggestions.push({
        title: "Create a compelling LinkedIn headline",
        suggested: `${resumeData.experience?.[0]?.position || 'Professional'} with expertise in ${resumeData.skills?.slice(0, 3).join(', ') || 'relevant skills'}`,
        field: "linkedIn_headline"
      });
      
      setLinkedInInsights({
        profileCompleteness,
        recommendedConnections,
        visibilityScore,
        suggestions
      });
      
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      toast.success("LinkedIn profile analysis complete!");
    }, 2000);
  };
  
  const handleAnalyze = () => {
    if (activeTab === 'portfolio') {
      analyzePortfolio();
    } else {
      analyzeLinkedIn();
    }
  };
  
  const renderPortfolioAnalysis = () => {
    if (!analysisComplete) {
      return (
        <div className="text-center py-10">
          <Briefcase className="w-16 h-16 mx-auto text-muted-foreground/60 mb-4" />
          <h3 className="text-xl font-medium mb-2">Portfolio Analysis</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Get insights on your portfolio projects, discover missing keywords, and find trending skills to add.
          </p>
          <Button
            variant="default"
            onClick={analyzePortfolio}
            disabled={isAnalyzing}
            className="w-full md:w-auto"
          >
            {isAnalyzing ? (
              <>Analyzing Portfolio...</>
            ) : (
              <>Analyze My Portfolio</>
            )}
          </Button>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Portfolio Strength
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">{portfolioInsights.strengthScore}</span>
                <span className="text-sm text-muted-foreground mb-1">/100</span>
              </div>
              <Progress value={portfolioInsights.strengthScore} className="h-2 mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                Missing Keywords
              </CardTitle>
            </CardHeader>
            <CardContent>
              {portfolioInsights.missingKeywords.length === 0 ? (
                <p className="text-sm text-muted-foreground">No missing keywords found!</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {portfolioInsights.missingKeywords.map((keyword, index) => (
                    <Badge key={index} variant="outline" className="bg-red-500/10 text-red-600 border-red-200">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                Trending Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              {portfolioInsights.trendingSkills.length === 0 ? (
                <p className="text-sm text-muted-foreground">Your skills are up to date!</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {portfolioInsights.trendingSkills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200">
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Suggestions to Improve</h3>
          {portfolioInsights.suggestions.length === 0 ? (
            <p className="text-muted-foreground py-4">Your portfolio looks great! No suggestions at this time.</p>
          ) : (
            <div className="space-y-4">
              {portfolioInsights.suggestions.map((suggestion, index) => (
                <FeedbackSuggestion
                  key={index}
                  title={suggestion.title}
                  originalText={suggestion.original}
                  suggestedText={suggestion.suggested}
                  field={suggestion.field}
                  onApply={onApplySuggestion}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  const renderLinkedInAnalysis = () => {
    if (!analysisComplete) {
      return (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <Input
                type="url"
                placeholder="https://linkedin.com/in/yourprofile"
                value={linkedInUrl}
                onChange={(e) => setLinkedInUrl(e.target.value)}
                className="w-full"
              />
              {validationError && (
                <p className="text-sm text-red-500 mt-1">{validationError}</p>
              )}
            </div>
            <Button
              variant="default"
              onClick={analyzeLinkedIn}
              disabled={isAnalyzing}
              className="whitespace-nowrap"
            >
              {isAnalyzing ? (
                <>Analyzing Profile...</>
              ) : (
                <>Analyze LinkedIn</>
              )}
            </Button>
          </div>
          
          <div className="text-center py-8">
            <Linkedin className="w-16 h-16 mx-auto text-muted-foreground/60 mb-4" />
            <h3 className="text-xl font-medium mb-2">LinkedIn Analysis</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Get insights on your LinkedIn profile, discover opportunities to improve visibility, and receive personalized recommendations.
            </p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" />
                Profile Completeness
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">{linkedInInsights.profileCompleteness}</span>
                <span className="text-sm text-muted-foreground mb-1">/100</span>
              </div>
              <Progress value={linkedInInsights.profileCompleteness} className="h-2 mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Link className="w-4 h-4 text-green-500" />
                Visibility Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">{linkedInInsights.visibilityScore}</span>
                <span className="text-sm text-muted-foreground mb-1">/100</span>
              </div>
              <Progress value={linkedInInsights.visibilityScore} className="h-2 mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Linkedin className="w-4 h-4 text-blue-600" />
                Connection Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="px-2 pb-2">
              <ul className="text-sm space-y-1">
                {linkedInInsights.recommendedConnections.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-muted-foreground">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">LinkedIn Optimization Suggestions</h3>
          {linkedInInsights.suggestions.length === 0 ? (
            <p className="text-muted-foreground py-4">Your LinkedIn profile looks great! No suggestions at this time.</p>
          ) : (
            <div className="space-y-4">
              {linkedInInsights.suggestions.map((suggestion, index) => (
                <FeedbackSuggestion
                  key={index}
                  title={suggestion.title}
                  originalText={suggestion.original}
                  suggestedText={suggestion.suggested}
                  field={suggestion.field}
                  onApply={onApplySuggestion}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary" />
          Portfolio & LinkedIn Analyzer
        </CardTitle>
        <CardDescription>
          Get smart insights by analyzing your portfolio projects and LinkedIn profile
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs 
          defaultValue="portfolio" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="portfolio" onClick={() => {
              setActiveTab('portfolio');
              setAnalysisComplete(false);
            }}>
              <Briefcase className="w-4 h-4 mr-2" />
              Portfolio Analysis
            </TabsTrigger>
            <TabsTrigger value="linkedin" onClick={() => {
              setActiveTab('linkedin');
              setAnalysisComplete(false);
            }}>
              <Linkedin className="w-4 h-4 mr-2" />
              LinkedIn Analysis
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="portfolio" className="mt-0">
            {renderPortfolioAnalysis()}
          </TabsContent>
          
          <TabsContent value="linkedin" className="mt-0">
            {renderLinkedInAnalysis()}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {analysisComplete && (
        <CardFooter className="flex justify-end border-t pt-4">
          <Button
            variant="outline"
            onClick={() => {
              setAnalysisComplete(false);
              toast.success("Starting a new analysis");
            }}
          >
            Analyze Again
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default PortfolioLinkedInAnalyzer;
