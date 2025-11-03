import React from 'react';
import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ResumeData } from '@/pages/Builder';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import SkillRating from '@/components/SkillRating';

interface PortfolioHeaderProps {
  data: ResumeData;
  resumeData?: ResumeData; // Added to maintain compatibility
  onAddItem: () => void;
}

const PortfolioHeader: React.FC<PortfolioHeaderProps> = ({ 
  data,
  resumeData,
  onAddItem 
}) => {
  // Use either data or resumeData (for backward compatibility)
  const activeData = resumeData || data;
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Determine theme color based on skills or job title
  const getThemeColors = () => {
    if (!activeData.skills || activeData.skills.length === 0) {
      return {
        from: 'from-primary/90',
        to: 'to-primary/70',
        accent: 'bg-yellow-400'
      };
    }

    // Check for tech-related skills
    const techSkills = ['javascript', 'react', 'node', 'python', 'java', 'coding', 'programming', 'developer'];
    const designSkills = ['design', 'ui', 'ux', 'photoshop', 'illustrator', 'figma', 'sketch'];
    const marketingSkills = ['marketing', 'seo', 'social media', 'content', 'advertising'];
    const financeSkills = ['finance', 'accounting', 'budget', 'financial'];
    
    const skillsLower = activeData.skills.map(s => s.toLowerCase());
    
    if (skillsLower.some(skill => techSkills.some(tech => skill.includes(tech)))) {
      return {
        from: 'from-blue-600/90',
        to: 'to-indigo-500/70',
        accent: 'bg-cyan-400'
      };
    } else if (skillsLower.some(skill => designSkills.some(design => skill.includes(design)))) {
      return {
        from: 'from-purple-600/90',
        to: 'to-pink-500/70',
        accent: 'bg-yellow-300'
      };
    } else if (skillsLower.some(skill => marketingSkills.some(marketing => skill.includes(marketing)))) {
      return {
        from: 'from-orange-500/90',
        to: 'to-pink-500/70',
        accent: 'bg-blue-300'
      };
    } else if (skillsLower.some(skill => financeSkills.some(finance => skill.includes(finance)))) {
      return {
        from: 'from-emerald-600/90',
        to: 'to-teal-500/70',
        accent: 'bg-amber-300'
      };
    }
    
    // Default theme
    return {
      from: 'from-primary/90',
      to: 'to-primary/70',
      accent: 'bg-yellow-400'
    };
  };

  const themeColors = getThemeColors();

  // Get top skills with ratings (if available)
  const getTopSkills = () => {
    if (!activeData.skills || activeData.skills.length === 0) return [];
    
    // If skill levels are available, sort skills by level (highest first)
    if (activeData.skillLevel && Object.keys(activeData.skillLevel).length > 0) {
      return [...activeData.skills].sort((a, b) => {
        const levelA = activeData.skillLevel?.[a] || 0;
        const levelB = activeData.skillLevel?.[b] || 0;
        return levelB - levelA;
      }).slice(0, 5);
    }
    
    // Otherwise just return first 5 skills
    return activeData.skills.slice(0, 5);
  };
  
  const topSkills = getTopSkills();
  const hasSkillLevels = activeData.skillLevel && Object.keys(activeData.skillLevel).length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden mb-6 border-none shadow-xl">
        <div className="relative">
          {/* Header Background with Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r ${themeColors.from} ${themeColors.to} mix-blend-multiply`} />
          
          {/* Abstract Pattern Background */}
          <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYtMi42ODYgNi02cy0yLjY4Ni02LTYtNmMtMy4zMTQgMC02IDIuNjg2LTYgNnMyLjY4NiA2IDYgNnptMCAzMGMzLjMxNCAwIDYtMi42ODYgNi02cy0yLjY4Ni02LTYtNmMtMy4zMTQgMC02IDIuNjg2LTYgNnMyLjY4NiA2IDYgNnptLTE4LTEyYzMuMzE0IDAgNi0yLjY4NiA2LTZzLTIuNjg2LTYtNi02Yy0zLjMxNCAwLTYgMi42ODYtNiA2czIuNjg2IDYgNiA2em0wLTE4YzMuMzE0IDAgNi0yLjY4NiA2LTZzLTIuNjg2LTYtNi02Yy0zLjMxNCAwLTYgMi42ODYtNiA2czIuNjg2IDYgNiA2em0wIDM2YzMuMzE0IDAgNi0yLjY4NiA2LTZzLTIuNjg2LTYtNi02Yy0zLjMxNCAwLTYgMi42ODYtNiA2czIuNjg2IDYgNiA2em0xOC0xMmMzLjMxNCAwIDYtMi42ODYgNi02cy0yLjY4Ni02LTYtNmMtMy4zMTQgMC02IDIuNjg2LTYgNnMyLjY4NiA2IDYgNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4yIi8+PHBhdGggZD0iTTEyIDYwYzMuMzE0IDAgNi0yLjY4NiA2LTZzLTIuNjg2LTYtNi02Yy0zLjMxNCAwLTYgMi42ODYtNiA2czIuNjg2IDYgNiA2em0wLTMwYzMuMzE0IDAgNi0yLjY4NiA2LTZzLTIuNjg2LTYtNi02Yy0zLjMxNCAwLTYgMi42ODYtNiA2czIuNjg2IDYgNiA2em0wLTE4YzMuMzE0IDAgNi0yLjY4NiA2LTZzLTIuNjg2LTYtNi02Yy0zLjMxNCAwLTYgMi42ODYtNiA2czIuNjg2IDYgNiA2em0zNi0xMmMzLjMxNCAwIDYtMi42ODYgNi02cy0yLjY4Ni02LTYtNmMtMy4zMTQgMC02IDIuNjg2LTYgNnMyLjY4NiA2IDYgNnptLTE4IDBoMTJWMEgzMHYxMnptMTggMzZ2LTEyaC02djZoLTZ2NmgxMnptMC0xOHYtMTJIMzZ2MTJoMTJ6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9Ii4xNSIvPjwvZz48L3N2Zz4=')]" />
          
          {/* Content */}
          <div className="relative p-8 sm:p-10 rounded-2xl">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
              {/* Avatar with Animations */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-white/30 blur-xl rounded-full transform scale-110"></div>
                <Avatar className="w-28 h-28 border-4 border-white shadow-2xl">
                  <AvatarImage src="/placeholder.svg" alt={activeData.fullName || 'User'} />
                  <AvatarFallback className="bg-primary/20 text-white font-bold text-2xl">
                    {activeData.fullName ? getInitials(activeData.fullName) : 'U'}
                  </AvatarFallback>
                </Avatar>
                {/* Decorative Circles */}
                <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full ${themeColors.accent} blur-[1px] opacity-70`}></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-blue-400 blur-[1px] opacity-70"></div>
              </motion.div>
              
              <div className="flex-1 text-center sm:text-left">
                {/* Name with Text Shadow */}
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-4xl sm:text-5xl font-bold font-playfair mb-2 text-white drop-shadow-lg"
                >
                  {activeData.fullName || 'Professional Portfolio'}
                </motion.h1>
                
                {/* Position/Job Title - Use experience[0].position as a fallback */}
                {activeData.experience && activeData.experience.length > 0 && activeData.experience[0].position && (
                  <motion.h2
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-xl font-medium text-white/90 mb-2"
                  >
                    {activeData.experience[0].position}
                  </motion.h2>
                )}
                
                {/* Highlight Line */}
                <motion.div 
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "100px", opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.7 }}
                  className="h-1 bg-white/60 rounded mb-4 hidden sm:block"
                ></motion.div>
                
                {/* Profile Summary */}
                {activeData.profileSummary && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="mt-2 text-white/90 max-w-2xl text-balance font-light text-sm sm:text-base"
                  >
                    {activeData.profileSummary}
                  </motion.p>
                )}
                
                {/* Skills with Staggered Animation and Ratings */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="flex flex-wrap gap-3 mt-4 justify-center sm:justify-start"
                >
                  {topSkills.map((skill, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex flex-col items-center sm:items-start"
                    >
                      <Badge variant="success" className="bg-white/20 backdrop-blur-sm text-white py-1 px-3 border border-white/30">
                        {skill}
                      </Badge>
                      
                      {/* Show rating if available */}
                      {hasSkillLevels && activeData.skillLevel && activeData.skillLevel[skill] > 0 && (
                        <div className="mt-1">
                          <SkillRating 
                            score={activeData.skillLevel[skill]} 
                            size="sm" 
                            className="bg-black/10 backdrop-blur-sm rounded-full px-1"
                          />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  
                  {activeData.skills && activeData.skills.length > 5 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + 5 * 0.1 }}
                    >
                      <Badge variant="outline" className="bg-white/10 text-white hover:bg-white/20 border-white/30">
                        +{activeData.skills.length - 5} more
                      </Badge>
                    </motion.div>
                  )}
                </motion.div>

                {/* Add Portfolio Item Button */}
                <div className="mt-4">
                  <Button onClick={onAddItem} className="bg-white/20 text-white hover:bg-white/30">
                    <Plus className="w-4 h-4 mr-2" /> Add Portfolio Item
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default PortfolioHeader;
