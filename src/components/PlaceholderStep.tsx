
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PlaceholderStepProps {
  stepNumber: number;
  onNext: () => void;
  onPrev: () => void;
}

const PlaceholderStep: React.FC<PlaceholderStepProps> = ({ 
  stepNumber, 
  onNext, 
  onPrev 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full mx-auto text-center"
    >
      <Card className="p-6 border-2 border-dashed border-primary/30 bg-primary/5">
        <CardContent className="pt-6 space-y-6">
          <CheckCircle className="w-16 h-16 mx-auto text-primary/50" />
          <h2 className="text-2xl font-bold">Step {stepNumber}</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            This step is a placeholder and will be implemented soon.
          </p>
          
          <div className="flex justify-between pt-8">
            <Button 
              onClick={onPrev}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            
            <Button 
              onClick={onNext}
              variant="default"
              className="flex items-center gap-2"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PlaceholderStep;
