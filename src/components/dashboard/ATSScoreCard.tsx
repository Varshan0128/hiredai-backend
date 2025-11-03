
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target, TrendingUp } from 'lucide-react';

interface ATSScoreCardProps {
  score: number;
  previousScore?: number;
}

const ATSScoreCard: React.FC<ATSScoreCardProps> = ({ score, previousScore }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const improvement = previousScore ? score - previousScore : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-br from-card to-card/80 border-border/50 h-full hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-primary">
            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-primary" />
            </div>
            ATS Score
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-secondary">
              {score}%
            </div>
            <p className="text-sm text-muted-foreground">Resume Compatibility</p>
          </div>
          
          <div className="space-y-2">
            <Progress value={score} className="h-3 bg-muted [&>div]:bg-secondary" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>

          {improvement !== 0 && (
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-secondary" />
              <span className="text-secondary font-medium">
                {improvement > 0 ? '+' : ''}{improvement}% from last scan
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ATSScoreCard;
