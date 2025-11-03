import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CircularProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: 'primary' | 'sage' | 'coral' | 'lavender';
  showValue?: boolean;
  label?: string;
  animated?: boolean;
  className?: string;
}

const CircularProgressRing: React.FC<CircularProgressRingProps> = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = 'primary',
  showValue = true,
  label,
  animated = true,
  className = ''
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const normalizedValue = Math.min(Math.max(value, 0), max);
  const percentage = (normalizedValue / max) * 100;
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedValue(normalizedValue);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedValue(normalizedValue);
    }
  }, [normalizedValue, animated]);

  const getColorClasses = () => {
    switch (color) {
      case 'sage':
        return {
          stroke: 'stroke-sage',
          text: 'text-sage',
          glow: 'drop-shadow-[0_0_8px_rgba(95,180,156,0.3)]'
        };
      case 'coral':
        return {
          stroke: 'stroke-coral',
          text: 'text-coral',
          glow: 'drop-shadow-[0_0_8px_rgba(255,111,97,0.3)]'
        };
      case 'lavender':
        return {
          stroke: 'stroke-lavender',
          text: 'text-lavender',
          glow: 'drop-shadow-[0_0_8px_rgba(155,138,251,0.3)]'
        };
      default:
        return {
          stroke: 'stroke-primary',
          text: 'text-primary',
          glow: 'drop-shadow-[0_0_8px_rgba(79,70,229,0.3)]'
        };
    }
  };

  const colorClasses = getColorClasses();

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted opacity-20"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          className={`${colorClasses.stroke} ${colorClasses.glow}`}
          initial={{ strokeDashoffset: circumference }}
          animate={{ 
            strokeDashoffset: animated 
              ? circumference - ((animatedValue / max) * circumference)
              : strokeDashoffset
          }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
            delay: 0.2
          }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showValue && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className={`text-2xl font-bold ${colorClasses.text}`}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 1 }}
            >
              {animatedValue}
            </motion.span>
            <span className="text-sm text-muted-foreground">%</span>
          </motion.div>
        )}
        
        {label && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1.2 }}
            className="text-xs text-muted-foreground text-center mt-1 max-w-20"
          >
            {label}
          </motion.p>
        )}
      </div>
      
      {/* Pulse effect */}
      {animated && (
        <motion.div
          className={`absolute inset-0 rounded-full border-2 ${colorClasses.stroke} opacity-30`}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      )}
    </div>
  );
};

export default CircularProgressRing;