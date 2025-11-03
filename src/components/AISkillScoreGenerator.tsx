import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Sparkles, Bot } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface AISkillScoreGeneratorProps {
  skills: string[];
  existingScores: Record<string, number>;
  onGenerate: (scores: Record<string, number>) => void;
}

const AISkillScoreGenerator: React.FC<AISkillScoreGeneratorProps> = ({
  skills,
  existingScores,
  onGenerate
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleGenerateScores = () => {
    if (isGenerating || skills.length === 0) return;
    
    setIsGenerating(true);
    toast.info("Analyzing skills to generate proficiency scores...");
    
    // Simulate AI processing time
    setTimeout(() => {
      // Generate mock AI scores between 2.5 and 5.0
      // In a real implementation, this would use actual AI to assess skill levels
      const generatedScores: Record<string, number> = {};
      
      skills.forEach(skill => {
        // If there's an existing score, slightly adjust it rather than completely replacing
        if (existingScores[skill]) {
          // Add or subtract up to 0.5 points from existing score, but keep within 1.0-5.0 range
          const adjustment = (Math.random() - 0.5) * 1.0;
          const newScore = Math.max(1.0, Math.min(5.0, existingScores[skill] + adjustment));
          generatedScores[skill] = parseFloat(newScore.toFixed(1));
        } else {
          // For new skills, generate scores between 2.5 and 5.0
          // This approach gives more realistic and varied scores
          const baseScore = 2.5 + Math.random() * 2.5;
          generatedScores[skill] = parseFloat(baseScore.toFixed(1));
        }
      });
      
      // Call the parent component's callback with the generated scores
      onGenerate(generatedScores);
      setIsGenerating(false);
      
      toast.success("Skill proficiency scores generated successfully!");
    }, 1500);
  };
  
  if (skills.length === 0) {
    return null;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-medium">AI Skill Assessment</h3>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 gap-1.5"
              onClick={handleGenerateScores}
              disabled={isGenerating || skills.length === 0}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Generate Scores</span>
                </>
              )}
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-2">
            Our AI will analyze your skills and generate proficiency scores to enhance your resume's effectiveness.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AISkillScoreGenerator;
