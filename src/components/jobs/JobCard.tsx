import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building2, Clock, DollarSign, ExternalLink, Star } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  description: string;
  skills: string[];
  matchPercentage: number;
  applyUrl: string;
  type?: string;
  postedDate?: string;
}

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const handleApply = () => {
    window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'text-sage bg-sage/10 border-sage/20';
    if (percentage >= 60) return 'text-primary bg-primary/10 border-primary/20';
    return 'text-muted-foreground bg-muted border-border';
  };

  const truncateDescription = (text: string, maxLength: number = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                  {job.title}
                </h3>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getMatchColor(job.matchPercentage)}`}
                >
                  <Star className="h-3 w-3 mr-1" />
                  {job.matchPercentage}% match
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  <span className="font-medium">{job.company}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                {job.salary && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span>{job.salary}</span>
                  </div>
                )}
                {job.type && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{job.type}</span>
                  </div>
                )}
              </div>

              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                {truncateDescription(job.description)}
              </p>

              {job.skills && job.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.slice(0, 6).map((skill, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="text-xs bg-accent/50 text-accent-foreground hover:bg-accent/80 transition-colors"
                    >
                      {skill}
                    </Badge>
                  ))}
                  {job.skills.length > 6 && (
                    <Badge variant="outline" className="text-xs">
                      +{job.skills.length - 6} more
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              {job.postedDate && (
                <span>Posted {job.postedDate}</span>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Save Job
              </Button>
              <Button onClick={handleApply} size="sm" className="bg-primary hover:bg-primary/90">
                Apply Now
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default JobCard;