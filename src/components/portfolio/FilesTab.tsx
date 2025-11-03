
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { FolderOpen, Image, FileText, File } from 'lucide-react';
import { ResumeData } from '@/pages/Builder';
import { motion } from 'framer-motion';

interface FilesTabProps {
  data: ResumeData;
  updateData?: (data: Partial<ResumeData>) => void;
}

const FilesTab: React.FC<FilesTabProps> = ({ data, updateData }) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };
  
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) {
      return <Image className="w-10 h-10 text-primary/80" />;
    } else if (fileType.includes('pdf')) {
      return <FileText className="w-10 h-10 text-primary/80" />;
    } else {
      return <File className="w-10 h-10 text-primary/80" />;
    }
  };
  
  return (
    <TabsContent value="files" className="space-y-4">
      {data.portfolioFiles && data.portfolioFiles.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {data.portfolioFiles.map((file, index) => (
            <motion.div key={`${file.name}-${index}`} variants={itemVariants}>
              <Card className="overflow-hidden hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] border border-gray-100">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/5 rounded-xl p-3 flex items-center justify-center">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h4 className="font-medium truncate text-lg" title={file.name}>{file.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {(file.size / 1024).toFixed(1)} KB • {
                          file.type.split('/')[1]?.toUpperCase() || 'File'
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          className="text-center py-16 bg-muted/10 rounded-2xl border border-dashed border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <FolderOpen className="w-16 h-16 mx-auto text-muted-foreground/60 mb-4" />
          <h3 className="text-xl font-medium">No Files Uploaded</h3>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Upload files to your portfolio to showcase your work samples, certificates, 
            or other documents.
          </p>
        </motion.div>
      )}
    </TabsContent>
  );
};

export default FilesTab;
