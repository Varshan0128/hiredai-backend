
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { User, Edit, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ResumeSummaryCardProps {
  hasResume: boolean;
}

const ResumeSummaryCard: React.FC<ResumeSummaryCardProps> = ({ hasResume }) => {
  const { user } = useAuth();

  const getUserInitials = () => {
    if (!user || !user.name) return "U";
    return user.name.split(' ')
      .map(part => part.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="bg-gradient-to-br from-card to-card/80 border-border/50 h-full hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-primary">
            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            Resume Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-semibold">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-primary">{user?.name || 'Your Name'}</h3>
              <p className="text-muted-foreground text-sm">
                {hasResume ? 'Software Developer' : 'Complete your profile to add a title'}
              </p>
            </div>
          </div>

          <p className="text-sm text-foreground leading-relaxed">
            {hasResume 
              ? 'Experienced developer with a passion for creating innovative solutions and working with cutting-edge technologies.'
              : 'Upload your resume or build a new one to see your professional summary here.'
            }
          </p>

          <div className="flex gap-2">
            <Link to="/builder" className="flex-1">
              <Button className="w-full rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-200 hover:shadow-md hover:shadow-accent/30">
                <Edit className="w-4 h-4 mr-2" />
                Edit Resume
              </Button>
            </Link>
            {hasResume && (
              <Button variant="ghost" size="icon" className="rounded-xl text-foreground hover:text-primary hover:bg-primary/10">
                <Eye className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ResumeSummaryCard;
