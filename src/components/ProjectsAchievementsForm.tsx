import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Sparkles, Briefcase, ArrowLeft, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import { ResumeData } from '@/pages/Builder';
import { v4 as uuidv4 } from 'uuid';

interface ProjectsAchievementsFormProps {
  onNext: () => void;
  onPrev: () => void;
  data: ResumeData;
  updateData: (data: Partial<ResumeData>) => void;
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string;
  link?: string;
}

interface Achievement {
  title: string;
  date: string;
  description: string;
}

const ProjectsAchievementsForm: React.FC<ProjectsAchievementsFormProps> = ({ 
  onNext, 
  onPrev,
  data,
  updateData
}) => {
  const transformProjects = () => {
    if (!data.projects || data.projects.length === 0) {
      return [];
    }
    
    return data.projects.map(proj => ({
      id: proj.id || uuidv4(),
      title: proj.title || '',
      description: proj.description || '',
      technologies: Array.isArray(proj.technologies) ? proj.technologies.join(', ') : '',
      link: proj.link || ''
    }));
  };
  
  const transformAchievements = () => {
    if (!data.achievements || data.achievements.length === 0) {
      return [];
    }
    
    return data.achievements.map(ach => ({
      title: ach.title || '',
      date: ach.date || '',
      description: ach.description || ''
    }));
  };
  
  const [projects, setProjects] = useState<Project[]>(transformProjects());
  
  const [newProject, setNewProject] = useState<Project>({ 
    id: uuidv4(),
    title: '', 
    description: '', 
    technologies: '',
    link: ''
  });
  
  const [achievements, setAchievements] = useState<Achievement[]>(transformAchievements());
  
  const [newAchievement, setNewAchievement] = useState<Achievement>({
    title: '',
    date: '',
    description: ''
  });
  
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  const [expandedAchievement, setExpandedAchievement] = useState<number | null>(null);
  
  const handleAddProject = () => {
    if (newProject.title.trim() && newProject.description.trim()) {
      setProjects([...projects, { ...newProject, id: uuidv4() }]);
      setNewProject({ 
        id: uuidv4(),
        title: '', 
        description: '', 
        technologies: '',
        link: ''
      });
      toast.success('Project added');
    } else {
      toast.error('Project title and description are required');
    }
  };
  
  const handleRemoveProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
    toast('Project removed');
  };
  
  const handleAddAchievement = () => {
    if (newAchievement.title.trim()) {
      setAchievements([...achievements, { ...newAchievement }]);
      setNewAchievement({
        title: '',
        date: '',
        description: ''
      });
      toast.success('Achievement added');
    } else {
      toast.error('Achievement title is required');
    }
  };
  
  const handleRemoveAchievement = (index: number) => {
    setAchievements(achievements.filter((_, i) => i !== index));
    toast('Achievement removed');
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formattedProjects = projects.map(proj => ({
      id: proj.id,
      title: proj.title,
      description: proj.description,
      technologies: proj.technologies.split(',').map(tech => tech.trim()).filter(tech => tech !== ''),
      link: proj.link
    }));
    
    const formattedAchievements = achievements.map(ach => ({
      title: ach.title,
      date: ach.date,
      description: ach.description
    }));
    
    updateData({
      projects: formattedProjects,
      achievements: formattedAchievements
    });
    
    toast.success("Projects and achievements saved");
    onNext();
  };
  
  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-8">
          <motion.h2 
            className="text-2xl font-bold mb-2 text-foreground"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Projects & Achievements
          </motion.h2>
          <motion.p 
            className="text-muted-foreground text-balance max-w-md mx-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Showcase your notable projects and achievements to stand out to employers.
          </motion.p>
        </div>
        
        <motion.div 
          className="space-y-4"
          custom={0}
          initial="hidden"
          animate="visible"
          variants={inputVariants}
        >
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-medium">Projects</h3>
          </div>
          
          <Card className="border border-input">
            <CardContent className="pt-6 space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project-title">Project Title</Label>
                  <Input
                    id="project-title"
                    value={newProject.title}
                    onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                    placeholder=""
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="project-description">Description</Label>
                  <Textarea
                    id="project-description"
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    placeholder=""
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="project-technologies">Technologies Used</Label>
                  <Input
                    id="project-technologies"
                    value={newProject.technologies}
                    onChange={(e) => setNewProject({...newProject, technologies: e.target.value})}
                    placeholder=""
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="project-link">Project URL (optional)</Label>
                  <Input
                    id="project-link"
                    type="url"
                    value={newProject.link}
                    onChange={(e) => setNewProject({...newProject, link: e.target.value})}
                    placeholder=""
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    onClick={handleAddProject}
                    className="flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add Project
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-3">
            {projects.map((project, index) => (
              <Card key={index} className="bg-primary/5 border-primary/10">
                <CardContent className="py-4 px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5 text-primary flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">{project.title}</h4>
                        <p className="text-sm text-muted-foreground truncate max-w-[240px] md:max-w-xs">
                          {project.description.substring(0, 60)}{project.description.length > 60 ? '...' : ''}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setExpandedProject(expandedProject === index ? null : index)}
                        className="h-8 w-8 p-0"
                      >
                        {expandedProject === index ? 
                          <ChevronUp className="w-4 h-4" /> : 
                          <ChevronDown className="w-4 h-4" />
                        }
                      </Button>
                      
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveProject(index)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {expandedProject === index && (
                    <div className="mt-3 pt-3 border-t text-sm space-y-2">
                      <p className="whitespace-pre-line">{project.description}</p>
                      
                      {project.technologies && (
                        <div className="mt-2">
                          <span className="text-muted-foreground">Technologies: </span>
                          <span>{project.technologies}</span>
                        </div>
                      )}
                      
                      {project.link && (
                        <div>
                          <span className="text-muted-foreground">URL: </span>
                          <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate inline-block max-w-[240px] align-bottom">
                            {project.link}
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            {projects.length === 0 && (
              <p className="text-muted-foreground text-sm italic text-center py-2">No projects added yet</p>
            )}
          </div>
        </motion.div>
        
        <motion.div 
          className="space-y-4"
          custom={1}
          initial="hidden"
          animate="visible"
          variants={inputVariants}
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-medium">Achievements & Awards</h3>
          </div>
          
          <Card className="border border-input">
            <CardContent className="pt-6 space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="achievement-title">Achievement Title</Label>
                  <Input
                    id="achievement-title"
                    value={newAchievement.title}
                    onChange={(e) => setNewAchievement({...newAchievement, title: e.target.value})}
                    placeholder=""
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="achievement-date">Date</Label>
                  <Input
                    id="achievement-date"
                    type="month"
                    value={newAchievement.date}
                    onChange={(e) => setNewAchievement({...newAchievement, date: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="achievement-description">Description (optional)</Label>
                  <Textarea
                    id="achievement-description"
                    value={newAchievement.description}
                    onChange={(e) => setNewAchievement({...newAchievement, description: e.target.value})}
                    placeholder=""
                    rows={2}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    onClick={handleAddAchievement}
                    className="flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add Achievement
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-3">
            {achievements.map((achievement, index) => (
              <Card key={index} className="bg-primary/5 border-primary/10">
                <CardContent className="py-4 px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {achievement.date ? new Date(achievement.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'No date specified'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setExpandedAchievement(expandedAchievement === index ? null : index)}
                        className="h-8 w-8 p-0"
                      >
                        {expandedAchievement === index ? 
                          <ChevronUp className="w-4 h-4" /> : 
                          <ChevronDown className="w-4 h-4" />
                        }
                      </Button>
                      
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveAchievement(index)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {expandedAchievement === index && (
                    <div className="mt-3 pt-3 border-t text-sm">
                      {achievement.date && (
                        <div>
                          <span className="text-muted-foreground">Date: </span>
                          <span>{new Date(achievement.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
                        </div>
                      )}
                      
                      {achievement.description && (
                        <div className="mt-2">
                          <p className="whitespace-pre-line">{achievement.description}</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            {achievements.length === 0 && (
              <p className="text-muted-foreground text-sm italic text-center py-2">No achievements added yet</p>
            )}
          </div>
        </motion.div>
        
        <motion.div 
          className="pt-4 flex justify-between"
          custom={5}
          initial="hidden"
          animate="visible"
          variants={inputVariants}
        >
          <Button 
            type="button" 
            variant="outline"
            onClick={onPrev}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          
          <Button 
            type="submit"
            className="flex items-center gap-2"
          >
            Continue <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default ProjectsAchievementsForm;
