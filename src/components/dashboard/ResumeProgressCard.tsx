
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FileText, CheckCircle } from 'lucide-react';

interface ResumeProgressCardProps {
  resumeProgress: number;
  interviewCompleted: boolean;
}

const ResumeProgressCard: React.FC<ResumeProgressCardProps> = ({ 
  resumeProgress, 
  interviewCompleted 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="modern-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Resume Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Resume Completion</span>
              <span className="text-sm text-muted-foreground">{resumeProgress}%</span>
            </div>
            <Progress value={resumeProgress} className="h-2" />
          </div>

          {/* Interview Status */}
          <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle 
                className={`w-5 h-5 ${
                  interviewCompleted ? 'text-green-500' : 'text-muted-foreground'
                }`} 
              />
              <span className="text-sm font-medium">Interview Preparation</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              interviewCompleted 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
            }`}>
              {interviewCompleted ? 'Completed' : 'In Progress'}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ResumeProgressCard;
