
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Briefcase, FolderOpen, Building, BrainCircuit } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ResumeData } from '@/pages/Builder';
import { PortfolioFormat } from '@/types/portfolio';
import PortfolioHeader from './PortfolioHeader';
import PortfolioItemsTab from './PortfolioItemsTab';
import ExperienceTab from './ExperienceTab';
import FilesTab from './FilesTab';
import PortfolioActions from './PortfolioActions';
import { useNavigate } from 'react-router-dom';

interface PortfolioPreviewProps {
  data: ResumeData;
  onNext: () => void;
  onBackToEdit: () => void;
  hasPortfolioContent: boolean;
  format?: PortfolioFormat;
}

const PortfolioPreview: React.FC<PortfolioPreviewProps> = ({ 
  data, 
  onNext, 
  onBackToEdit,
  hasPortfolioContent,
  format = 'pdf'
}) => {
  const [previewTab, setPreviewTab] = useState('items');
  const navigate = useNavigate();
  
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
  
  // In preview mode we don't actually need to add items,
  // but we need to provide the prop to satisfy TypeScript.
  // This is a no-op function since we're in preview mode.
  const handleDummyAddItem = () => {
    // No-op function for preview mode
    console.log("Add item clicked in preview mode - this function does nothing by design");
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <Card className="p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-none shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold font-playfair">Portfolio Preview</h2>
            <Breadcrumb className="mt-1">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Resume Builder</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Portfolio</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink>Preview</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={onBackToEdit}
              className="flex items-center gap-2 border-gray-200"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Edit
            </Button>
            
            <Button
              variant="default"
              onClick={() => navigate('/interview-prep')}
              className="flex items-center gap-2"
            >
              <BrainCircuit className="w-4 h-4" /> Interview Prep
            </Button>
          </div>
        </div>
        
        {/* Header with user name and brief intro */}
        <motion.div variants={itemVariants}>
          <PortfolioHeader 
            data={data} 
            onAddItem={handleDummyAddItem} 
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Tabs defaultValue={previewTab} onValueChange={setPreviewTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6 bg-gray-100/80 dark:bg-gray-800/50 p-1 rounded-xl">
              <TabsTrigger 
                value="items" 
                className="flex items-center gap-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-lg py-2"
              >
                <Briefcase className="w-4 h-4" /> Portfolio
              </TabsTrigger>
              <TabsTrigger 
                value="experience"
                className="flex items-center gap-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-lg py-2"
              >
                <Building className="w-4 h-4" /> Experience
              </TabsTrigger>
              <TabsTrigger 
                value="files"
                className="flex items-center gap-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-lg py-2"
              >
                <FolderOpen className="w-4 h-4" /> Files
              </TabsTrigger>
            </TabsList>
            
            {/* Portfolio Items Tab */}
            <PortfolioItemsTab data={data} />
            
            {/* Experience Tab */}
            <ExperienceTab data={data} />
            
            {/* Files Tab */}
            <FilesTab data={data} />
          </Tabs>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <PortfolioActions 
            data={data}
            onNext={onNext}
            onBackToEdit={onBackToEdit}
            hasPortfolioContent={hasPortfolioContent}
            format={format}
          />
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default PortfolioPreview;
