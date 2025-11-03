import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building2, Clock, DollarSign, ExternalLink, Star, Heart, RotateCcw, Users, Calendar, TrendingUp } from 'lucide-react';

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
  benefits?: string[];
  teamSize?: string;
  requirements?: string[];
  companyLogo?: string;
}

interface EnhancedJobCardProps {
  job: Job;
  onSave?: (jobId: string) => void;
  isSaved?: boolean;
}

const EnhancedJobCard: React.FC<EnhancedJobCardProps> = ({ job, onSave, isSaved = false }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showShimmer, setShowShimmer] = useState(false);

  const handleApply = () => {
    window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSave = () => {
    onSave?.(job.id);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'text-sage bg-sage/10 border-sage/20';
    if (percentage >= 60) return 'text-lavender bg-lavender/10 border-lavender/20';
    return 'text-coral bg-coral/10 border-coral/20';
  };

  const truncateDescription = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleCardAppear = () => {
    setShowShimmer(true);
    setTimeout(() => setShowShimmer(false), 1000);
  };

  React.useEffect(() => {
    handleCardAppear();
  }, []);

  return (
    <motion.div
      className="perspective-1000"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative w-full h-80 preserve-3d" style={{ transformStyle: 'preserve-3d' }}>
        <motion.div
          className="absolute inset-0 w-full h-full"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front Face */}
          <Card className={`
            absolute inset-0 w-full h-full backface-hidden
            bg-card/60 backdrop-blur-md border border-border/50
            hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/20 hover:bg-card/70
            transition-all duration-300 overflow-hidden
            ${showShimmer ? 'animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent' : ''}
          `}>
            {/* Background decorations */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-lavender/5 to-transparent rounded-full blur-2xl" />
            
            <CardContent className="p-6 h-full flex flex-col relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {/* Company logo placeholder */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-lavender/20 to-sage/20 rounded-2xl flex items-center justify-center border border-border/50">
                      <Building2 className="w-6 h-6 text-lavender" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground hover:text-lavender transition-colors line-clamp-1">
                        {job.title}
                      </h3>
                      <p className="text-sm text-muted-foreground font-medium">{job.company}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3 flex-wrap">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                    {job.salary && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-medium text-sage">{job.salary}</span>
                      </div>
                    )}
                    {job.type && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{job.type}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-2">
                    {truncateDescription(job.description)}
                  </p>

                  {/* Skills */}
                  {job.skills && job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.slice(0, 4).map((skill, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="text-xs bg-accent/50 text-accent-foreground hover:bg-accent/80 transition-colors"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {job.skills.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{job.skills.length - 4} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                {/* Match percentage badge */}
                <motion.div
                  animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getMatchColor(job.matchPercentage)} font-semibold`}
                  >
                    <Star className="h-3 w-3 mr-1" />
                    {job.matchPercentage}% match
                  </Badge>
                </motion.div>
              </div>

              {/* Bottom actions */}
              <div className="mt-auto">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    {job.postedDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Posted {job.postedDate}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleFlip}
                      className="hover:bg-muted/80"
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleSave}
                        className={isSaved ? "text-coral border-coral/50 bg-coral/5" : ""}
                      >
                        <motion.div
                          animate={isSaved ? { scale: [1, 1.2, 1] } : {}}
                          transition={{ duration: 0.3 }}
                        >
                          <Heart className={`h-4 w-4 ${isSaved ? 'fill-coral text-coral' : ''}`} />
                        </motion.div>
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Back Face */}
          <Card className="absolute inset-0 w-full h-full backface-hidden rotateY-180 bg-card/80 backdrop-blur-lg border border-border/50">
            <CardContent className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-lavender">Job Details</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleFlip}
                  className="hover:bg-muted/80"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Back
                </Button>
              </div>

              <div className="space-y-4 flex-1 overflow-y-auto">
                {/* Requirements */}
                {job.requirements && job.requirements.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm text-sage mb-2 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Requirements
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {job.requirements.slice(0, 4).map((req, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1 h-1 bg-sage rounded-full mt-2 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Benefits */}
                {job.benefits && job.benefits.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm text-coral mb-2 flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Benefits
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {job.benefits.slice(0, 6).map((benefit, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="text-xs bg-coral/10 text-coral border-coral/20"
                        >
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Team info */}
                {job.teamSize && (
                  <div>
                    <h4 className="font-semibold text-sm text-lavender mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Team Size
                    </h4>
                    <p className="text-sm text-muted-foreground">{job.teamSize}</p>
                  </div>
                )}

                {/* Full description */}
                <div>
                  <h4 className="font-semibold text-sm text-foreground mb-2">Full Description</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {job.description}
                  </p>
                </div>
              </div>

              {/* Apply button */}
              <div className="mt-4 pt-4 border-t border-border/50">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    onClick={handleApply} 
                    className="w-full bg-gradient-to-r from-lavender to-sage hover:from-lavender/90 hover:to-sage/90 text-white border-0"
                  >
                    Apply Now
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EnhancedJobCard;