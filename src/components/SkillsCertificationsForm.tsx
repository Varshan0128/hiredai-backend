import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Award, Cpu, ArrowLeft, ArrowRight, Edit, Check, Gauge } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { ResumeData } from '@/pages/Builder';
import AnimatedButton from '@/components/AnimatedButton';
import SkillRating from '@/components/SkillRating';
import AISkillScoreGenerator from '@/components/AISkillScoreGenerator';

interface SkillsCertificationsFormProps {
  onNext: () => void;
  onPrev: () => void;
  data: ResumeData;
  updateData: (data: Partial<ResumeData>) => void;
}

const SkillsCertificationsForm: React.FC<SkillsCertificationsFormProps> = ({ 
  onNext, 
  onPrev,
  data,
  updateData
}) => {
  const [skills, setSkills] = useState<string[]>(data.skills || []);
  const [skillLevel, setSkillLevel] = useState<Record<string, number>>(data.skillLevel || {});
  const [newSkill, setNewSkill] = useState('');
  const [editingSkillIndex, setEditingSkillIndex] = useState<number | null>(null);
  const [editingSkillValue, setEditingSkillValue] = useState('');
  const [certifications, setCertifications] = useState<{ name: string; issuer: string; date: string; }[]>(
    data.certifications || []
  );
  const [newCertification, setNewCertification] = useState({ name: '', issuer: '', date: '' });
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [isAddingCertification, setIsAddingCertification] = useState(false);
  const [showSkillRatings, setShowSkillRatings] = useState(Object.keys(data.skillLevel || {}).length > 0);
  
  const handleAddSkill = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) {
      e.preventDefault(); // Prevent form submission on Enter key
    }
    
    if (isAddingSkill || !newSkill.trim()) {
      if (!newSkill.trim()) {
        toast.error('Please enter a skill before adding');
      }
      return;
    }
    
    setIsAddingSkill(true);
    
    // Use a functional update to ensure we're working with the latest state
    setSkills(currentSkills => {
      const updatedSkills = [...currentSkills, newSkill.trim()];
      
      // Update parent state
      updateData({ skills: updatedSkills });
      return updatedSkills;
    });
    
    setNewSkill('');
    toast.success('Skill added');
    
    // Reset adding state after a short delay
    setTimeout(() => {
      setIsAddingSkill(false);
    }, 300);
  };
  
  const handleEditSkill = (index: number) => {
    setEditingSkillIndex(index);
    setEditingSkillValue(skills[index]);
  };
  
  const handleSaveEditedSkill = (index: number) => {
    if (editingSkillValue.trim()) {
      const updatedSkills = [...skills];
      const oldSkill = updatedSkills[index];
      updatedSkills[index] = editingSkillValue.trim();
      setSkills(updatedSkills);
      
      // Update skill level if the skill name changed
      const updatedSkillLevel = { ...skillLevel };
      if (skillLevel[oldSkill]) {
        updatedSkillLevel[editingSkillValue.trim()] = skillLevel[oldSkill];
        delete updatedSkillLevel[oldSkill];
        setSkillLevel(updatedSkillLevel);
      }
      
      // Update parent state immediately
      updateData({ 
        skills: updatedSkills,
        skillLevel: updatedSkillLevel
      });
      
      setEditingSkillIndex(null);
      setEditingSkillValue('');
      
      toast.success('Skill updated');
    } else {
      toast.error('Skill cannot be empty');
    }
  };
  
  const handleRemoveSkill = (index: number) => {
    const skillToRemove = skills[index];
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
    
    // Also remove the skill level
    const updatedSkillLevel = { ...skillLevel };
    delete updatedSkillLevel[skillToRemove];
    setSkillLevel(updatedSkillLevel);
    
    // Update parent state immediately
    updateData({ 
      skills: updatedSkills,
      skillLevel: updatedSkillLevel
    });
    
    toast('Skill removed');
    
    // If currently editing this skill, reset editing state
    if (editingSkillIndex === index) {
      setEditingSkillIndex(null);
      setEditingSkillValue('');
    }
  };
  
  const handleSkillScoreChange = (skill: string, score: number) => {
    const updatedSkillLevel = { ...skillLevel, [skill]: score };
    setSkillLevel(updatedSkillLevel);
    updateData({ skillLevel: updatedSkillLevel });
  };
  
  const handleAIGenerateScores = (generatedScores: Record<string, number>) => {
    setSkillLevel(generatedScores);
    updateData({ skillLevel: generatedScores });
    setShowSkillRatings(true);
  };
  
  const handleAddCertification = () => {
    console.log('handleAddCertification called', { newCertification, isAddingCertification });
    
    if (isAddingCertification) {
      console.log('Already adding certification, returning early');
      return;
    }

    // Check if at least name and issuer are provided
    if (!newCertification.name.trim() || !newCertification.issuer.trim()) {
      toast.error('Certification name and issuer are required');
      console.log('Validation failed - missing name or issuer');
      return;
    }
    
    setIsAddingCertification(true);
    console.log('Setting isAddingCertification to true');
    
    // Create the new certification object
    const certToAdd = {
      name: newCertification.name.trim(),
      issuer: newCertification.issuer.trim(),
      date: newCertification.date || ''
    };
    
    console.log('Adding certification:', certToAdd);
    
    // Update state using functional update
    setCertifications(currentCerts => {
      const updatedCertifications = [...currentCerts, certToAdd];
      console.log('Updated certifications:', updatedCertifications);
      
      // Update parent state immediately
      updateData({ certifications: updatedCertifications });
      return updatedCertifications;
    });
    
    // Reset form
    setNewCertification({ name: '', issuer: '', date: '' });
    toast.success('Certification added successfully');
    
    // Reset adding state after a short delay
    setTimeout(() => {
      setIsAddingCertification(false);
      console.log('Reset isAddingCertification to false');
    }, 300);
  };
  
  const handleRemoveCertification = (index: number) => {
    const updatedCertifications = certifications.filter((_, i) => i !== index);
    setCertifications(updatedCertifications);
    
    // Update parent state immediately
    updateData({ certifications: updatedCertifications });
    
    toast('Certification removed');
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final update before proceeding to next step
    updateData({
      skills,
      skillLevel,
      certifications
    });
    
    toast.success("Skills and certifications saved");
    onNext();
  };
  
  // Always sync local state with parent data when it changes
  useEffect(() => {
    if (data.skills) setSkills(data.skills);
    if (data.skillLevel) setSkillLevel(data.skillLevel);
    if (data.certifications) setCertifications(data.certifications);
  }, [data.skills, data.skillLevel, data.certifications]);
  
  // This ensures data gets updated even if the component unmounts without submission
  useEffect(() => {
    return () => {
      updateData({
        skills,
        skillLevel,
        certifications
      });
    };
  }, [skills, skillLevel, certifications, updateData]);
  
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
            Skills & Certifications
          </motion.h2>
          <motion.p 
            className="text-muted-foreground text-balance max-w-md mx-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Add your skills and professional certifications to enhance your resume.
          </motion.p>
        </div>
        
        {/* Skills Section */}
        <motion.div 
          className="space-y-4"
          custom={0}
          initial="hidden"
          animate="visible"
          variants={inputVariants}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-medium">Skills</h3>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowSkillRatings(!showSkillRatings)}
                className="text-xs h-8 gap-1"
              >
                <Gauge className="w-4 h-4" />
                {showSkillRatings ? 'Hide Ratings' : 'Show Ratings'}
              </Button>
            </div>
          </div>
          
          {/* AI Score Generator */}
          {skills.length > 0 && (
            <AISkillScoreGenerator
              skills={skills}
              existingScores={skillLevel}
              onGenerate={handleAIGenerateScores}
            />
          )}
          
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill (e.g., JavaScript, Project Management)"
                className="h-12"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill(e);
                  }
                }}
                disabled={isAddingSkill}
              />
            </div>
            <Button 
              type="button" 
              onClick={handleAddSkill}
              variant="outline"
              className="flex-shrink-0"
              disabled={isAddingSkill || !newSkill.trim()}
            >
              {isAddingSkill ? (
                <span className="flex items-center gap-1">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding
                </span>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-1" /> Add
                </>
              )}
            </Button>
          </div>
          
          <AnimatePresence>
            <div className="flex flex-wrap gap-3 pt-3 min-h-[40px]">
              {skills.map((skill, index) => (
                <motion.div 
                  key={`${skill}-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  layout
                  className="bg-primary/5 border border-primary/20 rounded-lg p-1 group"
                >
                  {editingSkillIndex === index ? (
                    <div className="flex items-center gap-1">
                      <Input
                        value={editingSkillValue}
                        onChange={(e) => setEditingSkillValue(e.target.value)}
                        className="h-8 min-w-[120px] text-sm"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSaveEditedSkill(index);
                          } else if (e.key === 'Escape') {
                            setEditingSkillIndex(null);
                          }
                        }}
                      />
                      <Button 
                        type="button" 
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => handleSaveEditedSkill(index)}
                      >
                        <Check className="w-4 h-4 text-green-600" />
                      </Button>
                      <Button 
                        type="button" 
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => setEditingSkillIndex(null)}
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1 px-2 py-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-sm">{skill}</span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center ml-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleEditSkill(index)}
                          >
                            <Edit className="w-3 h-3 text-primary" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleRemoveSkill(index)}
                          >
                            <X className="w-3 h-3 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Skill Rating */}
                      {showSkillRatings && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="mt-0.5 cursor-pointer" onClick={() => {
                                const currentScore = skillLevel[skill] || 3;
                                const newScore = currentScore < 5 ? currentScore + 0.5 : 1;
                                handleSkillScoreChange(skill, newScore);
                              }}>
                                <SkillRating 
                                  score={skillLevel[skill] || 3} 
                                  size="sm" 
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Click to adjust rating</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
              {skills.length === 0 && (
                <p className="text-muted-foreground text-sm italic">No skills added yet</p>
              )}
            </div>
          </AnimatePresence>
        </motion.div>
        
        {/* Certifications Section */}
        <motion.div 
          className="space-y-4"
          custom={1}
          initial="hidden"
          animate="visible"
          variants={inputVariants}
        >
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-medium">Certifications</h3>
          </div>
          
          <Card className="border border-input">
            <CardContent className="pt-6 space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cert-name">Certification Name</Label>
                  <Input
                    id="cert-name"
                    value={newCertification.name}
                    onChange={(e) => setNewCertification({...newCertification, name: e.target.value})}
                    placeholder="e.g., AWS Certified Solutions Architect"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cert-issuer">Issuing Organization</Label>
                    <Input
                      id="cert-issuer"
                      value={newCertification.issuer}
                      onChange={(e) => setNewCertification({...newCertification, issuer: e.target.value})}
                      placeholder="e.g., Amazon Web Services"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cert-date">Date Issued</Label>
                    <Input
                      id="cert-date"
                      type="month"
                      value={newCertification.date}
                      onChange={(e) => setNewCertification({...newCertification, date: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    onClick={handleAddCertification}
                    className="flex items-center gap-1"
                    disabled={isAddingCertification || !newCertification.name.trim() || !newCertification.issuer.trim()}
                  >
                    {isAddingCertification ? (
                      <span className="flex items-center gap-1">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Adding...
                      </span>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" /> Add Certification
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Certifications List */}
          <AnimatePresence>
            <div className="space-y-3">
              {certifications.map((cert, index) => (
                <motion.div
                  key={`${cert.name}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-primary/5 border-primary/10">
                    <Collapsible className="w-full">
                      <CardContent className="py-4 px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Award className="w-5 h-5 text-primary" />
                            <div>
                              <CollapsibleTrigger className="text-left">
                                <h4 className="font-medium">{cert.name}</h4>
                              </CollapsibleTrigger>
                              <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                            </div>
                          </div>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveCertification(index)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <CollapsibleContent>
                          <div className="mt-2 pt-2 border-t text-sm grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-muted-foreground">Date: </span>
                              <span>{cert.date ? new Date(cert.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'N/A'}</span>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </CardContent>
                    </Collapsible>
                  </Card>
                </motion.div>
              ))}
              {certifications.length === 0 && (
                <p className="text-muted-foreground text-sm italic text-center py-2">No certifications added yet</p>
              )}
            </div>
          </AnimatePresence>
        </motion.div>
        
        {/* Navigation Buttons */}
        <motion.div 
          className="pt-4 flex justify-between"
          custom={5}
          initial="hidden"
          animate="visible"
          variants={inputVariants}
        >
          <Button 
            type="button" 
            variant="outline"
            onClick={onPrev}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          
          <AnimatedButton 
            type="submit"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
            withArrow
          >
            Continue
          </AnimatedButton>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default SkillsCertificationsForm;
