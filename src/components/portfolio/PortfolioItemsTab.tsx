
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Briefcase, GraduationCap, Award, Folder, ExternalLink } from 'lucide-react';
import { ResumeData } from '@/pages/Builder';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface PortfolioItemsTabProps {
  data: ResumeData;
}

const PortfolioItemsTab: React.FC<PortfolioItemsTabProps> = ({ data }) => {
  // Animation variants for staggered entries
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
  
  // Group portfolio items by category
  const groupedItems = data.portfolioItems?.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, typeof data.portfolioItems>);
  
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'project':
        return <Briefcase className="w-5 h-5" />;
      case 'education':
        return <GraduationCap className="w-5 h-5" />;
      case 'achievement':
        return <Award className="w-5 h-5" />;
      default:
        return <Folder className="w-5 h-5" />;
    }
  };
  
  // Function to determine card theme based on project title or content
  const getCardTheme = (item: any) => {
    const title = item.title?.toLowerCase() || '';
    const desc = item.description?.toLowerCase() || '';
    const techs = item.technologies || [];
    
    // Check for design-related projects
    if (
      title.includes('design') || 
      desc.includes('design') || 
      techs.some((t: string) => ['figma', 'sketch', 'photoshop', 'ui', 'ux'].includes(t.toLowerCase()))
    ) {
      return "from-purple-600/10 to-pink-400/5";
    }
    
    // Check for web development projects
    if (
      title.includes('web') || 
      desc.includes('web') || 
      techs.some((t: string) => ['react', 'angular', 'vue', 'javascript', 'html', 'css'].includes(t.toLowerCase()))
    ) {
      return "from-blue-600/10 to-cyan-400/5";
    }
    
    // Check for mobile projects
    if (
      title.includes('mobile') || 
      title.includes('app') || 
      desc.includes('mobile') || 
      desc.includes('app') || 
      techs.some((t: string) => ['swift', 'android', 'flutter', 'react native'].includes(t.toLowerCase()))
    ) {
      return "from-green-600/10 to-emerald-400/5";
    }
    
    // Check for data/ML projects
    if (
      title.includes('data') || 
      title.includes('ai') || 
      title.includes('machine learning') || 
      desc.includes('data') || 
      desc.includes('analytics') || 
      techs.some((t: string) => ['python', 'jupyter', 'pandas', 'tensorflow', 'ai'].includes(t.toLowerCase()))
    ) {
      return "from-amber-600/10 to-orange-400/5";
    }
    
    // Default theme
    return "from-primary/10 to-transparent";
  };
  
  return (
    <TabsContent value="items" className="space-y-8">
      {!groupedItems || Object.keys(groupedItems).length === 0 ? (
        <motion.div 
          className="text-center py-16 bg-muted/10 rounded-2xl border border-dashed border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Briefcase className="w-16 h-16 mx-auto text-muted-foreground/60 mb-4" />
          <h3 className="text-xl font-medium">No Portfolio Items</h3>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Add some projects, achievements, or other portfolio items to showcase your work.
          </p>
        </motion.div>
      ) : (
        Object.entries(groupedItems).map(([category, items]) => (
          <div key={category} className="space-y-4">
            <div className="flex items-center gap-2">
              {getCategoryIcon(category)}
              <h3 className="text-xl font-semibold">{category}</h3>
            </div>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {items.map((item) => (
                <motion.div key={item.id} variants={itemVariants}>
                  <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] border border-gray-100 dark:border-gray-800">
                    <CardHeader className={`bg-gradient-to-r ${getCardTheme(item)} pb-3`}>
                      <div className="flex justify-between items-start">
                        <h4 className="text-xl font-semibold tracking-tight">{item.title}</h4>
                        {item.date && (
                          <Badge variant="secondary" className="text-xs bg-white/80 dark:bg-gray-800/80">
                            {item.date}
                          </Badge>
                        )}
                      </div>
                      {item.role && (
                        <p className="text-sm text-muted-foreground">{item.role}</p>
                      )}
                    </CardHeader>
                    
                    <CardContent className="pt-4">
                      <p className="text-muted-foreground text-sm">{item.description}</p>
                      
                      {item.technologies && item.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {item.technologies.map((tech, idx) => (
                            <Badge key={idx} variant="outline" className="bg-primary/5 text-primary/80 border-primary/10 py-1">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                    
                    {item.link && (
                      <CardFooter className="pt-0">
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-primary hover:text-primary/80 hover:underline mt-2 text-sm font-medium"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" /> 
                          View Project
                        </a>
                      </CardFooter>
                    )}
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        ))
      )}
    </TabsContent>
  );
};

export default PortfolioItemsTab;
