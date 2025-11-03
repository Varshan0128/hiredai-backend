import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, AlertTriangle, FileText, Upload, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ATSAnalyzer, ATSAnalysis } from '@/lib/ats-analyzer';
import EnhancedATSResultsDisplay from './EnhancedATSResultsDisplay';
import { validateInputs, handleResumeFile } from './utils/atsUtils';

const EnhancedATSScoreCalculator: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  
  const handleResumeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResumeText(e.target.value);
    if (error) setError(null);
  };
  
  const handleJobDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJobDescription(e.target.value);
    if (error) setError(null);
  };
  
  const clearForm = () => {
    setResumeText('');
    setJobDescription('');
    setAnalysis(null);
    setError(null);
    setAnalysisProgress(0);
  };
  
  const handleResumeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleResumeFile(e.target.files?.[0], setResumeText);
  };

  const analyzeResume = async () => {
    if (!validateInputs(resumeText, jobDescription)) {
      setError("Please provide both resume text and job description");
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    setAnalysisProgress(0);
    
    try {
      // Simulate analysis progress
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 20;
        });
      }, 200);

      // Create analyzer and perform analysis
      const analyzer = new ATSAnalyzer(resumeText, jobDescription);
      const result = analyzer.analyze();
      
      // Complete progress
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      
      // Small delay for UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAnalysis(result);
    } catch (err: any) {
      console.error("Error analyzing resume:", err);
      setError(err.message || "An error occurred while analyzing your resume");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getWordCount = (text: string) => text.trim().split(/\s+/).length;

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl font-bold">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              Advanced ATS Score Analyzer
            </CardTitle>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="secondary">NLP-Powered Analysis</Badge>
              <Badge variant="secondary">Semantic Matching</Badge>
              <Badge variant="secondary">Weighted Scoring</Badge>
              <Badge variant="secondary">Real-time Processing</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {!analysis ? (
              <>
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Resume Input */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="resume" className="text-lg font-semibold flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        Resume Content
                      </Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.txt"
                          onChange={handleResumeFileUpload}
                          className="hidden"
                          id="resume-upload"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('resume-upload')?.click()}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload File
                        </Button>
                      </div>
                    </div>
                    <Textarea
                      id="resume"
                      placeholder="Paste your resume content here or upload a file..."
                      value={resumeText}
                      onChange={handleResumeChange}
                      className="min-h-[200px] resize-none"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Word count: {getWordCount(resumeText)}</span>
                      <span className={getWordCount(resumeText) < 100 ? "text-amber-600" : "text-green-600"}>
                        {getWordCount(resumeText) < 100 ? "Consider adding more content" : "Good length"}
                      </span>
                    </div>
                  </div>

                  {/* Job Description Input */}
                  <div className="space-y-4">
                    <Label htmlFor="job" className="text-lg font-semibold flex items-center gap-2">
                      <Bot className="w-5 h-5 text-primary" />
                      Job Description
                    </Label>
                    <Textarea
                      id="job"
                      placeholder="Paste the job description here..."
                      value={jobDescription}
                      onChange={handleJobDescriptionChange}
                      className="min-h-[200px] resize-none"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Word count: {getWordCount(jobDescription)}</span>
                      <span className={getWordCount(jobDescription) < 100 ? "text-amber-600" : "text-green-600"}>
                        {getWordCount(jobDescription) < 100 ? "Consider adding more details" : "Good detail"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Analysis Button */}
                <div className="flex justify-center">
                  <Button
                    onClick={analyzeResume}
                    disabled={isAnalyzing || !resumeText.trim() || !jobDescription.trim()}
                    size="lg"
                    className="px-8 py-3 text-lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Analyzing Resume...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Analyze ATS Compatibility
                      </>
                    )}
                  </Button>
                </div>

                {/* Progress Bar */}
                {isAnalyzing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Analysis Progress</span>
                      <span>{Math.round(analysisProgress)}%</span>
                    </div>
                    <Progress value={analysisProgress} className="h-2" />
                    <div className="text-xs text-muted-foreground text-center">
                      {analysisProgress < 30 && "Parsing resume content..."}
                      {analysisProgress >= 30 && analysisProgress < 60 && "Extracting keywords and skills..."}
                      {analysisProgress >= 60 && analysisProgress < 90 && "Calculating semantic matches..."}
                      {analysisProgress >= 90 && "Generating detailed report..."}
                    </div>
                  </div>
                )}
                
                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </>
            ) : (
              <EnhancedATSResultsDisplay analysis={analysis} />
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={clearForm}
              disabled={isAnalyzing}
            >
              Clear Analysis
            </Button>
            {analysis && (
              <Button onClick={() => setAnalysis(null)}>
                Analyze Another Resume
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default EnhancedATSScoreCalculator;
