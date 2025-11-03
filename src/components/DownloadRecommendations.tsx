
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, FileText, Download, Share2, Mail, Copy, CheckCircle, PresentationIcon, RefreshCw, FileDown, Linkedin, Printer, FileImage, FileIcon, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import AnimatedButton from './AnimatedButton';
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { ResumeData } from '@/pages/Builder';
import { downloadResume, copyResumeLink, shareViaEmail, printResume } from '@/utils/downloadUtils';
import { getTemplateById } from '@/services/templateService';

interface DownloadRecommendationsProps {
  onNext: () => void;
  onPrev: () => void;
  data: ResumeData;
}

interface DownloadOption {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  mimeType: string;
  color: string;
}

const DownloadRecommendations: React.FC<DownloadRecommendationsProps> = ({ 
  onNext, 
  onPrev,
  data 
}) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeFormat, setActiveFormat] = useState<string | null>(null);
  
  const downloadOptions: DownloadOption[] = [
    {
      id: 'pdf',
      title: 'PDF',
      icon: <FileText className="w-8 h-8" />,
      description: 'Best for most job applications. Compatible with ATS systems.',
      mimeType: 'application/pdf',
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'docx',
      title: 'Word Document',
      icon: <FileIcon className="w-8 h-8" />,
      description: 'Editable format for making quick changes.',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'pptx',
      title: 'PowerPoint',
      icon: <PresentationIcon className="w-8 h-8" />,
      description: 'For presentations and sharing in meetings.',
      mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'png',
      title: 'Image (PNG)',
      icon: <FileImage className="w-8 h-8" />,
      description: 'High-quality image format for sharing on social media.',
      mimeType: 'image/png',
      color: 'from-purple-500 to-purple-600'
    }
  ];
  
  const handleDownload = (format: string) => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    setActiveFormat(format);
    
    // Add a slight delay to ensure the UI has time to update before download starts
    setTimeout(async () => {
      try {
        // Make sure we're using the async downloadResume function correctly
        await downloadResume(data, format);
        console.log(`Download initiated for format: ${format}`);
        toast.success(`Your resume is being downloaded as ${format.toUpperCase()}`);
      } catch (error) {
        console.error('Error in download handler:', error);
        toast.error(`Failed to download as ${format.toUpperCase()}`);
      } finally {
        // Reset the downloading state after a longer delay to ensure user sees feedback
        setTimeout(() => {
          setIsDownloading(false);
          setActiveFormat(null);
        }, 1500);
      }
    }, 500);
  };
  
  const handleCopyLink = async () => {
    if (isDownloading) return;
    
    await copyResumeLink();
    // Set copied state directly, since copyResumeLink handles success/error internally
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleEmailResume = () => {
    if (isDownloading) return;
    shareViaEmail(data);
  };
  
  const handlePrintResume = () => {
    if (isDownloading) return;
    printResume(data);
  };
  
  const handleOpenTemplateLink = () => {
    if (!data.selectedTemplate) {
      toast.error("No template selected");
      return;
    }
    
    const templateId = parseInt(data.selectedTemplate);
    const template = getTemplateById(templateId);
    
    if (template && template.externalLink) {
      window.open(template.externalLink, '_blank');
      toast.success(`Opening ${template.name} template on Overleaf`);
    } else {
      toast.error("Template link not available");
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Resume creation complete! You're all set.");
    onNext();
  };

  // Get the selected template name
  const getSelectedTemplateName = () => {
    if (!data.selectedTemplate) return "Default Template";
    const template = getTemplateById(parseInt(data.selectedTemplate));
    return template ? template.name : "Custom Template";
  };

  // Animation variants for staggered animations
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
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 260, damping: 20 }
    }
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
          <motion.div
            className="inline-flex mb-4 p-3 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20 
            }}
          >
            <FileDown className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h2 
            className="text-3xl font-bold mb-2 text-foreground"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Download Your Resume
          </motion.h2>
          <motion.p 
            className="text-muted-foreground text-balance max-w-md mx-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Export your resume in multiple formats to use for your job applications.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-3"
          >
            <span className="text-sm font-medium">
              Selected Template: <span className="text-primary">{getSelectedTemplateName()}</span>
            </span>
            <Button 
              variant="link" 
              className="text-sm px-2 py-0 h-auto" 
              onClick={handleOpenTemplateLink}
            >
              View on Overleaf <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </motion.div>
        </div>
        
        <Card className="mb-6 overflow-hidden border-0 shadow-lg">
          <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-5">Download Options</h3>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {downloadOptions.map((option) => (
                <motion.div key={option.id} variants={itemVariants}>
                  <Card 
                    className={`border ${activeFormat === option.id ? 'border-primary shadow-md' : 'hover:border-primary/50'} 
                    transition-all duration-300 cursor-pointer overflow-hidden hover:shadow-md transform hover:scale-[1.02] 
                    ${isDownloading && activeFormat !== option.id ? 'opacity-60 pointer-events-none' : ''}`}
                    onClick={() => !isDownloading && handleDownload(option.id)}
                  >
                    <CardContent className="p-0">
                      <div className={`h-2 bg-gradient-to-r ${option.color}`}></div>
                      <div className="p-4 flex items-center">
                        <div className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center 
                          bg-gradient-to-br ${option.color} text-white mr-4`}>
                          {activeFormat === option.id ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                              <RefreshCw className="w-6 h-6" />
                            </motion.div>
                          ) : (
                            option.icon
                          )}
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-medium text-lg">{option.title}</h4>
                          <p className="text-xs text-muted-foreground">{option.description}</p>
                          {activeFormat === option.id && (
                            <div className="mt-1 text-primary text-xs font-medium animate-pulse">
                              Preparing download...
                            </div>
                          )}
                        </div>
                        <div className="flex-shrink-0 ml-2">
                          <Download className={`w-5 h-5 ${activeFormat === option.id ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div 
              className="flex flex-col md:flex-row gap-4 mt-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="flex-1">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2 py-6 hover:bg-muted/20 transition-all border-2"
                  onClick={handleCopyLink}
                  disabled={isDownloading}
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-500" /> 
                      <span className="text-green-600 font-medium">Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" /> Copy Resume Link
                    </>
                  )}
                </Button>
              </motion.div>
              
              <motion.div variants={itemVariants} className="flex-1">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2 py-6 hover:bg-muted/20 transition-all border-2"
                  onClick={handleEmailResume}
                  disabled={isDownloading}
                >
                  <Mail className="w-5 h-5" /> Email Resume
                </Button>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-0 shadow-lg">
          <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-5">Additional Options</h3>
            
            <motion.div 
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <Card className="overflow-hidden hover:shadow-md transition-all">
                  <CardContent className="p-0">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="w-full flex items-center gap-4 p-5 h-auto justify-start hover:bg-muted/20"
                      onClick={handlePrintResume}
                      disabled={isDownloading}
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <Printer className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-medium mb-1">Print Resume</h4>
                        <p className="text-xs text-muted-foreground">Print a physical copy of your resume</p>
                      </div>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Card className="overflow-hidden hover:shadow-md transition-all">
                  <CardContent className="p-0">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="w-full flex items-center gap-4 p-5 h-auto justify-start hover:bg-muted/20"
                      onClick={() => window.open('https://www.linkedin.com/profile/add', '_blank')}
                      disabled={isDownloading}
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Linkedin className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-medium mb-1">Import to LinkedIn</h4>
                        <p className="text-xs text-muted-foreground">Update your LinkedIn profile with this resume</p>
                      </div>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Card className="overflow-hidden hover:shadow-md transition-all">
                  <CardContent className="p-0">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="w-full flex items-center gap-4 p-5 h-auto justify-start hover:bg-muted/20"
                      onClick={() => window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(window.location.href), '_blank')}
                      disabled={isDownloading}
                    >
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Share2 className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-medium mb-1">Share on LinkedIn</h4>
                        <p className="text-xs text-muted-foreground">Let your network know you've updated your resume</p>
                      </div>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
        
        <motion.div 
          className="pt-6 flex justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button 
            type="button" 
            onClick={onPrev}
            variant="outline"
            className="flex items-center gap-2 border-2 hover:bg-muted/20"
            disabled={isDownloading}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          
          <AnimatedButton 
            type="submit" 
            variant="default" 
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md"
            disabled={isDownloading}
          >
            <span>Complete</span>
            <ArrowRight className="ml-2 w-4 h-4" />
          </AnimatedButton>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default DownloadRecommendations;

