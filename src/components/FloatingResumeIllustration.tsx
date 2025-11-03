import React from 'react';
import { motion } from 'framer-motion';
import { FileText, User, Briefcase, Star, Trophy } from 'lucide-react';

interface FloatingResumeIllustrationProps {
  className?: string;
  variant?: 'hero' | 'compact' | 'detailed';
}

const FloatingResumeIllustration: React.FC<FloatingResumeIllustrationProps> = ({
  className = '',
  variant = 'hero'
}) => {
  const getSize = () => {
    switch (variant) {
      case 'hero': return 'w-80 h-96';
      case 'compact': return 'w-32 h-40';
      case 'detailed': return 'w-64 h-80';
      default: return 'w-80 h-96';
    }
  };

  const getIconSize = () => {
    switch (variant) {
      case 'hero': return 'w-6 h-6';
      case 'compact': return 'w-3 h-3';
      case 'detailed': return 'w-5 h-5';
      default: return 'w-6 h-6';
    }
  };

  return (
    <motion.div
      className={`relative ${getSize()} ${className}`}
      animate={{
        y: [0, -15, 0],
        rotate: [0, 1, -1, 0],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* Main Resume Paper */}
      <motion.div
        className="absolute inset-0 bg-white dark:bg-card rounded-3xl shadow-2xl border border-border/20"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/40 to-transparent dark:from-card/80 dark:via-card/40 rounded-3xl backdrop-blur-sm" />
        
        {/* Header section */}
        <div className="relative p-6 border-b border-border/10">
          <motion.div
            className="flex items-center gap-3 mb-3"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-lavender to-sage rounded-2xl flex items-center justify-center"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <User className={`${getIconSize()} text-white`} />
            </motion.div>
            <div className="flex-1">
              <div className="h-3 bg-gradient-to-r from-lavender/30 to-transparent rounded mb-2" />
              <div className="h-2 bg-gradient-to-r from-sage/20 to-transparent rounded w-3/4" />
            </div>
          </motion.div>
          
          {/* Contact info lines */}
          <div className="space-y-2">
            <div className="h-1.5 bg-gradient-to-r from-coral/20 to-transparent rounded w-2/3" />
            <div className="h-1.5 bg-gradient-to-r from-lavender/20 to-transparent rounded w-1/2" />
          </div>
        </div>

        {/* Experience section */}
        <div className="relative p-6 space-y-4">
          <motion.div
            className="flex items-center gap-2 mb-4"
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
          >
            <Briefcase className={`${getIconSize()} text-lavender`} />
            <div className="h-2 bg-lavender/30 rounded w-20" />
          </motion.div>
          
          {/* Experience entries */}
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="space-y-2 pb-3 border-b border-border/5 last:border-b-0"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 5, repeat: Infinity, delay: i * 0.3 }}
            >
              <div className="flex justify-between items-center">
                <div className="h-2 bg-gradient-to-r from-sage/40 to-transparent rounded w-1/3" />
                <div className="h-1.5 bg-coral/20 rounded w-16" />
              </div>
              <div className="h-1.5 bg-gradient-to-r from-muted-foreground/20 to-transparent rounded w-1/4" />
              <div className="space-y-1">
                <div className="h-1 bg-muted-foreground/10 rounded w-full" />
                <div className="h-1 bg-muted-foreground/10 rounded w-4/5" />
                <div className="h-1 bg-muted-foreground/10 rounded w-3/5" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Skills badges */}
        <div className="relative p-6">
          <motion.div
            className="flex items-center gap-2 mb-3"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          >
            <Star className={`${getIconSize()} text-coral`} />
            <div className="h-2 bg-coral/30 rounded w-16" />
          </motion.div>
          
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="h-4 bg-gradient-to-r from-lavender/20 via-sage/20 to-coral/20 rounded-full"
                style={{ width: `${Math.random() * 40 + 30}px` }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Floating decorative elements */}
      <motion.div
        className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-lavender to-coral rounded-2xl shadow-lg flex items-center justify-center"
        animate={{
          y: [0, -10, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Trophy className="w-4 h-4 text-white" />
      </motion.div>

      <motion.div
        className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-sage to-lavender rounded-xl shadow-lg flex items-center justify-center"
        animate={{
          y: [0, -8, 0],
          x: [0, 5, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <FileText className="w-3 h-3 text-white" />
      </motion.div>

      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-lavender/10 via-transparent to-coral/10 rounded-3xl blur-2xl -z-10" />
    </motion.div>
  );
};

export default FloatingResumeIllustration;