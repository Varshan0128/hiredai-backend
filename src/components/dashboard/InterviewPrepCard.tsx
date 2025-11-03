
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Star, ArrowRight } from 'lucide-react';

const InterviewPrepCard: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="modern-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
            Interview Preparation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Sample Question</div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-muted-foreground">Medium</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              "Tell me about a time when you had to work with a difficult team member. How did you handle the situation?"
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>From: Google</span>
              <span>85% success rate</span>
            </div>
          </div>
          <Button variant="outline" className="w-full rounded-xl">
            Start Practice Session
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InterviewPrepCard;
