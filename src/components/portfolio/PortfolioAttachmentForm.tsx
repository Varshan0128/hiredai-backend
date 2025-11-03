
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { ResumeData } from '@/pages/Builder';
import PortfolioHeader from './PortfolioHeader';
import PortfolioItemForm from './PortfolioItemForm';
import FilesTab from './FilesTab';
import ExperienceTab from './ExperienceTab';
import PortfolioItemsTab from './PortfolioItemsTab';
import PortfolioLinkedInAnalyzer from './PortfolioLinkedInAnalyzer';
import { useBreakpoint } from '@/hooks/use-mobile';

interface PortfolioAttachmentFormProps {
  onNext: () => void;
  onPrev: () => void;
  data: ResumeData;
  updateData: (data: Partial<ResumeData>) => void;
}

const PortfolioAttachmentForm: React.FC<PortfolioAttachmentFormProps> = ({
  onNext,
  onPrev,
  data,
  updateData
}) => {
  const [activeTab, setActiveTab] = useState('files');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const breakpoint = useBreakpoint();
  const isMobileView = breakpoint === 'mobile';

  const handleSavePortfolioItem = (item: any) => {
    const portfolioItems = [...(data.portfolioItems || [])];
    
    // Check if item already exists (for editing)
    const existingIndex = portfolioItems.findIndex(i => i.id === item.id);
    
    if (existingIndex >= 0) {
      portfolioItems[existingIndex] = item;
    } else {
      portfolioItems.push(item);
    }
    
    updateData({ portfolioItems });
    setIsAddingItem(false);
  };
  
  const handleCancelAddItem = () => {
    setIsAddingItem(false);
  };
  
  const handleFeedbackApply = (field: string, value: string) => {
    const fieldParts = field.split('.');
    
    if (fieldParts.length === 1) {
      updateData({ [field]: value });
    } else if (fieldParts.length === 3) {
      const [section, indexStr, subfield] = fieldParts;
      const index = parseInt(indexStr.replace(/[^\d]/g, ''), 10);
      
      if (!isNaN(index) && data[section as keyof ResumeData]) {
        const items = [...(data[section as keyof ResumeData] as any[])];
        items[index] = { ...items[index], [subfield]: value };
        updateData({ [section]: items });
      }
    }
  };
  
  if (isAddingItem) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <PortfolioItemForm
          onSave={handleSavePortfolioItem}
          onCancel={handleCancelAddItem}
          skills={data.skills || []}
        />
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <PortfolioHeader 
        data={data}
        onAddItem={() => setIsAddingItem(true)}
      />
      
      <Tabs 
        defaultValue="files" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="items">Portfolio Items</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="analyzer">Analyzer</TabsTrigger>
        </TabsList>
        
        <FilesTab data={data} updateData={updateData} />
        <PortfolioItemsTab data={data} />
        <ExperienceTab data={data} />
        <TabsContent value="analyzer" className="mt-6">
          <PortfolioLinkedInAnalyzer 
            resumeData={data}
            onApplySuggestion={handleFeedbackApply}
          />
        </TabsContent>
      </Tabs>
      
      {!isMobileView && (
        <div className="flex justify-between mt-8">
          <Button type="button" onClick={onPrev} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button type="button" onClick={onNext}>
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default PortfolioAttachmentForm;
