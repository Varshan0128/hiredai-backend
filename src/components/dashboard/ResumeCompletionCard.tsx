
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ResumeCompletionCardProps {
  completion: number;
}

const ResumeCompletionCard: React.FC<ResumeCompletionCardProps> = ({ completion }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="bg-gradient-to-br from-card to-card/80 border-border/50 h-full hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-primary">
            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            Resume Completion
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-secondary mb-1">
              {completion}%
            </div>
            <p className="text-sm text-muted-foreground">Profile Complete</p>
          </div>
          
          <div className="space-y-2">
            <Progress value={completion} className="h-3 bg-muted [&>div]:bg-secondary" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>

          <Link to="/builder">
            <Button className="w-full rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-200 hover:shadow-md hover:shadow-accent/30">
              <Plus className="w-4 h-4 mr-2" />
              Complete Profile
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ResumeCompletionCard;
