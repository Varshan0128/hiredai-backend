import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import StepIndicator from '@/components/StepIndicator';
import PersonalInfoForm from '@/components/PersonalInfoForm';
import EducationExperienceForm from '@/components/EducationExperienceForm';
import SkillsCertificationsForm from '@/components/SkillsCertificationsForm';
import ProjectsAchievementsForm from '@/components/ProjectsAchievementsForm';
import PortfolioAttachmentForm from '@/components/portfolio/PortfolioAttachmentForm';
import AIResumeGeneration from '@/components/AIResumeGeneration';
import TemplateSelection from '@/components/TemplateSelection';
import { ResumeScoring } from '@/components/ResumeScoring';
import DownloadRecommendations from '@/components/DownloadRecommendations';
import JobRecommendations from '@/components/JobRecommendations';
import { toast } from "sonner";
import { useBreakpoint } from '@/hooks/use-mobile';
import { ArrowRight, ArrowLeft, User, BookOpen, Award, Briefcase, FileImage, Palette, Bot, LineChart, Download, BrainCircuit, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ResumeFeedbackAssistant from '@/components/feedback/ResumeFeedbackAssistant';
import { Progress } from '@/components/ui/progress';
import LiveEditorPreview from '@/components/builder/LiveEditorPreview';
import ATSOptimizationStep from '@/components/builder/ATSOptimizationStep';

export interface ResumeData {
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedIn?: string;
  website?: string;
  profileSummary?: string;

  education?: {
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    startDate: string;
    endDate: string;
    description?: string;
  }[];

  experience?: {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description?: string;
    achievements?: string[];
  }[];

  skills?: string[];
  skillLevel?: Record<string, number>;
  certifications?: {
    name: string;
    issuer: string;
    date: string;
    expires?: string;
  }[];

  projects?: {
    id: string;
    title: string;
    description: string;
    technologies: string[];
    link?: string;
    image?: string;
  }[];
  achievements?: {
    title: string;
    date?: string;
    description: string;
  }[];

  portfolioLinks?: string[];
  portfolioFiles?: File[];
  portfolioItems?: {
    id: string;
    title: string;
    description: string;
    role?: string;
    date?: string;
    link?: string;
    category?: string;
    technologies?: string[];
    skills?: string[];
    theme?: string;
    layout?: 'grid' | 'list' | 'card';
  }[];

  selectedTemplate?: string;
  templateStyles?: {
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
  };
  
  volunteerExperience?: {
    organization: string;
    role: string;
    duration: string;
    description: string;
  }[];
  
  languages?: {
    language: string;
    proficiency: string;
  }[];
}

const STORAGE_KEY = 'resume_builder_data';
const SESSION_KEY = 'resume_builder_session_id';
const REFRESH_TIMESTAMP_KEY = 'resume_builder_refresh_timestamp';

const getInitialResumeData = (): ResumeData => {
  return {
    education: [],
    experience: [],
    skills: [],
    skillLevel: {},
    certifications: [],
    projects: [],
    achievements: [],
    portfolioLinks: [],
    volunteerExperience: [],
    languages: [],
    portfolioItems: []
  };
};

const Builder = () => {
  const [currentStep, setCurrentStep] = useState(1);
  
  const totalSteps = 4;
  const breakpoint = useBreakpoint();
  const isMobileView = breakpoint === 'mobile';
  const navigate = useNavigate();
  
  const steps = [
    {
      id: 1,
      title: "Template Selection",
      description: "Pick an ATS-friendly template (80%+)",
      icon: Palette,
      completed: false
    },
    {
      id: 2,
      title: "Live Edit & Preview",
      description: "Edit details with real-time preview",
      icon: FileImage,
      completed: false
    },
    {
      id: 3,
      title: "ATS Optimization",
      description: "Improve score with keyword suggestions",
      icon: LineChart,
      completed: false
    },
    {
      id: 4,
      title: "Learning Path",
      description: "Build skills with targeted courses",
      icon: BookOpen,
      completed: false
    }
  ];
  
  const isRealPageRefresh = () => {
    const now = Date.now();
    const lastRefresh = parseInt(sessionStorage.getItem(REFRESH_TIMESTAMP_KEY) || '0');
    return now - lastRefresh > 1000;
  };
  
  useEffect(() => {
    const generateSessionId = () => {
      return Math.random().toString(36).substring(2) + Date.now().toString(36);
    };
    
    sessionStorage.setItem(REFRESH_TIMESTAMP_KEY, Date.now().toString());
    
    const currentSessionId = sessionStorage.getItem(SESSION_KEY);
    
    if (!currentSessionId || isRealPageRefresh()) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('resume_builder_step');
      
      const newSessionId = generateSessionId();
      sessionStorage.setItem(SESSION_KEY, newSessionId);
      
      toast.info("Started a new resume creation journey");
      
      setCurrentStep(1);
      
      setResumeData(getInitialResumeData());
    }
    
    const handleBeforeUnload = () => {
      sessionStorage.removeItem(SESSION_KEY);
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (error) {
        console.error('Error parsing saved resume data:', error);
        return getInitialResumeData();
      }
    }
    return getInitialResumeData();
  });
  
  useEffect(() => {
    console.log("Resume data updated:", resumeData);
    
    if (resumeData.templateStyles?.primaryColor) {
      document.documentElement.style.setProperty('--template-primary', resumeData.templateStyles.primaryColor);
    }
    if (resumeData.templateStyles?.secondaryColor) {
      document.documentElement.style.setProperty('--template-secondary', resumeData.templateStyles.secondaryColor);
    }
  }, [resumeData]);
  
  const updateResumeData = (newData: Partial<ResumeData>) => {
    setResumeData(prevData => {
      const updatedData = { ...prevData, ...newData };
      
      const dataToSave = { ...updatedData };
      if (dataToSave.portfolioFiles) {
        delete dataToSave.portfolioFiles;
      }
      
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
        console.log("Data saved to localStorage:", dataToSave);
      } catch (error) {
        console.error('Error saving resume data to localStorage:', error);
      }
      
      return updatedData;
    });
  };
  
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      toast.success(`Moving to ${steps[currentStep]?.title}`);
      
      if (isMobileView) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      toast.success("Professional resume journey completed successfully!");
    }
  };
  
  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      toast(`Returning to ${steps[currentStep - 2]?.title}`);
      
      if (isMobileView) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };
  
  const handleReset = () => {
    setCurrentStep(1);
    const initialData = getInitialResumeData();
    setResumeData(initialData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    toast.success("Started a new professional resume journey");
  };
  
  useEffect(() => {
    localStorage.setItem('resume_builder_step', currentStep.toString());
  }, [currentStep]);
  
  useEffect(() => {
    if (!isRealPageRefresh()) {
      const savedStep = localStorage.getItem('resume_builder_step');
      if (savedStep) {
        const stepNumber = parseInt(savedStep);
        if (!isNaN(stepNumber) && stepNumber >= 1 && stepNumber <= totalSteps) {
          setCurrentStep(stepNumber);
        }
      }
    }
  }, []);
  
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <TemplateSelection 
            onNext={handleNext} 
            onPrev={handlePrev}
            data={resumeData}
            updateData={updateResumeData}
          />
        );
      case 2:
        return (
          <LiveEditorPreview
            onNext={handleNext}
            onPrev={handlePrev}
            data={resumeData}
            updateData={updateResumeData}
          />
        );
      case 3:
        return (
          <ATSOptimizationStep
            onNext={handleNext}
            onPrev={handlePrev}
            data={resumeData}
            updateData={updateResumeData}
          />
        );
      case 4:
        return (
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Learning Path</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">When you add a course in the previous step, we automatically open your Learning Path. You can also open it now.</p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handlePrev}>Back</Button>
                <Button onClick={() => window.location.assign('/learning-path')}>Open Learning Path</Button>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };
  
  const handleFeedbackApply = (field: string, value: string) => {
    const fieldParts = field.split('.');
    
    if (fieldParts.length === 1) {
      updateResumeData({ [field]: value });
      toast.success(`Updated ${field} with suggestion`);
    } else if (fieldParts.length === 3) {
      const [section, indexStr, subfield] = fieldParts;
      const index = parseInt(indexStr.replace(/[^\d]/g, ''), 10);
      
      if (!isNaN(index) && resumeData[section as keyof ResumeData]) {
        const items = [...(resumeData[section as keyof ResumeData] as any[])];
        items[index] = { ...items[index], [subfield]: value };
        updateResumeData({ [section]: items });
        toast.success(`Updated ${subfield} in ${section} with suggestion`);
      }
    }
  };
  
  const hasResumeData = Object.keys(resumeData).some(key => {
    const value = resumeData[key as keyof ResumeData];
    return Array.isArray(value) ? value.length > 0 : Boolean(value);
  });

  const progressPercentage = (currentStep / totalSteps) * 100;
  const currentStepData = steps[currentStep - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-background dark:via-slate-900/50 dark:to-indigo-950/20">
      <Header />
      
      <main className="pt-20 md:pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Progress Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Card className="modern-card p-6">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <CardTitle className="text-2xl font-bold text-foreground">Resume Builder</CardTitle>
                    <p className="text-muted-foreground mt-1">Create your professional resume step by step</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{currentStep}/{totalSteps}</div>
                    <div className="text-sm text-muted-foreground">Steps Complete</div>
                  </div>
                </div>
                
                <Progress value={progressPercentage} className="h-2" />
                
                <div className="flex items-center gap-3 mt-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <currentStepData.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{currentStepData.title}</h3>
                    <p className="text-sm text-muted-foreground">{currentStepData.description}</p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </motion.div>

          {/* Step Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="modern-card p-8 shadow-sm"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderCurrentStep()}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Navigation */}
          {!isMobileView && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 flex justify-between"
            >
              {currentStep > 1 ? (
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </Button>
              ) : (
                <div />
              )}
              
              <Button
                onClick={currentStep < totalSteps ? handleNext : handleReset}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-xl",
                  currentStep === totalSteps ? "bg-green-600 hover:bg-green-700" : ""
                )}
              >
                {currentStep < totalSteps ? "Continue" : "Start New Resume"}
                {currentStep < totalSteps ? (
                  <ArrowRight className="w-4 h-4" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
              </Button>
            </motion.div>
          )}
        </div>
      </main>
      
      <ResumeFeedbackAssistant
        resumeData={resumeData}
        onSuggestionApply={handleFeedbackApply}
      />
      
      {/* Mobile Navigation */}
      {isMobileView && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-card/90 backdrop-blur-xl border-t border-border shadow-lg z-50">
          <div className="flex justify-between gap-3 container max-w-md mx-auto">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handlePrev}
                className="flex-1 flex items-center gap-2 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            )}
            
            <Button
              onClick={currentStep < totalSteps ? handleNext : handleReset}
              className={cn(
                "flex-1 flex items-center gap-2 rounded-xl",
                currentStep === totalSteps && "bg-green-600 hover:bg-green-700"
              )}
            >
              {currentStep < totalSteps ? "Continue" : "Finish"}
              {currentStep < totalSteps ? (
                <ArrowRight className="w-4 h-4" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Builder;
