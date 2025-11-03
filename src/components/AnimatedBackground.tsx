
import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";
import GradientFlow from './animations/GradientFlow';
import FloatingShapes from './animations/FloatingShapes';
import ParticleField from './animations/ParticleField';

interface AnimatedBackgroundProps {
  className?: string;
  variant?: 'hero' | 'dashboard' | 'subtle' | 'interactive';
  showParticles?: boolean;
  showShapes?: boolean;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  className,
  variant = 'subtle',
  showParticles = false,
  showShapes = false 
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  if (!isMounted) return null;

  const getVariantIntensity = () => {
    switch (variant) {
      case 'hero': return 'strong';
      case 'dashboard': return 'medium';
      case 'interactive': return 'medium';
      default: return 'subtle';
    }
  };

  return (
    <div 
      className={cn(
        "fixed inset-0 -z-10 overflow-hidden",
        className
      )}
    >
      {/* Enhanced Gradient Flow Background */}
      <GradientFlow 
        direction="diagonal" 
        speed="slow" 
        intensity={getVariantIntensity()}
      />
      
      {/* Mouse-responsive overlay */}
      <div 
        className="absolute inset-0 bg-gradient-radial from-blue-500/5 via-transparent to-blue-600/3 opacity-40"
        style={{
          backgroundPosition: `${mousePosition.x * 100}% ${mousePosition.y * 100}%`,
          transition: 'background-position 0.3s ease-out'
        }}
      />
      
      {/* Enhanced top gradient */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-blue-600/8 via-blue-400/4 to-transparent blur-3xl" />
      
      {/* Animated dot pattern */}
      <div 
        className="absolute inset-0 bg-dot-pattern bg-[length:20px_20px] opacity-[0.08]"
        style={{
          transform: `translate(${mousePosition.x * -15}px, ${mousePosition.y * -15}px)`,
          transition: 'transform 0.4s ease-out'
        }}
      />
      
      {/* Floating Shapes */}
      {showShapes && (
        <FloatingShapes 
          shapeCount={variant === 'hero' ? 12 : 6}
          intensity={getVariantIntensity()}
        />
      )}
      
      {/* Particle Field */}
      {showParticles && (
        <ParticleField 
          particleCount={variant === 'hero' ? 20 : 10}
          color="mixed"
        />
      )}
      
      {/* Enhanced floating orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gradient-to-br from-blue-500/15 to-blue-600/10 rounded-full mix-blend-multiply filter blur-3xl animate-float-gentle" />
      <div className="absolute bottom-1/4 -right-24 w-80 h-80 bg-gradient-to-tl from-blue-400/12 to-blue-300/8 rounded-full mix-blend-multiply filter blur-3xl animate-float-gentle" style={{ animationDelay: '4s' }} />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-white/8 to-blue-200/6 rounded-full mix-blend-multiply filter blur-3xl animate-float-gentle" style={{ animationDelay: '8s' }} />
      
      {/* Subtle background overlay for text readability */}
      <div className="absolute inset-0 bg-background/[0.02]" />
    </div>
  );
};

export default AnimatedBackground;
