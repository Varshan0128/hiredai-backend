
import React from 'react';
import { motion } from 'framer-motion';
import { Check, Copy, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface FeedbackSuggestionProps {
  title: string;
  originalText?: string;
  suggestedText: string;
  field: string;
  onApply: (field: string, value: string) => void;
}

const FeedbackSuggestion: React.FC<FeedbackSuggestionProps> = ({
  title,
  originalText,
  suggestedText,
  field,
  onApply
}) => {
  const [copied, setCopied] = React.useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(suggestedText);
    setCopied(true);
    toast.success("Suggestion copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleApply = () => {
    onApply(field, suggestedText);
    toast.success("Suggestion applied successfully");
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-4 border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
        <h4 className="text-base font-medium mb-2">{title}</h4>
        
        {originalText && (
          <div className="mb-3">
            <p className="text-sm text-muted-foreground mb-1">Original:</p>
            <div className="bg-muted/20 p-2 rounded text-sm">
              {originalText}
            </div>
          </div>
        )}
        
        <div>
          <p className="text-sm text-muted-foreground mb-1">Suggestion:</p>
          <div className="bg-primary/5 p-2 rounded text-sm border border-primary/10">
            {suggestedText}
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={handleApply}
            className="flex items-center gap-1 text-xs"
          >
            Apply
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default FeedbackSuggestion;
