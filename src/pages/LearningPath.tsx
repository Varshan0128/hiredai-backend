import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import PsychologyTest from '@/components/psychology/PsychologyTest';
import TestResults from '@/components/psychology/TestResults';
import { motion } from 'framer-motion';
import { BookOpen, Code, Brain, Loader2 } from 'lucide-react';
import { getBackendBase } from '@/utils/getBackendBase';

const API_BASE = getBackendBase() || "http://127.0.0.1:8000";

const LearningPath: React.FC = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [learningMode, setLearningMode] = useState<string | null>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [testCompleted, setTestCompleted] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<any>(null);

  // 🧩 Load datasets when page opens
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE}/check-data`);
        const data = await res.json();

        if (data && data.available_datasets) {
          setCourses(
            data.available_datasets
              .filter((f: string) => f.endsWith('.csv'))
              .map((f: string) => f.replace('_learning.csv', ''))
          );
        }
      } catch (error) {
        console.error("Error loading datasets:", error);
      }
    };
    fetchData();

    // Restore previous test data if any
    const completed = localStorage.getItem('psychology_test_completed') === 'true';
    setTestCompleted(completed);

    const storedResult = JSON.parse(localStorage.getItem('psychology_test_result') || 'null');
    if (storedResult) {
      setTestResult(storedResult);
      setLearningMode(storedResult.category || storedResult.user_category || null);
    }
  }, []);

  // 🧠 Submit answers → Get user category
  const handleTestComplete = async (answers: any) => {
    try {
      const res = await fetch(`${API_BASE}/predict-learning-path/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });

      if (!res.ok) throw new Error("Failed to connect to backend");
      const data = await res.json();

      const result = {
        category: data.user_category || "Unknown",
        courses: data.recommended_courses || [],
        message: data.message || "Successfully classified user.",
      };

      setTestResult(result);
      setLearningMode(result.category);
      setShowResults(true);
      localStorage.setItem('psychology_test_result', JSON.stringify(result));
    } catch (error) {
      console.error("Error in handleTestComplete:", error);
      alert("Something went wrong while processing your test. Please try again.");
    }
  };

  // ✅ Save completion
  const handleContinueToLearningPath = () => {
    localStorage.setItem('psychology_test_completed', 'true');
    setTestCompleted(true);
    setShowResults(false);
  };

  // 🔄 Reset test
  const resetTest = () => {
    localStorage.removeItem('psychology_test_completed');
    localStorage.removeItem('psychology_test_result');
    setTestCompleted(false);
    setShowResults(false);
    setTestResult(null);
    setLearningMode(null);
  };

  // 📚 Load course modules
  const loadLearningPath = async (courseName: string) => {
    if (!learningMode) {
      alert("Please complete the psychological test first!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/learning-path/${courseName}?mode=${learningMode}`);
      const data = await res.json();

      if (data && data.content) {
        setModules(data.content);
        setSelectedCourse(courseName);
      } else {
        setModules([]);
      }
    } catch (error) {
      console.error("Error loading learning path:", error);
      setModules([]);
    }
    setLoading(false);
  };

  // 🧩 Step 1 — Psychology Test
  if (!testCompleted && !showResults) {
    return (
      <div className="min-h-screen bg-background text-white">
        <Header />
        <main className="container max-w-6xl mx-auto pt-24 pb-12 px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Discover Your Learning Style</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Answer 10 psychology-based questions to personalize your learning path.
            </p>
          </div>
          <PsychologyTest onComplete={handleTestComplete} />
        </main>
      </div>
    );
  }

  // 🧭 Step 2 — Show Result Screen
  if (showResults && testResult) {
    return (
      <div className="min-h-screen bg-background text-white">
        <Header />
        <main className="container max-w-6xl mx-auto pt-24 pb-12 px-4">
          <TestResults result={testResult} onContinue={handleContinueToLearningPath} />
        </main>
      </div>
    );
  }

  // 🧑‍🎓 Step 3 — Learning Path Content
  return (
    <div className="min-h-screen bg-background text-white">
      <Header />
      <main className="container max-w-5xl mx-auto pt-24 pb-12 px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Personalized Learning Path</h1>
            <p className="text-muted-foreground">
              Based on your assessment, you are classified as a
              <span className="font-semibold text-purple-500"> {learningMode}</span> learner.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={resetTest}>
            Retake Assessment
          </Button>
        </div>

        {/* Course Selector */}
        <div className="flex flex-wrap gap-3 mb-8">
          {courses.map((course) => (
            <motion.button
              key={course}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => loadLearningPath(course)}
              className={`px-5 py-3 rounded-xl font-semibold ${
                selectedCourse === course
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 hover:bg-gray-700 text-gray-300"
              }`}
            >
              {course.replace(/_/g, " ").toUpperCase()}
            </motion.button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center mt-8">
            <Loader2 className="animate-spin text-purple-400" size={40} />
          </div>
        )}

        {/* Course Modules */}
        {!loading && modules.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((m) => (
              <motion.div
                key={m.module_id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: m.module_id * 0.05 }}
                className="bg-gray-900 rounded-2xl p-5 shadow-md border border-gray-800"
              >
                <div className="flex items-center gap-2 mb-3 text-purple-300">
                  <BookOpen size={20} />
                  <h2 className="text-lg font-semibold">{m.topic_title}</h2>
                </div>
                <p className="text-gray-400 mb-4 text-sm">{m.content_summary}</p>
                <div className="bg-gray-800 rounded-xl p-3 mb-3 overflow-x-auto">
                  <pre className="text-xs text-green-300">
                    <code>{m.code_example}</code>
                  </pre>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Brain size={16} /> {m.difficulty}
                  </span>
                  <Code size={16} className="text-blue-400" />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && !modules.length && selectedCourse && (
          <p className="text-center text-gray-400 mt-10">
            No modules found for this course.
          </p>
        )}
      </main>
    </div>
  );
};

export default LearningPath;
