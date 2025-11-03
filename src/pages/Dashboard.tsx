
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ATSScoreCard from '@/components/dashboard/ATSScoreCard';
import ResumeCompletionCard from '@/components/dashboard/ResumeCompletionCard';
import ResumeSummaryCard from '@/components/dashboard/ResumeSummaryCard';
import RecommendedJobsCard from '@/components/dashboard/RecommendedJobsCard';
import ActivityTimelineCard from '@/components/dashboard/ActivityTimelineCard';
import UploadResumeCard from '@/components/dashboard/UploadResumeCard';
import AnimatedBackground from '@/components/AnimatedBackground';
import ParticleField from '@/components/animations/ParticleField';
import PulseIndicator from '@/components/animations/PulseIndicator';
import PersonalizedGreeting from '@/components/PersonalizedGreeting';
import AIJourneyMap from '@/components/AIJourneyMap';
import QuickActionsBar from '@/components/QuickActionsBar';
import AIChatAssistant from '@/components/AIChatAssistant';
import EnhancedFooter from '@/components/EnhancedFooter';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mock data - in a real app, this would come from your backend
  const [hasResume, setHasResume] = useState(false);
  const [atsScore, setAtsScore] = useState(85);
  const resumeCompletion = 60;

  const sidebarWidth = sidebarCollapsed ? 80 : 280;

  const handleResumeUpload = (file: File) => {
    setHasResume(true);
    // Simulate ATS score calculation
    setAtsScore(Math.floor(Math.random() * 20) + 75);
  };

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground variant="dashboard" showParticles />
      <DashboardSidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <DashboardHeader sidebarWidth={sidebarWidth} />
      
      <motion.main
        initial={false}
        animate={{ marginLeft: sidebarWidth }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="pt-24 p-8 relative z-10"
      >
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-bold text-gradient mb-4">
              Welcome back, {isAuthenticated && user ? user.name : 'User'}! 
            </h1>
            <p className="text-lg text-muted-foreground">
              Here's what's happening with your career journey today.
            </p>
          </motion.div>

          {/* Top Row - ATS Score and Resume Completion */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 relative"
          >
            <ParticleField particleCount={6} color="blue" className="opacity-30" />
            <PulseIndicator intensity="subtle" color="primary">
              <ATSScoreCard score={atsScore} previousScore={hasResume ? 78 : undefined} />
            </PulseIndicator>
            <motion.div whileHover={{ y: -2, transition: { duration: 0.2 } }}>
              <ResumeCompletionCard completion={resumeCompletion} />
            </motion.div>
          </motion.div>

          {/* Middle Section - Main Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
          >
            <motion.div whileHover={{ scale: 1.01, y: -1, transition: { duration: 0.2 } }}>
              <ResumeSummaryCard hasResume={hasResume} />
            </motion.div>
            <motion.div whileHover={{ scale: 1.01, y: -1, transition: { duration: 0.2 } }}>
              <RecommendedJobsCard hasResume={hasResume} />
            </motion.div>
          </motion.div>

          {/* Bottom Section - Activity Timeline and Upload */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <motion.div 
              className="lg:col-span-2"
              whileHover={{ scale: 1.005, transition: { duration: 0.2 } }}
            >
              <ActivityTimelineCard hasResume={hasResume} />
            </motion.div>
            <div className="lg:col-span-1">
              <PulseIndicator intensity="medium" color="blue">
                <UploadResumeCard onUpload={handleResumeUpload} hasResume={hasResume} />
              </PulseIndicator>
            </div>
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
};

export default Dashboard;
