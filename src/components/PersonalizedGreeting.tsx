import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, Rocket } from 'lucide-react';

interface PersonalizedGreetingProps {
  className?: string;
}

const PersonalizedGreeting: React.FC<PersonalizedGreetingProps> = ({ className }) => {
  const { user } = useAuth();
  
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getUserName = () => {
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'there';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-r from-lavender/10 via-sage/5 to-coral/10 p-8 ${className}`}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
      <div className="absolute top-4 right-4 w-24 h-24 bg-lavender/10 rounded-full blur-2xl" />
      <div className="absolute bottom-4 left-4 w-16 h-16 bg-coral/10 rounded-full blur-xl" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-12 h-12 bg-gradient-to-br from-lavender to-sage rounded-2xl flex items-center justify-center"
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>
          
          <div>
            <motion.h1 
              className="text-3xl font-bold text-lavender mb-1"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              {getTimeBasedGreeting()}, {getUserName()}!
            </motion.h1>
            <p className="text-foreground/70 text-lg">
              Let's land your dream role this week
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="inline-block ml-2"
              >
                🚀
              </motion.span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-sage rounded-full animate-pulse" />
          <span>Your AI career assistant is ready to help</span>
        </div>
      </div>
    </motion.div>
  );
};

export default PersonalizedGreeting;