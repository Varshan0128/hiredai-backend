import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Target, BookOpen, Users } from "lucide-react";

interface TestResultsProps {
  result: {
    user_category?: string;
    category?: string;
    message?: string;
    next_step?: string;
  };
  onContinue: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  Realistic: Target,
  Elaborate: BookOpen,
  Short: Users,
};

const TestResults: React.FC<TestResultsProps> = ({ result, onContinue }) => {
  const category =
    result.category || result.user_category || "Unknown Category";
  const message =
    result.message ||
    "Your learning style could not be determined. Please try again.";
  const IconComponent = iconMap[category] || Brain;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 text-center">
      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gray-900 border border-gray-800 shadow-lg">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-purple-900/30 border border-purple-700">
                <IconComponent className="h-10 w-10 text-purple-400" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-purple-300">
              {category} Learner
            </CardTitle>
            <p className="text-gray-400 mt-2 max-w-md mx-auto">{message}</p>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mt-2">
              Your personalized learning path will be tailored to match your
              strengths and goals.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          onClick={onContinue}
          size="lg"
          className="px-6 py-3 text-lg bg-purple-600 hover:bg-purple-700"
        >
          Continue to Your Personalized Learning Path
        </Button>
      </motion.div>
    </div>
  );
};

export default TestResults;
