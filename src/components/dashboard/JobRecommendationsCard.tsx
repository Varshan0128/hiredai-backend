import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, ArrowRight } from 'lucide-react';
import { useJobSearch } from '@/hooks/useJobSearch';
import { useResumeParser } from '@/hooks/useResumeParser';

interface JobRecommendationsCardProps {
  hasResume: boolean;
}

const JobRecommendationsCard: React.FC<JobRecommendationsCardProps> = ({ hasResume }) => {
  const { jobs, searchJobs } = useJobSearch();
  const { simulateResumeData } = useResumeParser();

  useEffect(() => {
    if (hasResume) {
      // Simulate resume data and search for relevant jobs
      const mockResumeData = simulateResumeData();
      searchJobs({
        location: mockResumeData.location,
        skills: mockResumeData.skills,
        jobTitle: mockResumeData.jobTitle
      });
    }
  }, [hasResume, searchJobs, simulateResumeData]);

  const displayJobs = jobs.slice(0, 3); // Show only first 3 jobs for this card

  if (!hasResume) {
    return null; // This card only shows when user has resume
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="modern-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-primary" />
            </div>
            Recommended Job Openings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {displayJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className="flex flex-col items-center p-4 rounded-lg border border-border hover:border-primary/20 transition-all duration-200 hover:shadow-md cursor-pointer"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-medium text-sm text-center mb-1">{job.company}</h4>
                <p className="text-xs text-muted-foreground text-center">{job.location}</p>
              </motion.div>
            ))}
          </div>
          <Link to="/jobs">
            <Button className="w-full rounded-xl">
              View All Opportunities
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default JobRecommendationsCard;