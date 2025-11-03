
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, ArrowRight, MapPin, Clock } from 'lucide-react';
import { useJobSearch } from '@/hooks/useJobSearch';
import { useResumeParser } from '@/hooks/useResumeParser';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  logo: string;
  color: string;
}

interface RecommendedJobsCardProps {
  hasResume: boolean;
}

const RecommendedJobsCard: React.FC<RecommendedJobsCardProps> = ({ hasResume }) => {
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

  const displayJobs = jobs.slice(0, 4); // Show only first 4 jobs

  if (!hasResume) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-card to-card/80 border-border/50 h-full hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-primary">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-primary" />
              </div>
              Recommended Jobs
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Upload your resume to see personalized job recommendations
            </p>
            <Link to="/builder">
              <Button className="rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-200 hover:shadow-md hover:shadow-accent/30">
                Upload Resume
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-card to-card/80 border-border/50 h-full hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-primary">
            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-primary" />
            </div>
            Recommended Jobs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {displayJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-lg">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{job.title}</h4>
                  <p className="text-xs text-muted-foreground">{job.company}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <MapPin className="w-3 h-3" />
                    <span>{job.location}</span>
                    <Clock className="w-3 h-3 ml-1" />
                    <span>Full-time</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
            <Link to="/jobs">
            <Button className="w-full rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-200 hover:shadow-md hover:shadow-accent/30">
              View All Jobs
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecommendedJobsCard;
