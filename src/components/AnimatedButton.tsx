
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  withArrow?: boolean;
  icon?: React.ReactNode;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  variant = 'default',
  size = 'default',
  className,
  withArrow = false,
  icon,
  ...props
}) => {
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "relative overflow-hidden transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
        {icon && (
          <span className={cn(
            "transition-transform duration-300",
            isHovering ? "translate-x-1" : ""
          )}>
            {icon}
          </span>
        )}
        {withArrow && (
          <ArrowRight 
            className={cn(
              "w-4 h-4 transition-transform duration-300",
              isHovering ? "translate-x-1" : ""
            )}
          />
        )}
      </span>
      <span 
        className={cn(
          "absolute inset-0 z-0 bg-white/10 transition-transform duration-500 ease-out",
          isHovering ? "scale-x-100" : "scale-x-0"
        )}
        style={{ transformOrigin: 'left' }}
      />
    </Button>
  );
};

export default AnimatedButton;
