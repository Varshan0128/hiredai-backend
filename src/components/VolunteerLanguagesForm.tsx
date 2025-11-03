
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, MinusCircle, ArrowLeft, ArrowRight, GraduationCap, Languages } from 'lucide-react';
import AnimatedButton from './AnimatedButton';

interface VolunteerLanguagesFormProps {
  onNext: () => void;
  onPrev: () => void;
}

const VolunteerLanguagesForm: React.FC<VolunteerLanguagesFormProps> = ({ onNext, onPrev }) => {
  const [volunteerExperiences, setVolunteerExperiences] = useState([
    { organization: '', role: '', duration: '', description: '' }
  ]);
  
  const [languages, setLanguages] = useState([
    { language: '', proficiency: 'Intermediate' }
  ]);
  
  const addVolunteerExperience = () => {
    setVolunteerExperiences([
      ...volunteerExperiences, 
      { organization: '', role: '', duration: '', description: '' }
    ]);
  };
  
  const removeVolunteerExperience = (index: number) => {
    const newExperiences = [...volunteerExperiences];
    newExperiences.splice(index, 1);
    setVolunteerExperiences(newExperiences);
  };
  
  const handleVolunteerChange = (index: number, field: string, value: string) => {
    const newExperiences = [...volunteerExperiences];
    newExperiences[index] = { ...newExperiences[index], [field]: value };
    setVolunteerExperiences(newExperiences);
  };
  
  const addLanguage = () => {
    setLanguages([...languages, { language: '', proficiency: 'Intermediate' }]);
  };
  
  const removeLanguage = (index: number) => {
    const newLanguages = [...languages];
    newLanguages.splice(index, 1);
    setLanguages(newLanguages);
  };
  
  const handleLanguageChange = (index: number, field: string, value: string) => {
    const newLanguages = [...languages];
    newLanguages[index] = { ...newLanguages[index], [field]: value };
    setLanguages(newLanguages);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };
  
  // Define the motion variants here
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
            Volunteer Work & Languages
          </motion.h2>
          <motion.p 
            className="text-muted-foreground text-balance max-w-md mx-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Add your volunteer experiences and language proficiencies to enhance your resume.
          </motion.p>
        </div>
        
        {/* Volunteer Experience Section */}
        <motion.div
          className="space-y-4"
          custom={0}
          initial="hidden"
          animate="visible"
          variants={motionVariants}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              Volunteer Experience
            </h3>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addVolunteerExperience}
              className="flex items-center gap-1"
            >
              <PlusCircle className="w-4 h-4" /> Add More
            </Button>
          </div>
          
          {volunteerExperiences.map((experience, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-4 border rounded-lg space-y-3 relative"
            >
              {volunteerExperiences.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeVolunteerExperience(index)}
                  className="absolute top-2 right-2 text-destructive hover:text-destructive/80 p-1 h-auto"
                >
                  <MinusCircle className="w-4 h-4" />
                </Button>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`org-${index}`}>Organization</Label>
                  <Input
                    id={`org-${index}`}
                    value={experience.organization}
                    onChange={(e) => handleVolunteerChange(index, 'organization', e.target.value)}
                    placeholder="Red Cross"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`role-${index}`}>Role</Label>
                  <Input
                    id={`role-${index}`}
                    value={experience.role}
                    onChange={(e) => handleVolunteerChange(index, 'role', e.target.value)}
                    placeholder="Volunteer Coordinator"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`duration-${index}`}>Duration</Label>
                <Input
                  id={`duration-${index}`}
                  value={experience.duration}
                  onChange={(e) => handleVolunteerChange(index, 'duration', e.target.value)}
                  placeholder="Jan 2022 - Present"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`desc-${index}`}>Description</Label>
                <Textarea
                  id={`desc-${index}`}
                  value={experience.description}
                  onChange={(e) => handleVolunteerChange(index, 'description', e.target.value)}
                  placeholder="Describe your responsibilities and achievements..."
                  rows={3}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Languages Section */}
        <motion.div
          className="space-y-4 pt-4"
          custom={1}
          initial="hidden"
          animate="visible"
          variants={motionVariants}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Languages className="w-5 h-5 text-primary" />
              Languages
            </h3>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addLanguage}
              className="flex items-center gap-1"
            >
              <PlusCircle className="w-4 h-4" /> Add More
            </Button>
          </div>
          
          {languages.map((lang, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-4 border rounded-lg space-y-3 relative"
            >
              {languages.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeLanguage(index)}
                  className="absolute top-2 right-2 text-destructive hover:text-destructive/80 p-1 h-auto"
                >
                  <MinusCircle className="w-4 h-4" />
                </Button>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`lang-${index}`}>Language</Label>
                  <Input
                    id={`lang-${index}`}
                    value={lang.language}
                    onChange={(e) => handleLanguageChange(index, 'language', e.target.value)}
                    placeholder="English"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`prof-${index}`}>Proficiency</Label>
                  <Select 
                    value={lang.proficiency} 
                    onValueChange={(value) => handleLanguageChange(index, 'proficiency', value)}
                  >
                    <SelectTrigger id={`prof-${index}`}>
                      <SelectValue placeholder="Select proficiency level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                      <SelectItem value="Fluent">Fluent</SelectItem>
                      <SelectItem value="Native">Native</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="pt-4 flex justify-between"
          custom={2}
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

export default VolunteerLanguagesForm;
