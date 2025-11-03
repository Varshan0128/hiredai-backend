import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, Search, Trophy, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JourneyStep {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  completed: boolean;
  progress: number;
}

interface AIJourneyMapProps {
  className?: string;
  currentStep?: number;
}

const AIJourneyMap: React.FC<AIJourneyMapProps> = ({ className, currentStep = 1 }) => {
  const steps: JourneyStep[] = [
    {
      id: 1,
      title: 'Resume',
      description: 'Build ATS-optimized resume',
      icon: FileText,
      completed: currentStep > 1,
      progress: currentStep >= 1 ? 100 : 0
    },
    {
      id: 2,
      title: 'Interview',
      description: 'Practice with AI coaching',
      icon: Users,
      completed: currentStep > 2,
      progress: currentStep >= 2 ? 100 : currentStep === 1 ? 30 : 0
    },
    {
      id: 3,
      title: 'Jobs',
      description: 'Find perfect matches',
      icon: Search,
      completed: currentStep > 3,
      progress: currentStep >= 3 ? 100 : currentStep <= 1 ? 0 : 60
    },
    {
      id: 4,
      title: 'Success',
      description: 'Land your dream role',
      icon: Trophy,
      completed: currentStep > 4,
      progress: currentStep >= 4 ? 100 : 0
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className={`bg-card/50 backdrop-blur-sm rounded-3xl p-6 border border-border/50 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-lavender mb-1">Your AI Journey</h3>
          <p className="text-sm text-muted-foreground">Track your progress to career success</p>
        </div>
        <div className="text-2xl font-bold text-sage">
          {Math.round((steps.filter(s => s.completed).length / steps.length) * 100)}%
        </div>
      </div>

      <div className="relative">
        {/* Progress line */}
        <div className="absolute top-8 left-8 right-8 h-0.5 bg-border/30">
          <motion.div
            className="h-full bg-gradient-to-r from-lavender via-sage to-coral rounded-full"
            initial={{ width: '0%' }}
            animate={{ 
              width: `${(steps.filter(s => s.completed).length / (steps.length - 1)) * 100}%` 
            }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>

        <div className="flex justify-between relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = step.completed;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center text-center relative"
              >
                {/* Step circle */}
                <motion.div
                  className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center relative mb-3 transition-all duration-300",
                    isCompleted 
                      ? "bg-sage text-white shadow-lg shadow-sage/30" 
                      : isActive 
                        ? "bg-lavender text-white shadow-lg shadow-lavender/30" 
                        : "bg-card border-2 border-border text-muted-foreground"
                  )}
                  whileHover={{ scale: 1.1 }}
                  animate={isActive ? { 
                    boxShadow: [
                      "0 0 0 0 rgba(155, 138, 251, 0.4)",
                      "0 0 0 10px rgba(155, 138, 251, 0)",
                      "0 0 0 0 rgba(155, 138, 251, 0.4)"
                    ]
                  } : {}}
                  transition={isActive ? { duration: 2, repeat: Infinity } : { duration: 0.2 }}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                  
                  {/* Progress ring for active step */}
                  {isActive && !isCompleted && (
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle
                        cx="50%"
                        cy="50%"
                        r="28"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeOpacity="0.2"
                      />
                      <motion.circle
                        cx="50%"
                        cy="50%"
                        r="28"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: step.progress / 100 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        style={{
                          strokeDasharray: "175.929, 175.929"
                        }}
                      />
                    </svg>
                  )}
                </motion.div>

                {/* Step info */}
                <div className="max-w-20">
                  <h4 className={cn(
                    "font-semibold text-sm mb-1",
                    isCompleted ? "text-sage" : isActive ? "text-lavender" : "text-muted-foreground"
                  )}>
                    {step.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-tight">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default AIJourneyMap;