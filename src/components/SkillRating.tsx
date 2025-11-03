
import React from 'react';
import { motion } from 'framer-motion';
import { Star, StarHalf, StarOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SkillRatingProps {
  score: number;
  maxScore?: number;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SkillRating: React.FC<SkillRatingProps> = ({
  score,
  maxScore = 5,
  showValue = false,
  size = 'md',
  className
}) => {
  // Calculate how many full, half and empty stars we need
  const fullStars = Math.floor(score);
  const hasHalfStar = score % 1 >= 0.3 && score % 1 <= 0.7;
  const emptyStars = Math.floor(maxScore - fullStars - (hasHalfStar ? 1 : 0));
  
  // Determine star size based on the size prop
  const starSizeClass = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }[size];
  
  // Determine container size classes
  const containerSizeClass = {
    sm: 'text-xs gap-0.5',
    md: 'text-sm gap-1',
    lg: 'text-base gap-1.5'
  }[size];
  
  return (
    <div className={cn("flex items-center", containerSizeClass, className)}>
      <div className="flex">
        {/* Full stars */}
        {Array(fullStars).fill(0).map((_, i) => (
          <motion.div 
            key={`full-star-${i}`} 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
          >
            <Star className={cn(starSizeClass, "fill-yellow-400 text-yellow-400")} />
          </motion.div>
        ))}
        
        {/* Half star if needed */}
        {hasHalfStar && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: fullStars * 0.1, duration: 0.3 }}
          >
            <StarHalf className={cn(starSizeClass, "fill-yellow-400 text-yellow-400")} />
          </motion.div>
        )}
        
        {/* Empty stars */}
        {Array(emptyStars).fill(0).map((_, i) => (
          <motion.div 
            key={`empty-star-${i}`} 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: (fullStars + (hasHalfStar ? 1 : 0) + i) * 0.1, duration: 0.3 }}
          >
            <StarOff className={cn(starSizeClass, "text-gray-300 dark:text-gray-600")} />
          </motion.div>
        ))}
      </div>
      
      {showValue && (
        <span className="ml-2 text-muted-foreground font-medium">
          {score.toFixed(1)}/{maxScore.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default SkillRating;
