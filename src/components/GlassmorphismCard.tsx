import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassmorphismCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'featured' | 'subtle';
  hoverable?: boolean;
  animated?: boolean;
}

const GlassmorphismCard: React.FC<GlassmorphismCardProps> = ({
  children,
  className,
  variant = 'default',
  hoverable = true,
  animated = true
}) => {
  const variantClasses = {
    default: 'bg-card/60 backdrop-blur-md border border-border/50',
    featured: 'bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-lg border border-border/30 shadow-xl',
    subtle: 'bg-card/30 backdrop-blur-sm border border-border/20'
  };

  const hoverClasses = hoverable 
    ? 'hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/20 hover:bg-card/70 transition-all duration-300' 
    : '';

  const CardComponent = animated ? motion.div : 'div';
  const cardProps = animated ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
    whileHover: hoverable ? { y: -2, scale: 1.01 } : undefined
  } : {};

  return (
    <CardComponent
      className={cn(
        'rounded-3xl relative overflow-hidden',
        variantClasses[variant],
        hoverClasses,
        className
      )}
      {...cardProps}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/5 to-transparent rounded-full blur-xl pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Optional shimmer effect on hover */}
      {hoverable && (
        <div className="absolute inset-0 bg-shimmer opacity-0 hover:animate-shimmer hover:opacity-10 pointer-events-none" />
      )}
    </CardComponent>
  );
};

export default GlassmorphismCard;