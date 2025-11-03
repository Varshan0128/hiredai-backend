
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Building, GraduationCap, Award, Calendar } from 'lucide-react';
import { ResumeData } from '@/pages/Builder';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

interface ExperienceTabProps {
  data: ResumeData;
}

const ExperienceTab: React.FC<ExperienceTabProps> = ({ data }) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };
  
  const hasNoExperienceData = 
    (!data.experience || data.experience.length === 0) && 
    (!data.education || data.education.length === 0) && 
    (!data.certifications || data.certifications.length === 0);
  
  return (
    <TabsContent value="experience" className="space-y-8">
      {hasNoExperienceData ? (
        <motion.div 
          className="text-center py-16 bg-muted/10 rounded-2xl border border-dashed border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Building className="w-16 h-16 mx-auto text-muted-foreground/60 mb-4" />
          <h3 className="text-xl font-medium">No Experience Data</h3>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Add your work experience, education, or certifications to showcase your professional journey.
          </p>
        </motion.div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Work Experience Section */}
          {data.experience && data.experience.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-semibold">Work Experience</h3>
              </div>
              
              <div className="space-y-4">
                {data.experience.map((exp, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Card className="overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all duration-300">
                      <CardHeader className="pb-2 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div>
                          <h4 className="text-lg font-semibold">{exp.position}</h4>
                          <p className="text-muted-foreground">{exp.company}</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{exp.startDate} - {exp.endDate}</span>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        {exp.description && <p className="text-sm mb-4">{exp.description}</p>}
                        
                        {exp.achievements && exp.achievements.length > 0 && (
                          <div className="space-y-2">
                            <h5 className="text-sm font-medium">Key Achievements:</h5>
                            <ul className="space-y-1">
                              {exp.achievements.map((achievement, i) => (
                                <li key={i} className="text-sm flex items-start gap-2">
                                  <Award className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                  <span>{achievement}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          
          {/* Education Section */}
          {data.education && data.education.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-semibold">Education</h3>
              </div>
              
              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Card className="overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all duration-300">
                      <CardHeader className="pb-2 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div>
                          <h4 className="text-lg font-semibold">{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</h4>
                          <p className="text-muted-foreground">{edu.institution}</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{edu.startDate} - {edu.endDate}</span>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        {edu.description && <p className="text-sm">{edu.description}</p>}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          
          {/* Skills Section */}
          {data.skills && data.skills.length > 0 && data.skillLevel && Object.keys(data.skillLevel).length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/>
                  <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
                  <path d="M12 2v2"/>
                  <path d="M12 22v-2"/>
                  <path d="m17 20.66-1-1.73"/>
                  <path d="M11 10.27 7 3.34"/>
                  <path d="m20.66 17-1.73-1"/>
                  <path d="m3.34 7 1.73 1"/>
                  <path d="M14 12h8"/>
                  <path d="M2 12h2"/>
                  <path d="m20.66 7-1.73 1"/>
                  <path d="m3.34 17 1.73-1"/>
                  <path d="m17 3.34-1 1.73"/>
                  <path d="m11 13.73-4 6.93"/>
                </svg>
                <h3 className="text-xl font-semibold">Skills</h3>
              </div>
              
              <Card className="border border-gray-100 dark:border-gray-800 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.skills.map((skill, index) => (
                    data.skillLevel && data.skillLevel[skill] ? (
                      <motion.div 
                        key={index} 
                        variants={itemVariants} 
                        className="space-y-1"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{skill}</span>
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
                            {data.skillLevel[skill]}/5
                          </Badge>
                        </div>
                        <Progress value={data.skillLevel[skill] * 20} className="h-2" />
                      </motion.div>
                    ) : null
                  ))}
                </div>
              </Card>
            </div>
          )}
          
          {/* Certifications Section */}
          {data.certifications && data.certifications.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-semibold">Certifications</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.certifications.map((cert, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Card className="overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all duration-300 h-full">
                      <CardHeader className="pb-2">
                        <h4 className="text-lg font-semibold">{cert.name}</h4>
                        <p className="text-muted-foreground">{cert.issuer}</p>
                      </CardHeader>
                      
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-1.5 text-sm">
                          <Badge variant="outline" className="bg-primary/5 border-primary/10">
                            <Calendar className="w-3 h-3 mr-1" />
                            Issued: {cert.date}
                          </Badge>
                          
                          {cert.expires && (
                            <Badge variant="outline" className="bg-muted">
                              Expires: {cert.expires}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </TabsContent>
  );
};

export default ExperienceTab;
