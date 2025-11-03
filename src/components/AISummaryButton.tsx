
import React from 'react';
import { Button } from "@/components/ui/button";
import { Bot, Loader2, Sparkles } from 'lucide-react';
import { useAISummary } from '@/hooks/useAISummary';
import { ResumeData } from '@/pages/Builder';

interface AISummaryButtonProps {
  resumeData: ResumeData;
  onSummaryGenerated: (summary: string) => void;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

const AISummaryButton: React.FC<AISummaryButtonProps> = ({
  resumeData,
  onSummaryGenerated,
  variant = "outline",
  size = "sm",
  className = ""
}) => {
  const { generateSummary, isGenerating } = useAISummary();

  const handleGenerateSummary = async () => {
    const summary = await generateSummary(resumeData);
    if (summary) {
      onSummaryGenerated(summary);
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleGenerateSummary}
      disabled={isGenerating}
      className={`flex items-center gap-2 rounded-xl transition-all duration-300 ${className}`}
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Generating...</span>
        </>
      ) : (
        <>
          <div className="relative">
            <Bot className="w-4 h-4" />
            <Sparkles className="w-2 h-2 absolute -top-1 -right-1 text-primary animate-pulse" />
          </div>
          <span>Generate AI Summary</span>
        </>
      )}
    </Button>
  );
};

export default AISummaryButton;
