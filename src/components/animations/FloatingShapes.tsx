import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

interface Shape {
  id: number;
  type: 'circle' | 'square' | 'triangle';
  size: number;
  x: number;
  y: number;
  rotation: number;
  duration: number;
}

interface FloatingShapesProps {
  className?: string;
  shapeCount?: number;
  intensity?: 'subtle' | 'medium' | 'strong';
}

const FloatingShapes: React.FC<FloatingShapesProps> = ({ 
  className,
  shapeCount = 8,
  intensity = 'subtle'
}) => {
  const shapes: Shape[] = React.useMemo(() => {
    return Array.from({ length: shapeCount }, (_, i) => ({
      id: i,
      type: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)] as Shape['type'],
      size: Math.random() * 60 + 20,
      x: Math.random() * 100,
      y: Math.random() * 100,
      rotation: Math.random() * 360,
      duration: 8 + Math.random() * 12,
    }));
  }, [shapeCount]);

  const opacityLevel = {
    subtle: 'opacity-[0.03]',
    medium: 'opacity-[0.06]', 
    strong: 'opacity-[0.1]'
  };

  const renderShape = (shape: Shape) => {
    const baseClasses = cn(
      "absolute bg-gradient-to-br from-blue-500 to-blue-300",
      opacityLevel[intensity]
    );

    switch (shape.type) {
      case 'circle':
        return <div className={cn(baseClasses, "rounded-full")} />;
      case 'square':
        return <div className={cn(baseClasses, "rounded-lg")} />;
      case 'triangle':
        return (
          <div 
            className={baseClasses}
            style={{
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            }}
          />
        );
    }
  };

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute"
          style={{
            width: shape.size,
            height: shape.size,
            left: `${shape.x}%`,
            top: `${shape.y}%`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, -5, 0],
            rotate: [shape.rotation, shape.rotation + 360],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
        >
          {renderShape(shape)}
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingShapes;