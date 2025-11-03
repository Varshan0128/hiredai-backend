import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

interface Particle {
  id: number;
  size: number;
  x: number;
  delay: number;
  duration: number;
}

interface ParticleFieldProps {
  className?: string;
  particleCount?: number;
  color?: 'blue' | 'white' | 'mixed';
}

const ParticleField: React.FC<ParticleFieldProps> = ({ 
  className,
  particleCount = 15,
  color = 'mixed'
}) => {
  const particles: Particle[] = React.useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      x: Math.random() * 100,
      delay: Math.random() * 20,
      duration: 15 + Math.random() * 10,
    }));
  }, [particleCount]);

  const getParticleColor = (index: number) => {
    if (color === 'blue') return 'bg-blue-500/20';
    if (color === 'white') return 'bg-white/30';
    return index % 3 === 0 ? 'bg-blue-500/20' : index % 3 === 1 ? 'bg-blue-400/15' : 'bg-white/25';
  };

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={cn(
            "absolute rounded-full blur-[0.5px]",
            getParticleColor(particle.id)
          )}
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
          }}
          animate={{
            y: [window.innerHeight + 20, -20],
            x: [0, Math.random() * 40 - 20],
            opacity: [0, 0.7, 0.7, 0],
            scale: [0.5, 1, 1, 0.5],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

export default ParticleField;