import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, DollarSign, Clock, Users, Heart, ExternalLink, Building, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  description: string;
  skills: string[];
  matchPercentage: number;
  applyUrl?: string;
  type: string;
  postedDate: string;
  requirements?: string[];
  benefits?: string[];
  teamSize?: string;
  companyLogo?: string;
}

interface FlipJobCardProps {
  job: Job;
  onSave?: (jobId: string) => void;
  onApply?: (jobId: string) => void;
  className?: string;
}

const FlipJobCard: React.FC<FlipJobCardProps> = ({
  job,
  onSave,
  onApply,
  className = ''
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    onSave?.(job.id);
  };

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    onApply?.(job.id);
    if (job.applyUrl) {
      window.open(job.applyUrl, '_blank');
    }
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'text-sage bg-sage/10 border-sage/20';
    if (percentage >= 60) return 'text-lavender bg-lavender/10 border-lavender/20';
    return 'text-coral bg-coral/10 border-coral/20';
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <motion.div
      className={`relative perspective-1000 ${className}`}
      style={{ perspective: '1000px' }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className="relative w-full h-96 preserve-3d cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        onClick={handleFlip}
        whileHover={{ scale: 1.02 }}
      >
        {/* Front Face */}
        <Card className="absolute inset-0 backface-hidden modern-card border-0 shadow-lg overflow-hidden group">
          {/* Glassmorphism overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/40 to-transparent dark:from-card/80 dark:via-card/40 backdrop-blur-sm" />
          
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-shimmer opacity-0 group-hover:animate-shimmer group-hover:opacity-10"
            initial={false}
            animate={isHovered ? { opacity: 0.1 } : { opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          <CardHeader className="relative z-10 pb-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                {job.companyLogo ? (
                  <img 
                    src={job.companyLogo} 
                    alt={`${job.company} logo`}
                    className="w-12 h-12 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-lavender/20 to-sage/20 rounded-2xl flex items-center justify-center">
                    <Building className="w-6 h-6 text-lavender" />
                  </div>
                )}
                <Badge className={`${getMatchColor(job.matchPercentage)} border font-medium`}>
                  {job.matchPercentage}% Match
                </Badge>
              </div>
              
              <motion.button
                onClick={handleSave}
                className="p-2 rounded-xl hover:bg-white/20 dark:hover:bg-card/20 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart 
                  className={`w-5 h-5 transition-colors ${
                    isSaved ? 'text-coral fill-coral' : 'text-muted-foreground hover:text-coral'
                  }`} 
                />
              </motion.button>
            </div>

            <CardTitle className="text-xl font-bold text-foreground mb-2 leading-tight">
              {job.title}
            </CardTitle>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Building className="w-4 h-4" />
                {job.company}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {job.location}
              </div>
            </div>
          </CardHeader>

          <CardContent className="relative z-10 space-y-4">
            {job.salary && (
              <div className="flex items-center gap-2 text-sage font-semibold">
                <DollarSign className="w-4 h-4" />
                {job.salary}
              </div>
            )}

            <p className="text-muted-foreground text-sm leading-relaxed">
              {truncateText(job.description, 120)}
            </p>

            <div className="flex flex-wrap gap-2">
              {job.skills.slice(0, 3).map((skill, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs bg-white/50 dark:bg-card/50 backdrop-blur-sm"
                >
                  {skill}
                </Badge>
              ))}
              {job.skills.length > 3 && (
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  +{job.skills.length - 3} more
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {job.type}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {job.postedDate}
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground">Click to flip</p>
            </div>
          </CardContent>
        </Card>

        {/* Back Face */}
        <Card className="absolute inset-0 backface-hidden modern-card border-0 shadow-lg overflow-hidden" 
              style={{ transform: 'rotateY(180deg)' }}>
          {/* Glassmorphism overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/60 to-transparent dark:from-card/90 dark:via-card/60 backdrop-blur-sm" />
          
          <CardHeader className="relative z-10 pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-bold text-foreground">
                Job Details
              </CardTitle>
              <Button
                onClick={handleApply}
                size="sm"
                className="bg-gradient-to-r from-lavender to-sage hover:from-lavender/90 hover:to-sage/90 text-white border-0 rounded-xl"
              >
                Apply Now
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="relative z-10 space-y-4 text-sm">
            {job.requirements && (
              <div>
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-lavender rounded-full" />
                  Requirements
                </h4>
                <ul className="space-y-1 text-muted-foreground">
                  {job.requirements.slice(0, 3).map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.benefits && (
              <div>
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-sage rounded-full" />
                  Benefits
                </h4>
                <ul className="space-y-1 text-muted-foreground">
                  {job.benefits.slice(0, 3).map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.teamSize && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-4 h-4 text-coral" />
                <span>Team Size: {job.teamSize}</span>
              </div>
            )}

            <div className="pt-4 border-t border-border/10">
              <p className="text-muted-foreground text-xs leading-relaxed">
                {job.description}
              </p>
            </div>

            <div className="flex justify-between items-center pt-4">
              <p className="text-xs text-muted-foreground">Click to flip back</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
                  className="rounded-xl"
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'text-coral fill-coral' : ''}`} />
                </Button>
                <Button
                  onClick={handleApply}
                  size="sm"
                  className="bg-gradient-to-r from-lavender to-sage text-white rounded-xl"
                >
                  Apply
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default FlipJobCard;