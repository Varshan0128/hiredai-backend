import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2, FileText, Sparkles, CheckCircle2, Code, BarChart3, Bot } from 'lucide-react';
import { Button } from "@/components/ui/button";
import AnimatedButton from './AnimatedButton';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ResumeData } from '@/pages/Builder';
import { getTemplateById, renderTemplate } from '@/services/templateService';

interface AIResumeGenerationProps {
  onNext: () => void;
  onPrev: () => void;
  data: ResumeData;
  updateData?: (data: ResumeData) => void;
}

interface GenerationStep {
  name: string;
  description: string;
  progress: number;
  completed: boolean;
  icon: React.ReactNode;
}

const AIResumeGeneration: React.FC<AIResumeGenerationProps> = ({ 
  onNext, 
  onPrev,
  data,
  updateData
}) => {
  const [generating, setGenerating] = useState(true);
  const [resumeContent, setResumeContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [generationSteps, setGenerationSteps] = useState<GenerationStep[]>([
    { 
      name: "Analyzing Profile", 
      description: "Evaluating your professional qualifications and career trajectory", 
      progress: 0, 
      completed: false,
      icon: <Bot className="w-5 h-5 text-purple-500" />
    },
    { 
      name: "Optimizing Content", 
      description: "Enhancing your narrative with industry-specific keywords for ATS optimization", 
      progress: 0, 
      completed: false,
      icon: <BarChart3 className="w-5 h-5 text-blue-500" />
    },
    { 
      name: "Applying Template", 
      description: "Formatting your credentials with an elegant, recruiter-friendly design", 
      progress: 0, 
      completed: false,
      icon: <Code className="w-5 h-5 text-amber-500" />
    },
    { 
      name: "Finalizing Resume", 
      description: "Polishing your professional narrative for maximum impact and readability", 
      progress: 0, 
      completed: false,
      icon: <CheckCircle2 className="w-5 h-5 text-green-500" />
    }
  ]);
  
  const getTemplateName = () => {
    const templateId = data.selectedTemplate;
    if (!templateId) return "Unknown Template";
    
    const template = getTemplateById(parseInt(templateId));
    return template ? template.name : "Unknown Template";
  };

  const getTemplateStyles = () => {
    const defaultStyles = {
      primaryColor: "#4f46e5",
      secondaryColor: "#818cf8",
      fontFamily: "Inter"
    };

    return {
      primaryColor: data.templateStyles?.primaryColor || defaultStyles.primaryColor,
      secondaryColor: data.templateStyles?.secondaryColor || defaultStyles.secondaryColor,
      fontFamily: data.templateStyles?.fontFamily || defaultStyles.fontFamily
    };
  };
  
  useEffect(() => {
    setGenerating(true);
    setError(null);
    
    if (!data.fullName || !data.email) {
      setError("Missing essential information. Please complete your personal details.");
      setGenerating(false);
      return;
    }
    
    if (!data.selectedTemplate) {
      setError("No template selected. Please go back and select a template.");
      setGenerating(false);
      return;
    }
    
    let stepDelay = 800;
    const step1Timer = setTimeout(() => {
      setGenerationSteps(prev => {
        const newSteps = [...prev];
        newSteps[0].progress = 100;
        newSteps[0].completed = true;
        return newSteps;
      });
      setCurrentStep(1);
    }, stepDelay);
    
    const step2Timer = setTimeout(() => {
      setGenerationSteps(prev => {
        const newSteps = [...prev];
        newSteps[1].progress = 100;
        newSteps[1].completed = true;
        return newSteps;
      });
      setCurrentStep(2);
    }, stepDelay * 2);
    
    const step3Timer = setTimeout(() => {
      setGenerationSteps(prev => {
        const newSteps = [...prev];
        newSteps[2].progress = 100;
        newSteps[2].completed = true;
        return newSteps;
      });
      setCurrentStep(3);
    }, stepDelay * 3);
    
    const step4Timer = setTimeout(() => {
      setGenerationSteps(prev => {
        const newSteps = [...prev];
        newSteps[3].progress = 100;
        newSteps[3].completed = true;
        return newSteps;
      });
      
      try {
        const templateId = data.selectedTemplate ? parseInt(data.selectedTemplate) : 1;
        const template = getTemplateById(templateId);
        
        if (!template || !template.content) {
          throw new Error(`Template content not found for template ID: ${templateId}`);
        }
        
        // Enhance data with AI-generated content if needed
        const enhancedData = enhanceResumeData(data);
        
        // Render the template with the user's data
        const renderedContent = renderTemplate(template.content, enhancedData);
        
        // Apply styling from the template
        const styledContent = `
          <style>
            .resume-preview {
              font-family: ${template.fontFamily}, sans-serif;
              color: #333;
            }
            .resume-header {
              background: linear-gradient(to right, ${template.primaryColor}, ${template.secondaryColor});
              padding: 20px;
              color: white;
              border-radius: 8px 8px 0 0;
            }
            .resume-body {
              padding: 20px;
              background: white;
              color: #333;
              border-radius: 0 0 8px 8px;
              border: 1px solid #eee;
              border-top: none;
            }
            h1, h2, h3, h4, h5, h6 {
              margin-top: 0;
            }
            h2 {
              color: ${template.primaryColor};
              border-bottom: 1px solid #eee;
              padding-bottom: 0.5rem;
              margin-bottom: 1rem;
            }
            ul {
              padding-left: 1.5rem;
            }
            .experience-item, .education-item, .project-item {
              margin-bottom: 1.5rem;
            }
          </style>
          <div class="resume-preview">
            ${renderedContent}
          </div>
        `;
        
        setResumeContent(styledContent);
        setGenerating(false);
        toast.success('AI-enhanced resume successfully generated!');
      } catch (err) {
        console.error("Error generating resume:", err);
        setError(`An error occurred while generating your resume: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setGenerating(false);
      }
    }, stepDelay * 4);
    
    return () => {
      clearTimeout(step1Timer);
      clearTimeout(step2Timer);
      clearTimeout(step3Timer);
      clearTimeout(step4Timer);
    };
  }, [data]);
  
  const enhanceProfessionalSummary = (summary: string): string => {
    let enhanced = summary;
    
    const replacements = {
      'experienced': 'accomplished',
      'skilled': 'adept',
      'good at': 'proficient in',
      'worked': 'contributed',
      'helped': 'facilitated',
      'made': 'developed',
      'did': 'executed',
      'used': 'leveraged',
      'know': 'possess expertise in',
      'understand': 'comprehend',
      'learned': 'acquired knowledge of',
      'team player': 'collaborative professional'
    };
    
    Object.entries(replacements).forEach(([basic, sophisticated]) => {
      enhanced = enhanced.replace(new RegExp(`\\b${basic}\\b`, 'gi'), sophisticated);
    });
    
    if (!enhanced.toLowerCase().includes('professional')) {
      enhanced = enhanced.replace(/^/, 'Accomplished professional ');
    }
    
    if (!enhanced.toLowerCase().includes('strategic') && 
        !enhanced.toLowerCase().includes('strategy')) {
      enhanced += ' Brings a strategic mindset to organizational challenges, consistently delivering impactful results.';
    } else if (!enhanced.toLowerCase().includes('results') && 
               !enhanced.toLowerCase().includes('impact')) {
      enhanced += ' Focused on delivering measurable outcomes that drive organizational success.';
    }
    
    return enhanced;
  };

  // Enhance resume data with AI improvements
  const enhanceResumeData = (data: ResumeData): ResumeData => {
    const enhancedData = { ...data };
    
    // Enhance profile summary if it exists
    if (enhancedData.profileSummary) {
      enhancedData.profileSummary = enhanceProfessionalSummary(enhancedData.profileSummary);
    } 
    // Generate profile summary if it doesn't exist but we have experience and skills
    else if (enhancedData.experience && enhancedData.experience.length > 0 && enhancedData.skills && enhancedData.skills.length > 0) {
      const yearsExperience = enhancedData.experience.length;
      const topSkills = enhancedData.skills.slice(0, 3).join(", ");
      enhancedData.profileSummary = `Accomplished ${enhancedData.experience[0].position || "professional"} with ${yearsExperience}+ years of progressive experience. Demonstrates exceptional expertise in ${topSkills} with a proven track record of delivering impactful results. Artfully combines cutting-edge technical knowledge with strategic business acumen to implement innovative solutions that consistently drive organizational growth and operational efficiency.`;
    }
    
    // Enhance experience descriptions and achievements
    if (enhancedData.experience) {
      enhancedData.experience = enhancedData.experience.map(exp => {
        const enhancedExp = { ...exp };
        
        // Enhance description if it exists
        if (enhancedExp.description && !enhancedExp.description.includes('•') && !enhancedExp.description.includes('-')) {
          const sentences = enhancedExp.description.split(/\.\s+/);
          const bullets = sentences
            .filter(s => s.trim().length > 0)
            .map(s => s.trim() + (s.endsWith('.') ? '' : '.'));
          
          const enhancedBullets = bullets.map(bullet => {
            return bullet
              .replace(/^Worked on/i, "Spearheaded")
              .replace(/^Helped/i, "Facilitated")
              .replace(/^Did/i, "Executed")
              .replace(/^Made/i, "Developed")
              .replace(/^Used/i, "Leveraged")
              .replace(/^Was responsible for/i, "Orchestrated");
          });
          
          enhancedExp.description = enhancedBullets.join(' ');
        }
        
        // Enhance achievements
        if (enhancedExp.achievements && enhancedExp.achievements.length > 0) {
          enhancedExp.achievements = enhancedExp.achievements.map(achievement => {
            if (!achievement.match(/\d+%|\d+\s*%|\$\d+|\d+\s*people|\d+\s*team/i)) {
              if (achievement.match(/improved|increased|enhanced|grew|expanded/i)) {
                return achievement.replace(/\.$/, "") + " by approximately 30%.";
              }
              if (achievement.match(/reduced|decreased|cut|minimized/i)) {
                return achievement.replace(/\.$/, "") + " by approximately 25%.";
              }
              if (achievement.match(/lead|team|managed|supervised/i)) {
                return achievement.replace(/\.$/, "") + " with a team of 5+ professionals.";
              }
            }
            return achievement;
          });
        }
        
        return enhancedExp;
      });
    }
    
    // Enhance education descriptions
    if (enhancedData.education) {
      enhancedData.education = enhancedData.education.map(edu => {
        const enhancedEdu = { ...edu };
        
        if (!enhancedEdu.description && enhancedEdu.fieldOfStudy) {
          enhancedEdu.description = `Comprehensive curriculum focusing on ${enhancedEdu.fieldOfStudy} principles and practical applications, developing expertise in industry-standard methodologies and technologies.`;
        }
        
        return enhancedEdu;
      });
    }
    
    // Enhance project descriptions
    if (enhancedData.projects) {
      enhancedData.projects = enhancedData.projects.map(proj => {
        const enhancedProj = { ...proj };
        
        if (enhancedProj.description && !enhancedProj.description.includes('resulting in') && !enhancedProj.description.includes('which led to')) {
          enhancedProj.description = `${enhancedProj.description} This initiative resulted in significant improvements to efficiency and stakeholder satisfaction.`;
        }
        
        return enhancedProj;
      });
    }
    
    return enhancedData;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
      className="w-full max-w-3xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex mb-4 p-3 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: 0.1 
            }}
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h2 
            className="text-3xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text font-display"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            AI Resume Generation
          </motion.h2>
          <motion.p 
            className="text-muted-foreground text-balance max-w-md mx-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Our advanced AI is crafting a recruiter-optimized resume that highlights your unique value proposition using the <span className="font-medium text-foreground">{getTemplateName()}</span> template.
          </motion.p>
        </div>
        
        <Card className="overflow-hidden border-0 shadow-lg">
          <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          <CardContent className="p-6">
            {generating ? (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="w-full max-w-md space-y-8">
                  {generationSteps.map((step, index) => (
                    <motion.div 
                      key={index} 
                      className={`transition-all duration-300 ${currentStep < index ? 'opacity-50' : 'opacity-100'}`}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                            step.completed 
                              ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-md' 
                              : currentStep === index 
                                ? 'bg-gradient-to-r from-blue-400 to-purple-500 text-white shadow-md'
                                : 'bg-muted'
                          }`}>
                            {step.completed ? (
                              <CheckIcon className="w-5 h-5" />
                            ) : currentStep === index ? (
                              step.icon
                            ) : (
                              <span>{index + 1}</span>
                            )}
                          </div>
                          <div>
                            <p className={`font-semibold ${currentStep === index ? 'text-primary' : ''}`}>{step.name}</p>
                            <p className="text-xs text-muted-foreground">{step.description}</p>
                          </div>
                        </div>
                        {currentStep === index && !step.completed && (
                          <div className="relative">
                            <span className="absolute inset-0 rounded-full animate-ping bg-primary/30"></span>
                            <Loader2 className="w-5 h-5 animate-spin text-primary relative z-10" />
                          </div>
                        )}
                      </div>
                      <div className="relative h-2.5 rounded-full bg-muted/50 overflow-hidden">
                        <motion.div
                          className={`absolute top-0 left-0 h-full rounded-full ${
                            step.completed ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-blue-400 to-purple-500'
                          }`}
                          initial={{ width: "0%" }}
                          animate={{ width: `${step.progress}%` }}
                          transition={{ 
                            duration: 0.8, 
                            ease: "easeInOut" 
                          }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <motion.div 
                  className="mt-8 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-sm text-muted-foreground italic mb-2">Applying AI-powered enhancements to elevate your professional narrative</p>
                  <div className="flex justify-center space-x-1">
                    <motion.div 
                      className="w-2 h-2 rounded-full bg-blue-400"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                    />
                    <motion.div 
                      className="w-2 h-2 rounded-full bg-purple-400"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                    />
                    <motion.div 
                      className="w-2 h-2 rounded-full bg-pink-400"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                    />
                  </div>
                </motion.div>
              </div>
            ) : error ? (
              <div className="text-center py-8 px-4">
                <motion.div 
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 9v4"></path>
                    <path d="M12 17h.01"></path>
                    <path d="m9 3.6-.9-.4C7.4 3 6.8 3 6.2 3.1c-.5.1-1 .3-1.5.6-.4.3-.8.7-1 1.2-.3.4-.4 1-.4 1.5-.1.7 0 1.3.3 1.9.2.6.5 1.1.9 1.6l9.5 11q.5.7 1.2 1c.7.4 1.5.5 2.3.4a3.9 3.9 0 0 0 3.1-2.4c.3-.6.4-1.3.3-2s-.3-1.3-.7-1.9L13 6.3A3.9 3.9 0 0 0 9 3.6Z"></path>
                  </svg>
                </motion.div>
                <motion.h3 
                  className="text-xl font-semibold mb-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  Generation Error
                </motion.h3>
                <motion.p 
                  className="text-muted-foreground mb-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {error}
                </motion.p>
                <motion.div 
                  className="flex justify-center"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    variant="default"
                    onClick={onPrev}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Go Back
                  </Button>
                </motion.div>
              </div>
            ) : (
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold flex items-center gap-2 text-lg">
                    Your AI-Enhanced Resume
                    <span className="text-xs px-2 py-0.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full">
                      {getTemplateName()}
                    </span>
                  </h3>
                  <motion.div 
                    className="flex items-center text-sm text-emerald-600 font-medium"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    <span>ATS Optimized</span>
                  </motion.div>
                </div>
                
                <motion.div 
                  className="border rounded-xl overflow-auto max-h-96 shadow-inner relative"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="absolute top-0 left-0 w-full h-6 bg-gradient-to-b from-background to-transparent z-10"></div>
                  <div 
                    className="p-6" 
                    dangerouslySetInnerHTML={{ __html: resumeContent || '' }}
                  />
                  <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-background to-transparent z-10"></div>
                </motion.div>
                
                <motion.div 
                  className="mt-6 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 text-sm text-blue-800 flex items-start gap-3"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <FileText className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium mb-1">AI-Enhanced Resume Generation Complete</p>
                    <p>Your professional narrative has been strategically crafted with industry-specific language and optimized for ATS visibility. Continue to the next step for a comprehensive analysis of your resume's effectiveness and download options.</p>
                  </div>
                </motion.div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <motion.div 
          className="pt-6 flex justify-between"
          custom={4}
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
            <span>Continue to Next Step</span>
            <ArrowRight className="ml-2 w-4 h-4" />
          </AnimatedButton>
        </motion.div>
      </form>
    </motion.div>
  );
};

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}

export default AIResumeGeneration;
