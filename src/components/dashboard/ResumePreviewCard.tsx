
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Edit, Download, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ResumePreviewCardProps {
  hasResume: boolean;
}

const ResumePreviewCard: React.FC<ResumePreviewCardProps> = ({ hasResume }) => {
  const mockResumeData = {
    name: "Varshan Kumar",
    email: "varshan@example.com",
    phone: "+1 (555) 123-4567",
    experience: "5+ years in Software Development",
    education: "MS Computer Science, Stanford University",
    skills: ["React", "Node.js", "Python", "AWS", "Docker"]
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="modern-card h-fit">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            Resume Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasResume ? (
            <div className="space-y-4">
              <div className="p-4 bg-accent/30 rounded-lg border border-border">
                <h3 className="font-semibold text-lg mb-2">{mockResumeData.name}</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div>{mockResumeData.email}</div>
                  <div>{mockResumeData.phone}</div>
                  <div className="pt-2 border-t border-border">
                    <div className="font-medium text-foreground mb-1">Experience</div>
                    <div>{mockResumeData.experience}</div>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <div className="font-medium text-foreground mb-1">Education</div>
                    <div>{mockResumeData.education}</div>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <div className="font-medium text-foreground mb-1">Skills</div>
                    <div className="flex flex-wrap gap-1">
                      {mockResumeData.skills.map((skill, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Link to="/builder" className="flex-1">
                  <Button variant="outline" className="w-full rounded-xl">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <Button className="flex-1 rounded-xl">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto">
                <Plus className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <div className="font-medium mb-2">Create Your Professional Resume</div>
                <div className="text-sm text-muted-foreground mb-4">
                  Build a standout resume with our AI-powered builder
                </div>
                <Link to="/builder">
                  <Button className="w-full rounded-xl">
                    <Plus className="w-4 h-4 mr-2" />
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

export default ResumePreviewCard;
