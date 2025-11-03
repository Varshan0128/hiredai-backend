import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

interface WaveBackgroundProps {
  className?: string;
  intensity?: 'subtle' | 'medium' | 'strong';
}

const WaveBackground: React.FC<WaveBackgroundProps> = ({ 
  className,
  intensity = 'subtle'
}) => {
  const waveOpacity = {
    subtle: 'opacity-20',
    medium: 'opacity-30', 
    strong: 'opacity-40'
  };

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {/* Primary Wave */}
      <motion.div
        className={cn(
          "absolute inset-0 bg-gradient-to-r from-blue-600/10 via-blue-400/5 to-transparent",
          waveOpacity[intensity]
        )}
        style={{
          clipPath: "polygon(0 70%, 100% 60%, 100% 100%, 0 100%)",
        }}
        animate={{
          clipPath: [
            "polygon(0 70%, 100% 60%, 100% 100%, 0 100%)",
            "polygon(0 60%, 100% 70%, 100% 100%, 0 100%)",
            "polygon(0 70%, 100% 60%, 100% 100%, 0 100%)",
          ]
        }}
        transition={{
          duration: 25,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
      
      {/* Secondary Wave */}
      <motion.div
        className={cn(
          "absolute inset-0 bg-gradient-to-l from-blue-500/8 via-blue-300/4 to-transparent",
          waveOpacity[intensity]
        )}
        style={{
          clipPath: "polygon(0 80%, 100% 75%, 100% 100%, 0 100%)",
        }}
        animate={{
          clipPath: [
            "polygon(0 80%, 100% 75%, 100% 100%, 0 100%)",
            "polygon(0 75%, 100% 85%, 100% 100%, 0 100%)",
            "polygon(0 80%, 100% 75%, 100% 100%, 0 100%)",
          ]
        }}
        transition={{
          duration: 20,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 5,
        }}
      />

      {/* Tertiary Wave */}
      <motion.div
        className={cn(
          "absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/6 to-blue-400/8",
          waveOpacity[intensity]
        )}
        style={{
          clipPath: "polygon(0 85%, 100% 80%, 100% 100%, 0 100%)",
        }}
        animate={{
          clipPath: [
            "polygon(0 85%, 100% 80%, 100% 100%, 0 100%)",
            "polygon(0 80%, 100% 90%, 100% 100%, 0 100%)",
            "polygon(0 85%, 100% 80%, 100% 100%, 0 100%)",
          ]
        }}
        transition={{
          duration: 30,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 10,
        }}
      />
    </div>
  );
};

export default WaveBackground;