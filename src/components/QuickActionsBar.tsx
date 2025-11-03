import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Upload, MessageSquare, Search, FileText, Users, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: 'lavender' | 'sage' | 'coral';
}

interface QuickActionsBarProps {
  className?: string;
}

const QuickActionsBar: React.FC<QuickActionsBarProps> = ({ className }) => {
  const actions: QuickAction[] = [
    {
      id: 'upload-resume',
      title: 'Upload Resume',
      description: 'Analyze & optimize',
      icon: Upload,
      href: '/builder',
      color: 'lavender'
    },
    {
      id: 'mock-interview',
      title: 'Mock Interview',
      description: 'Practice with AI',
      icon: MessageSquare,
      href: '/interview-prep',
      color: 'sage'
    },
    {
      id: 'discover-jobs',
      title: 'Discover Jobs',
      description: 'Find perfect matches',
      icon: Search,
      href: '/jobs',
      color: 'coral'
    }
  ];

  const getColorClasses = (color: string, isHovered: boolean = false) => {
    const colorMap = {
      lavender: {
        bg: 'bg-lavender/10 hover:bg-lavender/20',
        border: 'border-lavender/20 hover:border-lavender/40',
        text: 'text-lavender',
        icon: 'text-lavender',
        glow: 'shadow-lavender/20'
      },
      sage: {
        bg: 'bg-sage/10 hover:bg-sage/20',
        border: 'border-sage/20 hover:border-sage/40',
        text: 'text-sage',
        icon: 'text-sage',
        glow: 'shadow-sage/20'
      },
      coral: {
        bg: 'bg-coral/10 hover:bg-coral/20',
        border: 'border-coral/20 hover:border-coral/40',
        text: 'text-coral',
        icon: 'text-coral',
        glow: 'shadow-coral/20'
      }
    };
    return colorMap[color as keyof typeof colorMap];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}
    >
      {actions.map((action, index) => {
        const Icon = action.icon;
        const colors = getColorClasses(action.color);

        return (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -2 }}
          >
            <Link to={action.href}>
              <motion.div
                className={`
                  relative overflow-hidden rounded-2xl p-6 border transition-all duration-300
                  bg-card/50 backdrop-blur-sm hover:shadow-lg
                  ${colors.bg} ${colors.border}
                  group cursor-pointer
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Floating background shape */}
                <div className={`absolute top-2 right-2 w-12 h-12 ${colors.bg} rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300`} />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-3">
                    <motion.div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colors.bg} ${colors.border} border`}
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon className={`w-6 h-6 ${colors.icon}`} />
                    </motion.div>
                    
                    <div className="flex-1">
                      <h3 className={`font-semibold text-lg ${colors.text} mb-1`}>
                        {action.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </div>
                  
                  <motion.div
                    className="w-full h-1 bg-border/30 rounded-full overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.div
                      className={`h-full ${colors.bg} rounded-full`}
                      initial={{ width: '0%' }}
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.5 }}
                    />
                  </motion.div>
                </div>
                
                {/* Subtle shimmer effect */}
                <div className="absolute inset-0 bg-shimmer opacity-0 group-hover:animate-shimmer group-hover:opacity-20" />
              </motion.div>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default QuickActionsBar;