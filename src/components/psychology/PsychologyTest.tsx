import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight, Brain, Sparkles } from 'lucide-react';
import { PsychologyQuestion, getRandomQuestions, calculateDominantStyle } from '@/data/psychologyQuestions';

interface PsychologyTestProps {
  onComplete: (result: {
    dominantStyle: 'Realistic' | 'Elaborate' | 'Short';
    scores: { Realistic: number; Elaborate: number; Short: number };
    percentage: number;
  }) => void;
}

const PsychologyTest: React.FC<PsychologyTestProps> = ({ onComplete }) => {
  const [questions, setQuestions] = useState<PsychologyQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<('Realistic' | 'Elaborate' | 'Short')[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize with random questions
    const randomQuestions = getRandomQuestions(10);
    setQuestions(randomQuestions);
    setAnswers(new Array(10).fill(null));
    setIsLoading(false);
  }, []);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  const handleAnswerSelect = (answerStyle: 'Realistic' | 'Elaborate' | 'Short') => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerStyle;
    setAnswers(newAnswers);
    setSelectedAnswer(answerStyle);
  };

  const handleNext = () => {
    if (!selectedAnswer) return;

    if (isLastQuestion) {
      // Complete the test
      const validAnswers = answers.filter(answer => answer !== null);
      const result = calculateDominantStyle(validAnswers);
      onComplete(result);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(answers[currentQuestionIndex + 1] || '');
    }
  };

  const handlePrevious = () => {
    if (isFirstQuestion) return;
    setCurrentQuestionIndex(prev => prev - 1);
    setSelectedAnswer(answers[currentQuestionIndex - 1] || '');
  };

  if (isLoading || !currentQuestion) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8">
          <div className="flex items-center justify-center space-x-2">
            <Brain className="h-6 w-6 animate-pulse text-primary" />
            <span className="text-muted-foreground">Preparing your personalized assessment...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card className="border-primary/20">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Psychology-Based Content Style Assessment</CardTitle>
            </div>
            <span className="text-sm text-muted-foreground font-medium">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
      </Card>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl leading-relaxed">
                {currentQuestion.text}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={selectedAnswer}
                onValueChange={handleAnswerSelect}
                className="space-y-3"
              >
                {currentQuestion.options.map((option, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
                  >
                    <RadioGroupItem
                      value={option.style}
                      id={`option-${index}`}
                      className="mt-1"
                    />
                    <Label
                      htmlFor={`option-${index}`}
                      className="flex-1 text-sm leading-relaxed cursor-pointer"
                    >
                      {option.text}
                    </Label>
                  </motion.div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={isFirstQuestion}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>{answers.filter(a => a !== null).length} of {questions.length} answered</span>
        </div>

        <Button
          onClick={handleNext}
          disabled={!selectedAnswer}
          className="flex items-center space-x-2"
        >
          <span>{isLastQuestion ? 'Complete Assessment' : 'Next'}</span>
          {!isLastQuestion && <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default PsychologyTest;