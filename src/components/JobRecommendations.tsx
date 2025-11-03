import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, BriefcaseIcon, MapPin, DollarSign, AlertCircle, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AnimatedButton from './AnimatedButton';
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { ResumeData } from '@/pages/Builder';
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface JobRecommendationsProps {
  onNext: () => void;
  onPrev: () => void;
  data: ResumeData;
}

interface JobMatch {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  requiredSkills: string[];
  matchPercentage: number;
  applyUrl: string;
  logo?: string;
}

const JobRecommendations: React.FC<JobRecommendationsProps> = ({ 
  onNext, 
  onPrev,
  data 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showLocationForm, setShowLocationForm] = useState(true);
  const [jobSearchLocation, setJobSearchLocation] = useState(data.location || '');
  const [jobTitle, setJobTitle] = useState('');
  
  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobSearchLocation.trim()) {
      toast.error("Please enter a location to search for jobs");
      return;
    }
    setShowLocationForm(false);
    fetchRealJobs();
  };
  
  const fetchRealJobs = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching real jobs with data:', { 
        location: jobSearchLocation, 
        skills: data.skills?.slice(0, 5),
        experience: data.experience?.length,
        jobTitle: jobTitle || inferJobTitle(data)
      });
      
      const { data: jobsData, error: jobsError } = await supabase.functions.invoke('fetch-jobs', {
        body: {
          location: jobSearchLocation,
          skills: data.skills || [],
          experience: data.experience || [],
          jobTitle: jobTitle || inferJobTitle(data)
        }
      });
      
      if (jobsError) {
        console.error('Edge function error:', jobsError);
        throw new Error(jobsError.message || 'Failed to fetch jobs');
      }
      
      console.log('Jobs data received:', jobsData);
      
      if (jobsData?.jobs && jobsData.jobs.length > 0) {
        setJobMatches(jobsData.jobs);
        toast.success(`Found ${jobsData.jobs.length} real job opportunities in ${jobSearchLocation}!`);
      } else {
        // Fallback to generated jobs if no real jobs found
        console.log('No real jobs found, using fallback');
        const fallbackJobs = generateFallbackJobs(data, jobSearchLocation);
        setJobMatches(fallbackJobs);
        toast.info("Using sample job recommendations. The job search API may be experiencing issues.");
      }
      
    } catch (error) {
      console.error('Error fetching real jobs:', error);
      setError(error.message);
      
      // Fallback to generated jobs on error
      const fallbackJobs = generateFallbackJobs(data, jobSearchLocation);
      setJobMatches(fallbackJobs);
      toast.error("Couldn't fetch live jobs. Showing sample recommendations.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const inferJobTitle = (data: ResumeData): string | undefined => {
    if (data.experience && data.experience.length > 0) {
      return data.experience[0].position;
    }
    return undefined;
  };
  
  const handleApply = (job: JobMatch) => {
    window.open(job.applyUrl, '_blank');
    toast.success(`Application started for ${job.title} at ${job.company}`);
  };

  const handleBackToLocationForm = () => {
    setShowLocationForm(true);
    setJobMatches([]);
    setError(null);
  };
  
  if (showLocationForm) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full max-w-2xl mx-auto"
      >
        <div className="space-y-6">
          <div className="text-center mb-8">
            <motion.h2 
              className="text-2xl font-bold mb-2 text-foreground"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Job Search Preferences
            </motion.h2>
            <motion.p 
              className="text-muted-foreground text-balance max-w-md mx-auto"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Tell us where you'd like to work and what type of role you're looking for.
            </motion.p>
          </div>

          <Card className="p-6">
            <form onSubmit={handleLocationSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jobSearchLocation" className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  Preferred Job Location
                </Label>
                <Input
                  id="jobSearchLocation"
                  value={jobSearchLocation}
                  onChange={(e) => setJobSearchLocation(e.target.value)}
                  placeholder="e.g., New York, NY or Remote"
                  className="h-12"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Enter a city, state, or "Remote" for remote opportunities
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobTitle" className="flex items-center gap-2 text-sm font-medium">
                  <BriefcaseIcon className="w-4 h-4 text-muted-foreground" />
                  Job Title (Optional)
                </Label>
                <Input
                  id="jobTitle"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g., Software Engineer, Product Manager"
                  className="h-12"
                />
                <p className="text-xs text-muted-foreground">
                  Leave blank to search based on your experience and skills
                </p>
              </div>

              <div className="pt-4 flex justify-between">
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
                  className="flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Find Jobs
                </AnimatedButton>
              </div>
            </form>
          </Card>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="space-y-6">
        <div className="text-center mb-8">
          <motion.h2 
            className="text-2xl font-bold mb-2 text-foreground"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Job Recommendations
          </motion.h2>
          <motion.p 
            className="text-muted-foreground text-balance max-w-md mx-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Based on your skills and experience, we've found these job opportunities in {jobSearchLocation}.
          </motion.p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBackToLocationForm}
            className="mt-2"
          >
            Change Location/Preferences
          </Button>
        </div>

        {error && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error} - Showing sample recommendations instead.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            {error ? (
              <>
                <AlertCircle className="w-5 h-5 text-orange-500" />
                Sample Job Opportunities
              </>
            ) : (
              <>
                <BriefcaseIcon className="w-5 h-5 text-green-600" />
                Live Job Opportunities
              </>
            )}
          </h3>
          
          {isLoading ? (
            <div className="py-12 flex justify-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
                <p className="text-muted-foreground">Finding the perfect job matches in {jobSearchLocation}...</p>
              </div>
            </div>
          ) : (
            <>
              {jobMatches.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden border-muted hover:border-primary/50 transition-colors">
                    <CardContent className="p-0">
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <div className="space-y-1">
                            <h4 className="text-lg font-semibold">{job.title}</h4>
                            <div className="flex items-center text-muted-foreground text-sm">
                              <BriefcaseIcon className="w-4 h-4 mr-1" />
                              {job.company}
                            </div>
                            <div className="flex items-center text-muted-foreground text-sm">
                              <MapPin className="w-4 h-4 mr-1" />
                              {job.location}
                            </div>
                            <div className="flex items-center text-muted-foreground text-sm">
                              <DollarSign className="w-4 h-4 mr-1" />
                              {job.salary}
                            </div>
                          </div>
                          
                          <div className="bg-primary/10 px-3 py-1 rounded-full">
                            <span className="text-primary font-semibold">{job.matchPercentage}% Match</span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {job.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.requiredSkills.map((skill, i) => (
                            <span 
                              key={i} 
                              className={`px-2 py-1 rounded-full text-xs ${
                                data.skills?.includes(skill) 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                        
                        <Button 
                          onClick={() => handleApply(job)}
                          className="w-full bg-primary text-white"
                        >
                          Apply Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </>
          )}
        </div>
        
        <div className="pt-4 flex justify-between">
          <Button 
            type="button" 
            onClick={handleBackToLocationForm}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Change Search
          </Button>
          
          <AnimatedButton 
            type="button"
            onClick={onNext}
            variant="default" 
            className="w-auto"
          >
            <span>Continue to Download</span>
            <ArrowRight className="ml-2 w-4 h-4" />
          </AnimatedButton>
        </div>
      </div>
    </motion.div>
  );
};

function generateFallbackJobs(data: ResumeData, searchLocation: string): JobMatch[] {
  const userSkills = data.skills || [];
  const userExperience = data.experience || [];
  
  const jobDatabase: JobMatch[] = [
    {
      id: "job1",
      title: "Senior Software Engineer",
      company: "Tech Innovations Inc.",
      location: searchLocation,
      salary: "$120,000 - $150,000",
      description: "We are looking for a Senior Software Engineer to develop high-quality software solutions. You will be working with a team of experienced developers to build innovative products.",
      requiredSkills: ["JavaScript", "React", "TypeScript", "Node.js", "AWS"],
      matchPercentage: 0,
      applyUrl: "https://example.com/apply/tech-innovations"
    },
    {
      id: "job2",
      title: "Product Manager",
      company: "Digital Solutions Group",
      location: searchLocation,
      salary: "$110,000 - $140,000",
      description: "As a Product Manager, you will be responsible for the product planning and execution throughout the Product Lifecycle, including gathering and prioritizing requirements.",
      requiredSkills: ["Product Management", "Agile", "JIRA", "User Research", "Roadmapping"],
      matchPercentage: 0,
      applyUrl: "https://example.com/apply/digital-solutions"
    },
    {
      id: "job3",
      title: "UX/UI Designer",
      company: "Creative Designs Co.",
      location: searchLocation,
      salary: "$95,000 - $120,000",
      description: "We're seeking a talented UX/UI Designer to create amazing user experiences. The ideal candidate should have an eye for clean and artful design, possess superior UI skills.",
      requiredSkills: ["Figma", "Adobe XD", "User Research", "Prototyping", "Visual Design"],
      matchPercentage: 0,
      applyUrl: "https://example.com/apply/creative-designs"
    }
  ];
  
  return jobDatabase.map(job => {
    let matchScore = 0;
    
    const skillsMatched = job.requiredSkills.filter(skill => 
      userSkills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );
    
    const skillsMatchPercentage = (skillsMatched.length / job.requiredSkills.length) * 100 * 0.6;
    
    let experienceMatchPercentage = 0;
    if (userExperience.length > 0) {
      const relevantExperience = userExperience.filter(exp => 
        job.title.toLowerCase().includes(exp.position.toLowerCase()) || 
        exp.position.toLowerCase().includes(job.title.toLowerCase()) ||
        job.requiredSkills.some(skill => 
          exp.description?.toLowerCase().includes(skill.toLowerCase())
        )
      );
      
      experienceMatchPercentage = (relevantExperience.length / userExperience.length) * 100 * 0.4;
    }
    
    matchScore = Math.min(99, Math.round(skillsMatchPercentage + experienceMatchPercentage));
    matchScore = Math.max(matchScore, 65 + Math.floor(Math.random() * 20)); 
    
    return {
      ...job,
      matchPercentage: matchScore
    };
  }).sort((a, b) => b.matchPercentage - a.matchPercentage);
}

export default JobRecommendations;
