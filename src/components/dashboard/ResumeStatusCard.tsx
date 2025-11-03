
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ResumeStatusCardProps {
  hasResume: boolean;
  viewCount: number;
}

const ResumeStatusCard: React.FC<ResumeStatusCardProps> = ({ hasResume, viewCount }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="modern-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Eye className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            Resume Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasResume ? (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">{viewCount}</div>
                <div className="text-sm text-muted-foreground">
                  {viewCount === 1 ? 'recruiter has' : 'recruiters have'} viewed your resume
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-accent/50 rounded-lg">
                  <div className="text-lg font-semibold">24</div>
                  <div className="text-xs text-muted-foreground">Profile Views</div>
                </div>
                <div className="p-3 bg-accent/50 rounded-lg">
                  <div className="text-lg font-semibold">8</div>
                  <div className="text-xs text-muted-foreground">Job Matches</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto">
                <Upload className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <div className="font-medium mb-1">No resume uploaded yet</div>
                <div className="text-sm text-muted-foreground mb-4">
                  Upload your resume to start getting noticed by recruiters
                </div>
                <Link to="/builder">
                  <Button className="rounded-xl">
                    Create Resume
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ResumeStatusCard;
