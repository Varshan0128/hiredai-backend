import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';
import { Plus, Trash2, GraduationCap, Briefcase, CalendarClock, FileEdit, ArrowRight, InfoIcon, ArrowLeft } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import AnimatedButton from './AnimatedButton';
import { toast } from "sonner";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ResumeData } from '@/pages/Builder';

interface EducationExperienceFormProps {
  onNext: () => void;
  onPrev: () => void;
  data: ResumeData;
  updateData: (data: Partial<ResumeData>) => void;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const EducationExperienceForm: React.FC<EducationExperienceFormProps> = ({ 
  onNext, 
  onPrev,
  data,
  updateData
}) => {
  const transformIncomingEducation = () => {
    if (!data.education || data.education.length === 0) {
      return [{
        id: generateId(),
        institution: '',
        degree: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        description: ''
      }];
    }
    
    return data.education.map(edu => ({
      id: generateId(),
      institution: edu.institution || '',
      degree: edu.degree || '',
      fieldOfStudy: edu.fieldOfStudy || '',
      startDate: edu.startDate || '',
      endDate: edu.endDate || '',
      description: edu.description || ''
    }));
  };
  
  const transformIncomingExperience = () => {
    if (!data.experience || data.experience.length === 0) {
      return [];
    }
    
    return data.experience.map(exp => ({
      id: generateId(),
      company: exp.company || '',
      position: exp.position || '',
      location: '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      description: exp.description || ''
    }));
  };
  
  const [education, setEducation] = useState<Education[]>(transformIncomingEducation());
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>(transformIncomingExperience());
  const [includeWorkExperience, setIncludeWorkExperience] = useState(data.experience && data.experience.length > 0);
  const [isExperienceOpen, setIsExperienceOpen] = useState(data.experience && data.experience.length > 0);
  const [showTips, setShowTips] = useState(false);

  const addEducation = () => {
    setEducation(prev => [
      ...prev,
      {
        id: generateId(),
        institution: '',
        degree: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        description: ''
      }
    ]);
    toast.success("New education entry added");
  };

  const removeEducation = (id: string) => {
    if (education.length <= 1) {
      toast.error("You must have at least one education entry");
      return;
    }
    setEducation(prev => prev.filter(edu => edu.id !== id));
    toast.success("Education entry removed");
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducation(prev => 
      prev.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    );
  };

  const toggleWorkExperience = () => {
    setIncludeWorkExperience(prev => !prev);
    if (!includeWorkExperience && workExperience.length === 0) {
      setWorkExperience([{
        id: generateId(),
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        description: ''
      }]);
      setIsExperienceOpen(true);
    }
  };

  const addWorkExperience = () => {
    setWorkExperience(prev => [
      ...prev,
      {
        id: generateId(),
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        description: ''
      }
    ]);
    toast.success("New work experience entry added");
  };

  const removeWorkExperience = (id: string) => {
    if (workExperience.length <= 1) {
      toast.error("You must have at least one work experience entry");
      return;
    }
    setWorkExperience(prev => prev.filter(work => work.id !== id));
    toast.success("Work experience entry removed");
  };

  const updateWorkExperience = (id: string, field: keyof WorkExperience, value: string) => {
    setWorkExperience(prev => 
      prev.map(work => 
        work.id === id ? { ...work, [field]: value } : work
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isEducationValid = education.every(edu => 
      edu.institution.trim() && edu.degree.trim() && edu.startDate
    );
    
    const isWorkExperienceValid = !includeWorkExperience || workExperience.every(work => 
      work.company.trim() && work.position.trim() && work.startDate
    );
    
    if (!isEducationValid || !isWorkExperienceValid) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const formattedEducation = education.map(edu => ({
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy,
      startDate: edu.startDate,
      endDate: edu.endDate,
      description: edu.description
    }));
    
    const formattedExperience = includeWorkExperience ? workExperience.map(work => ({
      company: work.company,
      position: work.position,
      startDate: work.startDate,
      endDate: work.endDate,
      description: work.description
    })) : [];
    
    updateData({
      education: formattedEducation,
      experience: formattedExperience
    });
    
    toast.success("Education and experience saved");
    onNext();
  };

  const inputVariants = {
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
      className="w-full mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-left"
          >
            <h2 className="text-2xl font-bold mb-2 text-foreground">
              Education & Experience
            </h2>
            <p className="text-muted-foreground text-balance max-w-lg">
              Add your educational background and professional experience to showcase your qualifications.
            </p>
          </motion.div>
          
          <Dialog open={showTips} onOpenChange={setShowTips}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1 bg-accent h-9 text-sm"
              >
                <InfoIcon className="w-4 h-4" /> Resume Tips
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Education & Experience Tips</DialogTitle>
                <DialogDescription>
                  Optimize your resume with these professional tips
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4 text-sm">
                <div className="p-3 bg-accent/50 rounded-lg">
                  <h3 className="font-medium mb-1">Education Section</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>List your highest degree first</li>
                    <li>Include relevant coursework and GPA if impressive</li>
                    <li>Mention academic achievements and honors</li>
                  </ul>
                </div>
                
                <div className="p-3 bg-accent/50 rounded-lg">
                  <h3 className="font-medium mb-1">Work Experience</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Use action verbs to begin each bullet point</li>
                    <li>Quantify achievements when possible (e.g., "Increased sales by 20%")</li>
                    <li>Focus on relevant experiences for the job you're applying to</li>
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <motion.div 
          className="space-y-4"
          custom={0}
          initial="hidden"
          animate="visible"
          variants={inputVariants}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              Education
            </h3>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addEducation}
              className="flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Education
            </Button>
          </div>

          {education.map((edu, index) => (
            <motion.div 
              key={edu.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 rounded-lg border border-border bg-card/50 space-y-3 relative"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeEducation(edu.id)}
                className="absolute right-2 top-2 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`institution-${edu.id}`} className="text-sm font-medium">
                    Institution Name*
                  </Label>
                  <Input
                    id={`institution-${edu.id}`}
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                    placeholder=""
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`degree-${edu.id}`} className="text-sm font-medium">
                    Degree*
                  </Label>
                  <Input
                    id={`degree-${edu.id}`}
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    placeholder=""
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`field-${edu.id}`} className="text-sm font-medium">
                  Field of Study
                </Label>
                <Input
                  id={`field-${edu.id}`}
                  value={edu.fieldOfStudy}
                  onChange={(e) => updateEducation(edu.id, 'fieldOfStudy', e.target.value)}
                  placeholder=""
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`edu-start-${edu.id}`} className="text-sm font-medium flex items-center gap-1">
                    <CalendarClock className="w-3 h-3" /> Start Date*
                  </Label>
                  <Input
                    id={`edu-start-${edu.id}`}
                    type="month"
                    value={edu.startDate}
                    onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`edu-end-${edu.id}`} className="text-sm font-medium flex items-center gap-1">
                    <CalendarClock className="w-3 h-3" /> End Date (or Expected)
                  </Label>
                  <Input
                    id={`edu-end-${edu.id}`}
                    type="month"
                    value={edu.endDate}
                    onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`edu-desc-${edu.id}`} className="text-sm font-medium flex items-center gap-1">
                  <FileEdit className="w-3 h-3" /> Description
                </Label>
                <Textarea
                  id={`edu-desc-${edu.id}`}
                  value={edu.description}
                  onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                  placeholder=""
                  className="min-h-[80px] resize-y"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={inputVariants}
          className="pt-4"
        >
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              id="include-work"
              checked={includeWorkExperience}
              onChange={toggleWorkExperience}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="include-work" className="text-base font-medium">
              Include Work Experience
            </Label>
          </div>
        </motion.div>

        <Collapsible 
          open={includeWorkExperience && isExperienceOpen} 
          onOpenChange={setIsExperienceOpen}
          disabled={!includeWorkExperience}
        >
          <CollapsibleTrigger asChild>
            <motion.div
              custom={2}
              initial="hidden"
              animate={includeWorkExperience ? "visible" : "hidden"}
              variants={inputVariants}
              className={cn(
                "cursor-pointer p-4 rounded-lg border bg-accent/30 text-left mb-2",
                !includeWorkExperience && "opacity-50 pointer-events-none"
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Work Experience {isExperienceOpen ? "(Click to collapse)" : "(Click to expand)"}
                </h3>
                {includeWorkExperience && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      addWorkExperience();
                    }}
                    className="flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add Experience
                  </Button>
                )}
              </div>
            </motion.div>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-4">
            {workExperience.map((work, index) => (
              <motion.div 
                key={work.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 rounded-lg border border-border bg-card/50 space-y-3 relative"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeWorkExperience(work.id)}
                  className="absolute right-2 top-2 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`company-${work.id}`} className="text-sm font-medium">
                      Company Name*
                    </Label>
                    <Input
                      id={`company-${work.id}`}
                      value={work.company}
                      onChange={(e) => updateWorkExperience(work.id, 'company', e.target.value)}
                      placeholder=""
                      required={includeWorkExperience}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`position-${work.id}`} className="text-sm font-medium">
                      Position*
                    </Label>
                    <Input
                      id={`position-${work.id}`}
                      value={work.position}
                      onChange={(e) => updateWorkExperience(work.id, 'position', e.target.value)}
                      placeholder=""
                      required={includeWorkExperience}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`location-${work.id}`} className="text-sm font-medium">
                    Location
                  </Label>
                  <Input
                    id={`location-${work.id}`}
                    value={work.location}
                    onChange={(e) => updateWorkExperience(work.id, 'location', e.target.value)}
                    placeholder=""
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`work-start-${work.id}`} className="text-sm font-medium flex items-center gap-1">
                      <CalendarClock className="w-3 h-3" /> Start Date*
                    </Label>
                    <Input
                      id={`work-start-${work.id}`}
                      type="month"
                      value={work.startDate}
                      onChange={(e) => updateWorkExperience(work.id, 'startDate', e.target.value)}
                      required={includeWorkExperience}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`work-end-${work.id}`} className="text-sm font-medium flex items-center gap-1">
                      <CalendarClock className="w-3 h-3" /> End Date (or Present)
                    </Label>
                    <Input
                      id={`work-end-${work.id}`}
                      type="month"
                      value={work.endDate}
                      onChange={(e) => updateWorkExperience(work.id, 'endDate', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`work-desc-${work.id}`} className="text-sm font-medium flex items-center gap-1">
                    <FileEdit className="w-3 h-3" /> Responsibilities & Achievements
                  </Label>
                  <Textarea
                    id={`work-desc-${work.id}`}
                    value={work.description}
                    onChange={(e) => updateWorkExperience(work.id, 'description', e.target.value)}
                    placeholder=""
                    className="min-h-[100px] resize-y"
                  />
                </div>
              </motion.div>
            ))}
          </CollapsibleContent>
        </Collapsible>
        
        <motion.div 
          className="pt-6 flex justify-between"
          custom={5}
          initial="hidden"
          animate="visible"
          variants={inputVariants}
        >
          <Button 
            type="button" 
            variant="outline" 
            onClick={onPrev}
            className="px-6"
          >
            Back
          </Button>
          <AnimatedButton 
            type="submit" 
            variant="default" 
            className="w-full sm:w-auto px-8"
          >
            <span>Continue to Next Step</span>
            <ArrowRight className="ml-2 w-4 h-4" />
          </AnimatedButton>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default EducationExperienceForm;
