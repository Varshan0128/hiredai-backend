
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Globe, Linkedin, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AnimatedButton from './AnimatedButton';
import AISummaryButton from './AISummaryButton';
import { toast } from "sonner";
import { ResumeData } from '@/pages/Builder';

interface PersonalInfoFormProps {
  onNext: () => void;
  data: ResumeData;
  updateData: (data: Partial<ResumeData>) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ onNext, data, updateData }) => {
  const [formData, setFormData] = useState({
    fullName: data.fullName || '',
    email: data.email || '',
    phone: data.phone || '',
    location: data.location || '',
    linkedIn: data.linkedIn || '',
    website: data.website || '',
    profileSummary: data.profileSummary || ''
  });

  useEffect(() => {
    updateData(formData);
  }, [formData, updateData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAISummaryGenerated = (summary: string) => {
    setFormData(prev => ({
      ...prev,
      profileSummary: summary
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    
    if (!formData.email.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    toast.success("Personal information saved successfully!");
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
            Personal Information
          </motion.h2>
          <motion.p 
            className="text-muted-foreground text-balance max-w-md mx-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Let's start with your basic information. This will appear at the top of your resume.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            className="space-y-2"
            custom={0}
            initial="hidden"
            animate="visible"
            variants={motionVariants}
          >
            <Label htmlFor="fullName" className="flex items-center gap-2 text-sm font-medium">
              <User className="w-4 h-4 text-muted-foreground" />
              Full Name *
            </Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="John Doe"
              className="h-12"
              required
            />
          </motion.div>

          <motion.div
            className="space-y-2"
            custom={1}
            initial="hidden"
            animate="visible"
            variants={motionVariants}
          >
            <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
              <Mail className="w-4 h-4 text-muted-foreground" />
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="john.doe@example.com"
              className="h-12"
              required
            />
          </motion.div>

          <motion.div
            className="space-y-2"
            custom={2}
            initial="hidden"
            animate="visible"
            variants={motionVariants}
          >
            <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium">
              <Phone className="w-4 h-4 text-muted-foreground" />
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="h-12"
            />
          </motion.div>

          <motion.div
            className="space-y-2"
            custom={3}
            initial="hidden"
            animate="visible"
            variants={motionVariants}
          >
            <Label htmlFor="location" className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              Location
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="San Francisco, CA"
              className="h-12"
            />
          </motion.div>

          <motion.div
            className="space-y-2"
            custom={4}
            initial="hidden"
            animate="visible"
            variants={motionVariants}
          >
            <Label htmlFor="linkedIn" className="flex items-center gap-2 text-sm font-medium">
              <Linkedin className="w-4 h-4 text-muted-foreground" />
              LinkedIn Profile
            </Label>
            <Input
              id="linkedIn"
              value={formData.linkedIn}
              onChange={(e) => handleInputChange('linkedIn', e.target.value)}
              placeholder="linkedin.com/in/johndoe"
              className="h-12"
            />
          </motion.div>

          <motion.div
            className="space-y-2"
            custom={5}
            initial="hidden"
            animate="visible"
            variants={motionVariants}
          >
            <Label htmlFor="website" className="flex items-center gap-2 text-sm font-medium">
              <Globe className="w-4 h-4 text-muted-foreground" />
              Website/Portfolio
            </Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="www.johndoe.com"
              className="h-12"
            />
          </motion.div>
        </div>

        <motion.div
          className="space-y-2"
          custom={6}
          initial="hidden"
          animate="visible"
          variants={motionVariants}
        >
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="profileSummary" className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="w-4 h-4 text-muted-foreground" />
              Professional Summary
            </Label>
            <AISummaryButton
              resumeData={data}
              onSummaryGenerated={handleAISummaryGenerated}
              className="ml-2"
            />
          </div>
          <Textarea
            id="profileSummary"
            value={formData.profileSummary}
            onChange={(e) => handleInputChange('profileSummary', e.target.value)}
            placeholder="Write a brief professional summary that highlights your key skills, experience, and career objectives. You can also use the AI generator to create one automatically based on your resume data."
            rows={4}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            This will appear at the top of your resume. Make it compelling and relevant to your target role.
          </p>
        </motion.div>

        <motion.div 
          className="pt-4 flex justify-end"
          custom={7}
          initial="hidden"
          animate="visible"
          variants={motionVariants}
        >
          <AnimatedButton 
            type="submit" 
            variant="default" 
            className="w-auto"
          >
            <span>Continue to Experience</span>
            <ArrowRight className="ml-2 w-4 h-4" />
          </AnimatedButton>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default PersonalInfoForm;
