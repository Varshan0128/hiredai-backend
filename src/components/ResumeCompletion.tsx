
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Download, RefreshCw, FileText, File, ImageIcon, LinkedinIcon, Mail, Copy, Printer, CheckIcon, PresentationIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ResumeData } from '@/pages/Builder';
import { toast } from "sonner";
import { downloadResume, printResume, shareViaEmail, copyResumeLink } from '@/utils/downloadUtils';

interface ResumeCompletionProps {
  onReset: () => void;
  data: ResumeData;
}

const ResumeCompletion: React.FC<ResumeCompletionProps> = ({ 
  onReset,
  data 
}) => {
  const [downloadFormat, setDownloadFormat] = useState<'pdf' | 'docx' | 'pptx' | 'png'>('pdf');
  const [isDownloading, setIsDownloading] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  
  // Get user's name from data for personalization
  const userName = data.fullName ? data.fullName.split(' ')[0] : 'there';
  
  const handleDownload = () => {
    setIsDownloading(true);
    
    try {
      // Use our utility function to download the resume
      downloadResume(data, downloadFormat);
    } finally {
      // Reset the downloading state after a short delay
      setTimeout(() => setIsDownloading(false), 1000);
    }
  };
  
  const handleCopyLink = async () => {
    await copyResumeLink();
    // Set copied state directly, since copyResumeLink handles success/error internally
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };
  
  const handleShare = (platform: string) => {
    if (platform === 'Email') {
      shareViaEmail(data);
    } else {
      // For other platforms, just show a toast for now
      toast.success(`Shared resume on ${platform}`);
    }
  };
  
  const handlePrint = () => {
    printResume(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="text-center py-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
        </motion.div>
        
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-3xl font-bold text-foreground mb-2"
        >
          Congratulations, {userName}!
        </motion.h2>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-muted-foreground text-balance max-w-md mx-auto mb-8"
        >
          Your professional resume is ready. Download it in your preferred format or share it directly with recruiters.
        </motion.p>
      </div>
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Download Your Resume</h3>
          
          <Tabs defaultValue="pdf" onValueChange={(value) => setDownloadFormat(value as 'pdf' | 'docx' | 'pptx' | 'png')}>
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="pdf" className="flex items-center gap-1">
                <FileText className="w-4 h-4" /> PDF
              </TabsTrigger>
              <TabsTrigger value="docx" className="flex items-center gap-1">
                <File className="w-4 h-4" /> DOCX
              </TabsTrigger>
              <TabsTrigger value="pptx" className="flex items-center gap-1">
                <PresentationIcon className="w-4 h-4" /> PPT
              </TabsTrigger>
              <TabsTrigger value="png" className="flex items-center gap-1">
                <ImageIcon className="w-4 h-4" /> PNG
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pdf">
              <div className="bg-muted/30 p-4 rounded-lg mb-4">
                <h4 className="text-sm font-medium mb-2">PDF Format</h4>
                <p className="text-sm text-muted-foreground">
                  Best for submitting to most job applications. Preserves formatting and is compatible with ATS systems.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="docx">
              <div className="bg-muted/30 p-4 rounded-lg mb-4">
                <h4 className="text-sm font-medium mb-2">Word Document (DOCX)</h4>
                <p className="text-sm text-muted-foreground">
                  Editable format that allows you to make quick changes. Compatible with Microsoft Word and other word processors.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="pptx">
              <div className="bg-muted/30 p-4 rounded-lg mb-4">
                <h4 className="text-sm font-medium mb-2">PowerPoint Presentation</h4>
                <p className="text-sm text-muted-foreground">
                  Perfect for showcasing your resume during interviews or presentations. Great for visual impact.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="png">
              <div className="bg-muted/30 p-4 rounded-lg mb-4">
                <h4 className="text-sm font-medium mb-2">Image Format (PNG)</h4>
                <p className="text-sm text-muted-foreground">
                  High-quality image format perfect for sharing on social media or embedding in presentations.
                </p>
              </div>
            </TabsContent>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full py-6 mt-2 text-lg"
              >
                {isDownloading ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </motion.span>
                    Preparing Download...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Download as {downloadFormat.toUpperCase()}
                  </>
                )}
              </Button>
            </motion.div>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Share Your Resume</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full py-4 flex flex-col items-center gap-2"
                    onClick={handlePrint}
                  >
                    <Printer className="w-6 h-6" />
                    <span className="text-xs">Print</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Print your resume</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full py-4 flex flex-col items-center gap-2"
                    onClick={() => handleShare('LinkedIn')}
                  >
                    <LinkedinIcon className="w-6 h-6" />
                    <span className="text-xs">LinkedIn</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share directly to LinkedIn</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full py-4 flex flex-col items-center gap-2"
                    onClick={() => handleShare('Email')}
                  >
                    <Mail className="w-6 h-6" />
                    <span className="text-xs">Email</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Send via email</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={`w-full py-4 flex flex-col items-center gap-2 ${linkCopied ? 'border-green-500 text-green-500' : ''}`}
                    onClick={handleCopyLink}
                  >
                    {linkCopied ? (
                      <CheckIcon className="w-6 h-6" />
                    ) : (
                      <Copy className="w-6 h-6" />
                    )}
                    <span className="text-xs">{linkCopied ? 'Copied!' : 'Copy Link'}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy shareable link</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center pb-6">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={onReset}
        >
          <RefreshCw className="w-4 h-4" /> Create a New Resume
        </Button>
      </div>
    </motion.div>
  );
};

export default ResumeCompletion;
