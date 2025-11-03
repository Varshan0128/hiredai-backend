
import React, { useState } from 'react';
import { Wand2, RefreshCw, Palette, Layout, Download, Briefcase, Code, Camera, ChartBar, PenTool } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { PortfolioTheme, PortfolioLayout, PortfolioFormat } from '@/types/portfolio';
import { ResumeData } from '@/pages/Builder';

interface AIPortfolioGeneratorProps {
  resumeData: ResumeData;
  onGenerate: (theme: PortfolioTheme, layout: PortfolioLayout, format: PortfolioFormat) => void;
  isGenerating: boolean;
  className?: string;
}

const AIPortfolioGenerator: React.FC<AIPortfolioGeneratorProps> = ({ 
  resumeData, 
  onGenerate,
  isGenerating,
  className
}) => {
  const [theme, setTheme] = useState<PortfolioTheme>('professional');
  const [layout, setLayout] = useState<PortfolioLayout>('card');
  const [format, setFormat] = useState<PortfolioFormat>('pdf');
  
  // Automatically suggest a theme based on skills and projects
  React.useEffect(() => {
    if (resumeData.skills?.length > 0 || resumeData.projects?.length > 0) {
      const allSkills = resumeData.skills || [];
      const allProjects = resumeData.projects || [];
      
      // Look for patterns in skills and projects
      const techTerms = ['programming', 'coding', 'development', 'javascript', 'python', 'react', 'java', 'software'];
      const creativeTerms = ['design', 'creative', 'ui', 'ux', 'photoshop', 'illustrator', 'animation'];
      const minimalTerms = ['analytics', 'research', 'data', 'finance', 'accounting', 'business'];
      const boldTerms = ['marketing', 'sales', 'leadership', 'management', 'entrepreneurship'];
      
      const skillsText = allSkills.join(' ').toLowerCase();
      const projectsText = allProjects.map(p => `${p.title} ${p.description}`).join(' ').toLowerCase();
      const allText = `${skillsText} ${projectsText}`;
      
      if (techTerms.some(term => allText.includes(term))) {
        setTheme('tech');
      } else if (creativeTerms.some(term => allText.includes(term))) {
        setTheme('creative');
      } else if (minimalTerms.some(term => allText.includes(term))) {
        setTheme('minimal');
      } else if (boldTerms.some(term => allText.includes(term))) {
        setTheme('bold');
      }
    }
  }, [resumeData]);
  
  const handleGenerate = () => {
    if (isGenerating) return;
    
    // Check if there's enough data to generate a portfolio
    if (!resumeData.fullName) {
      toast.error('Please provide your name in Step 1 before generating a portfolio');
      return;
    }
    
    if (!resumeData.skills || resumeData.skills.length === 0) {
      toast.warning('Adding skills in Step 3 will improve your portfolio');
    }
    
    onGenerate(theme, layout, format);
    toast.success('Generating your professional portfolio...');
  };
  
  // Get theme icon based on selection
  const getThemeIcon = (selectedTheme: PortfolioTheme) => {
    switch (selectedTheme) {
      case 'professional':
        return <Briefcase className="w-4 h-4" />;
      case 'creative':
        return <PenTool className="w-4 h-4" />;
      case 'minimal':
        return <Camera className="w-4 h-4" />;
      case 'bold':
        return <ChartBar className="w-4 h-4" />;
      case 'tech':
        return <Code className="w-4 h-4" />;
      default:
        return <Palette className="w-4 h-4" />;
    }
  };
  
  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-4">Generate Professional Portfolio</h3>
        <p className="text-muted-foreground mb-6">
          Let our AI create a stunning portfolio based on your resume information. Choose your preferred style and format.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label htmlFor="theme" className="block text-sm font-medium mb-2">
              <Palette className="w-4 h-4 inline mr-1" /> Portfolio Theme
            </label>
            <Select 
              value={theme} 
              onValueChange={(value) => setTheme(value as PortfolioTheme)}
            >
              <SelectTrigger id="theme">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional" className="flex items-center">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-500" /> 
                    <span>Professional</span>
                  </div>
                </SelectItem>
                <SelectItem value="creative">
                  <div className="flex items-center gap-2">
                    <PenTool className="w-4 h-4 text-purple-500" />
                    <span>Creative</span>
                  </div>
                </SelectItem>
                <SelectItem value="minimal">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-gray-500" />
                    <span>Minimal</span>
                  </div>
                </SelectItem>
                <SelectItem value="bold">
                  <div className="flex items-center gap-2">
                    <ChartBar className="w-4 h-4 text-red-500" />
                    <span>Bold</span>
                  </div>
                </SelectItem>
                <SelectItem value="tech">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-emerald-500" />
                    <span>Tech-focused</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="layout" className="block text-sm font-medium mb-2">
              <Layout className="w-4 h-4 inline mr-1" /> Layout Style
            </label>
            <Select 
              value={layout} 
              onValueChange={(value) => setLayout(value as PortfolioLayout)}
            >
              <SelectTrigger id="layout">
                <SelectValue placeholder="Select layout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">Card View</SelectItem>
                <SelectItem value="grid">Grid Layout</SelectItem>
                <SelectItem value="list">List Style</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="format" className="block text-sm font-medium mb-2">
              <Download className="w-4 h-4 inline mr-1" /> Export Format
            </label>
            <Select 
              value={format} 
              onValueChange={(value) => setFormat(value as PortfolioFormat)}
            >
              <SelectTrigger id="format">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF Document</SelectItem>
                <SelectItem value="pptx">PowerPoint</SelectItem>
                <SelectItem value="png">PNG Image</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full py-6 relative overflow-hidden group"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Creating Your Professional Portfolio...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5 mr-2 group-hover:animate-bounce" />
              Generate My Portfolio
            </>
          )}
          
          <span className="absolute bottom-0 left-0 w-full h-1 bg-primary/20 overflow-hidden">
            {isGenerating && (
              <span className="absolute h-full bg-primary animate-progress" style={{ width: '100%' }}></span>
            )}
          </span>
        </Button>
      </CardContent>
    </Card>
  );
};

export default AIPortfolioGenerator;
