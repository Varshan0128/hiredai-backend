
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileType, Share, Check } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AnimatedButton from '@/components/AnimatedButton';
import { ResumeData } from '@/pages/Builder';
import { PortfolioFormat } from '@/types/portfolio';
import { downloadPortfolio } from '@/utils/portfolioUtils';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Progress } from "@/components/ui/progress";
import { useIsMobile, useBreakpointValue } from '@/hooks/use-mobile';

interface PortfolioActionsProps {
  data: ResumeData;
  onNext: () => void;
  onBackToEdit: () => void;
  hasPortfolioContent: boolean;
  format?: PortfolioFormat;
}

const PortfolioActions: React.FC<PortfolioActionsProps> = ({
  data,
  onNext,
  onBackToEdit,
  hasPortfolioContent,
  format = 'pdf'
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<PortfolioFormat>(format);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const isMobile = useIsMobile();
  
  // More responsive design using the enhanced hooks
  const buttonSize = useBreakpointValue({
    mobile: "small",
    tablet: "medium",
    default: "medium"
  });
  
  const buttonWidth = useBreakpointValue({
    mobile: "full",
    tablet: "auto",
    default: "auto"
  });
  
  // Handle downloading portfolio
  const handleDownload = async () => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    setDownloadProgress(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setDownloadProgress(prev => {
        const newValue = prev + 20;
        return newValue > 100 ? 100 : newValue;
      });
    }, 200);
    
    try {
      await downloadPortfolio(data, selectedFormat);
      clearInterval(progressInterval);
      setDownloadProgress(100);
      
      // Reset after a moment
      setTimeout(() => {
        setDownloadProgress(0);
        setIsDownloading(false);
      }, 500);
    } catch (error) {
      console.error('Error downloading portfolio:', error);
      clearInterval(progressInterval);
      toast.error('Failed to download portfolio');
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const sharePortfolio = () => {
    // Use the Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: `${data.fullName}'s Portfolio`,
        text: 'Check out my professional portfolio',
        url: window.location.href,
      })
      .then(() => toast.success('Portfolio shared successfully'))
      .catch(error => {
        console.error('Error sharing:', error);
        toast.error('Could not share portfolio');
      });
    } else {
      toast.info('Sharing is not supported on this browser');
    }
  };

  return (
    <div className="pt-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="w-full sm:w-48">
            <Select
              value={selectedFormat}
              onValueChange={(value) => setSelectedFormat(value as PortfolioFormat)}
              disabled={isDownloading}
            >
              <SelectTrigger id="downloadFormat" className="w-full bg-white/80 border border-gray-200 shadow-sm hover:border-primary/50 transition-colors">
                <FileType className="w-4 h-4 mr-2 text-primary" />
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF Document</SelectItem>
                <SelectItem value="pptx">PowerPoint</SelectItem>
                <SelectItem value="png">PNG Images</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            variant="default" 
            onClick={handleDownload}
            className={`flex items-center gap-2 ${buttonWidth === "full" ? "w-full" : "w-auto"} bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all shadow-md hover:shadow-lg hover:translate-y-[-2px]`}
            disabled={isDownloading || !hasPortfolioContent}
            size={buttonSize === "small" ? "sm" : "default"}
          >
            {isDownloading ? (
              <>
                <Check className={`w-4 h-4 ${downloadProgress === 100 ? 'text-white' : 'hidden'}`} />
                <span className={downloadProgress === 100 ? 'text-white' : 'hidden'}>Downloaded</span>
                <span className={downloadProgress < 100 ? '' : 'hidden'}>Downloading...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                {isMobile ? 'Download' : `Download as ${selectedFormat.toUpperCase()}`}
              </>
            )}
          </Button>
          
          {isDownloading && downloadProgress > 0 && downloadProgress < 100 && (
            <div className="w-full sm:w-32">
              <Progress value={downloadProgress} className="h-2" />
            </div>
          )}
          
          <Button
            variant="outline"
            onClick={sharePortfolio}
            className={`flex items-center gap-2 ${buttonWidth === "full" ? "w-full" : "w-auto"} border-primary/20 hover:bg-primary/5 hover:border-primary/30 transition-all`}
            disabled={!hasPortfolioContent}
            size={buttonSize === "small" ? "sm" : "default"}
          >
            <Share className="w-4 h-4 text-primary" />
            {isMobile ? 'Share' : 'Share Portfolio'}
          </Button>
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button 
          variant="outline" 
          onClick={onBackToEdit}
          className="flex items-center gap-2 border-gray-200 hover:bg-gray-50 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Edit Portfolio
        </Button>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <AnimatedButton 
            type="button"
            variant="default"
            onClick={onNext}
            className="bg-[#ea384c] hover:bg-[#d0293d] text-white shadow-md hover:shadow-lg hover:shadow-[#ea384c]/20 transition-all"
          >
            <span>Continue</span>
            <ArrowLeft className="ml-2 w-4 h-4 rotate-180" />
          </AnimatedButton>
        </motion.div>
      </div>
    </div>
  );
};

export default PortfolioActions;
