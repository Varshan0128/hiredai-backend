import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

interface PulseIndicatorProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'subtle' | 'medium' | 'strong';
  color?: 'primary' | 'blue' | 'white';
  disabled?: boolean;
}

const PulseIndicator: React.FC<PulseIndicatorProps> = ({ 
  children,
  className,
  intensity = 'medium',
  color = 'primary',
  disabled = false
}) => {
  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  const pulseColors = {
    primary: 'rgba(124, 93, 250, 0.4)',
    blue: 'rgba(59, 130, 246, 0.4)',
    white: 'rgba(255, 255, 255, 0.4)'
  };

  const intensityScales = {
    subtle: { scale: 1.02, shadowSpread: 10 },
    medium: { scale: 1.05, shadowSpread: 20 },
    strong: { scale: 1.08, shadowSpread: 30 }
  };

  const { scale, shadowSpread } = intensityScales[intensity];
  const shadowColor = pulseColors[color];

  return (
    <motion.div
      className={cn("relative", className)}
      whileHover={{
        scale,
        transition: { duration: 0.2 }
      }}
      animate={{
        boxShadow: [
          `0 0 0 0 ${shadowColor}`,
          `0 0 0 ${shadowSpread}px ${shadowColor.replace('0.4', '0')}`,
          `0 0 0 0 ${shadowColor}`
        ]
      }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

export default PulseIndicator;