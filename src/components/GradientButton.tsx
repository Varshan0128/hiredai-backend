
import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'default',
  isLoading = false,
  icon,
  ...props
}) => {
  const gradients = {
    primary: 'bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90',
    secondary: 'bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-600/90 hover:to-gray-800/90'
  };

  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 px-3 py-1 text-sm',
    lg: 'h-12 px-6 py-3 text-lg'
  };

  return (
    <Button
      className={cn(
        gradients[variant],
        sizes[size],
        "text-white border-0 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]",
        isLoading && "opacity-80 cursor-not-allowed",
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </div>
      ) : (
        <span className="flex items-center gap-2">
          {children}
          {icon && icon}
        </span>
      )}
    </Button>
  );
};

export default GradientButton;
