import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

interface GradientFlowProps {
  className?: string;
  direction?: 'horizontal' | 'vertical' | 'diagonal';
  speed?: 'slow' | 'medium' | 'fast';
  intensity?: 'subtle' | 'medium' | 'strong';
}

const GradientFlow: React.FC<GradientFlowProps> = ({ 
  className,
  direction = 'diagonal',
  speed = 'slow',
  intensity = 'subtle'
}) => {
  const speedDuration = {
    slow: 30,
    medium: 20,
    fast: 15
  };

  const intensityOpacity = {
    subtle: 'opacity-20',
    medium: 'opacity-30',
    strong: 'opacity-40'
  };

  const gradientDirection = {
    horizontal: 'bg-gradient-to-r',
    vertical: 'bg-gradient-to-b',
    diagonal: 'bg-gradient-to-br'
  };

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      <motion.div
        className={cn(
          "absolute inset-0",
          gradientDirection[direction],
          "from-blue-600/10 via-blue-400/5 via-blue-200/3 to-white/8",
          intensityOpacity[intensity]
        )}
        style={{
          backgroundSize: '200% 200%',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{
          duration: speedDuration[speed],
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
      
      {/* Secondary overlay for depth */}
      <motion.div
        className={cn(
          "absolute inset-0",
          gradientDirection[direction],
          "from-transparent via-blue-300/4 to-blue-500/6",
          intensityOpacity[intensity]
        )}
        style={{
          backgroundSize: '150% 150%',
        }}
        animate={{
          backgroundPosition: ['100% 100%', '0% 0%', '100% 100%'],
        }}
        transition={{
          duration: speedDuration[speed] * 0.8,
          ease: "easeInOut",
          repeat: Infinity,
          delay: speedDuration[speed] * 0.3,
        }}
      />
    </div>
  );
};

export default GradientFlow;