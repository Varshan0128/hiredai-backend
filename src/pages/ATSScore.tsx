
import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import EnhancedATSScoreCalculator from '@/components/ats/EnhancedATSScoreCalculator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, CheckCircle, AlertTriangle, Target } from 'lucide-react';

const ATSScore = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Advanced ATS Scoring",
      description: "Professional-grade analysis with weighted scoring: Skills (40%), Experience (30%), Education (15%), Formatting (15%)"
    },
    {
      icon: CheckCircle,
      title: "NLP-Powered Analysis",
      description: "Semantic similarity matching and intelligent keyword extraction using advanced text processing"
    },
    {
      icon: AlertTriangle,
      title: "Format Optimization",
      description: "Detect ATS-unfriendly elements like tables, images, and headers that could hurt your chances"
    },
    {
      icon: Target,
      title: "Smart Recommendations",
      description: "Get specific, actionable suggestions based on missing keywords and content gaps"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-background dark:via-slate-900/50 dark:to-indigo-950/20">
      <Header />
      
      <main className="pt-20 md:pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
              <BarChart3 className="w-4 h-4" />
              ATS Optimization Tool
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Advanced ATS <span className="text-gradient">Analyzer</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Professional-grade ATS analysis with NLP-powered semantic matching, weighted scoring, and intelligent recommendations to maximize your resume's ATS compatibility.
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="dashboard-grid mb-12"
          >
            {features.map((feature, index) => (
              <Card key={index} className="feature-card">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* ATS Calculator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="modern-card shadow-lg">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  Resume ATS Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <EnhancedATSScoreCalculator />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ATSScore;
