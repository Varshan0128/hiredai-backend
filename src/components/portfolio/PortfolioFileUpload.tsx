
import React from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface PortfolioFileUploadProps {
  portfolioFiles: File[];
  updatePortfolioFiles: (files: File[]) => void;
}

const PortfolioFileUpload: React.FC<PortfolioFileUploadProps> = ({ 
  portfolioFiles,
  updatePortfolioFiles 
}) => {
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      const updatedFiles = [...(portfolioFiles || []), ...fileArray];
      updatePortfolioFiles(updatedFiles);
      toast.success(`${fileArray.length} file(s) added to portfolio`);
    }
  };
  
  // Handle removing a file
  const handleRemoveFile = (fileToRemove: File) => {
    const updatedFiles = (portfolioFiles || []).filter(file => file !== fileToRemove);
    updatePortfolioFiles(updatedFiles);
    toast.success('File removed from portfolio');
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-4">Upload Files</h3>
        <div className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="portfolio-file" className="text-sm font-medium">
              Upload portfolio files (PDF, images, documents)
            </Label>
            <Input 
              id="portfolio-file"
              type="file" 
              multiple
              onChange={handleFileChange}
              className="cursor-pointer"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
          </div>
          
          {/* Display uploaded files */}
          <div className="space-y-2 mt-4">
            {portfolioFiles && portfolioFiles.length > 0 ? (
              portfolioFiles.map((file, index) => (
                <div 
                  key={`${file.name}-${index}`}
                  className="flex items-center gap-2 p-2 border rounded-md bg-secondary/20"
                >
                  <span className="text-sm flex-grow truncate">
                    {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemoveFile(file)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground italic">No files uploaded yet.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioFileUpload;
