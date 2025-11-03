
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, FileText, Upload, Eye, Download } from 'lucide-react';

interface TimelineItem {
  id: string;
  type: 'upload' | 'view' | 'download' | 'edit';
  title: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
  color: string;
}

interface ActivityTimelineCardProps {
  hasResume: boolean;
}

const ActivityTimelineCard: React.FC<ActivityTimelineCardProps> = ({ hasResume }) => {
  const timelineItems: TimelineItem[] = hasResume ? [
    {
      id: '1',
      type: 'upload',
      title: 'Resume Uploaded',
      description: 'Software_Developer_Resume.pdf',
      timestamp: '2 hours ago',
      icon: <Upload className="w-4 h-4" />,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
    },
    {
      id: '2',
      type: 'view',
      title: 'ATS Score Calculated',
      description: 'Score: 85% - Good match',
      timestamp: '3 hours ago',
      icon: <Eye className="w-4 h-4" />,
      color: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
    },
    {
      id: '3',
      type: 'edit',
      title: 'Profile Updated',
      description: 'Added new skills and experience',
      timestamp: '1 day ago',
      icon: <FileText className="w-4 h-4" />,
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
    },
    {
      id: '4',
      type: 'download',
      title: 'Resume Downloaded',
      description: 'Modern template applied',
      timestamp: '2 days ago',
      icon: <Download className="w-4 h-4" />,
      color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'
    }
  ] : [
    {
      id: '1',
      type: 'view',
      title: 'Welcome to HiredAI',
      description: 'Complete your profile to get started',
      timestamp: 'Just now',
      icon: <FileText className="w-4 h-4" />,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="modern-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timelineItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center flex-shrink-0`}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm">{item.title}</h4>
                  <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.timestamp}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          {!hasResume && (
            <div className="mt-6 p-4 bg-accent/50 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Upload your resume to see more activity
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ActivityTimelineCard;
