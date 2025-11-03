
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface UploadResumeCardProps {
  onUpload?: (file: File) => void;
  hasResume?: boolean;
}

const UploadResumeCard: React.FC<UploadResumeCardProps> = ({ onUpload, hasResume = false }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      toast.error('Please upload a PDF file');
      return;
    }

    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      onUpload?.(file);
      toast.success('Resume uploaded successfully!');
    }, 2000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="modern-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              {hasResume ? (
                <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              ) : (
                <Upload className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              )}
            </div>
            {hasResume ? 'Resume Uploaded' : 'Upload Resume'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
              dragOver 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            {isUploading ? (
              <div className="space-y-2">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm text-muted-foreground">Uploading and analyzing...</p>
              </div>
            ) : hasResume ? (
              <div className="space-y-2">
                <FileText className="w-8 h-8 text-green-500 mx-auto" />
                <p className="text-sm font-medium">Resume uploaded successfully</p>
                <p className="text-xs text-muted-foreground">ATS score updated automatically</p>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
                <div>
                  <p className="text-sm font-medium mb-1">Drag & drop your resume here</p>
                  <p className="text-xs text-muted-foreground">or click to browse (PDF only)</p>
                </div>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileInput}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload">
                  <Button variant="outline" className="rounded-xl" asChild>
                    <span>Choose File</span>
                  </Button>
                </label>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UploadResumeCard;
