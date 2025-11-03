
import React from 'react';
import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';
import { useBreakpoint } from '@/hooks/use-mobile';
import { Progress } from "@/components/ui/progress";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepNames?: string[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ 
  currentStep, 
  totalSteps,
  stepNames = []
}) => {
  const breakpoint = useBreakpoint();
  const isMobileView = breakpoint === 'mobile';
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
  
  // If on mobile, show a simplified view with just the current step and progress
  if (isMobileView) {
    return (
      <div className="w-full px-2 mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            {stepNames[currentStep - 1] || `Step ${currentStep}`}
          </h3>
          <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {currentStep} of {totalSteps}
          </span>
        </div>
        
        <Progress value={progress} className="h-2 w-full" />
      </div>
    );
  }
  
  // Desktop and tablet view with full step navigation
  return (
    <div className="w-full max-w-3xl mx-auto mb-10">
      <div className="relative flex items-center justify-between">
        {/* Progress bar background */}
        <div className="absolute left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700" />
        
        {/* Animated progress */}
        <motion.div 
          className="absolute left-0 h-0.5 bg-primary"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
        
        {/* Step indicators */}
        {steps.map((step) => (
          <div key={step} className="relative z-10 flex flex-col items-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 500, 
                damping: 30,
                delay: step * 0.1
              }}
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full shadow-sm",
                step < currentStep
                  ? "bg-primary text-white"
                  : step === currentStep
                    ? "bg-white dark:bg-gray-800 border-2 border-primary text-primary"
                    : "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-400"
              )}
            >
              {step < currentStep ? (
                <Check className="h-5 w-5" />
              ) : (
                <span className="text-sm font-medium">{step}</span>
              )}
            </motion.div>
            
            {stepNames[step - 1] && (
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: step * 0.1 + 0.2 }}
                className={cn(
                  "mt-2 text-xs font-medium max-w-[80px] text-center line-clamp-1",
                  step === currentStep 
                    ? "text-primary font-semibold" 
                    : "text-gray-500 dark:text-gray-400"
                )}
              >
                {stepNames[step - 1]}
              </motion.span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
