import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import PsychologyTest from '@/components/psychology/PsychologyTest';
import TestResults from '@/components/psychology/TestResults';
import { motion } from 'framer-motion';
import { BookOpen, Code, Brain, Loader2 } from 'lucide-react';
import { getBackendBase } from '@/utils/getBackendBase'; // Assuming this correctly returns "http://localhost:8000"

const API_BASE = getBackendBase() || "http://127.0.0.1:8000"; // Fallback in case getBackendBase is null/undefined

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
        const checkDataUrl = `${API_BASE}/api/check-data`; // Define URL explicitly
        console.log("Attempting GET to check-data:", checkDataUrl); // Log the exact URL for check-data

        const res = await fetch(checkDataUrl, {
          method: "GET",
          headers: { "Accept": "application/json" },
        });

        // --- IMPORTANT: Check if response is OK and is JSON before parsing ---
        if (!res.ok) {
          const errorText = await res.text();
          console.error("Backend /api/check-data response was not OK:", res.status, res.statusText, errorText);
          // Try to parse as JSON anyway, if it's not HTML, to get more info
          try {
            const errorJson = JSON.parse(errorText);
            console.error("Backend /api/check-data error JSON:", errorJson);
          } catch (jsonError) {
            console.error("Backend /api/check-data error text (not JSON):", errorText);
          }
          throw new Error(`Failed to load datasets: ${res.status} ${res.statusText}`);
        }

        // Check content type explicitly
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const rawResponse = await res.text();
            console.error("Backend /api/check-data did not return JSON. Content-Type:", contentType, "Raw Response:", rawResponse);
            throw new Error("Expected JSON from /api/check-data but received non-JSON response.");
        }

        const data = await res.json();
        console.log("Successfully fetched /api/check-data data:", data); // Log success

        if (data && data.available_datasets) {
          setCourses(
            data.available_datasets
              .filter((f: string) => !!f) // ensure non-empty
              .map((f: string) => f.replace('_learning', '')) // Ensure consistency if backend cleaned partially
          );
        } else {
            console.warn("/api/check-data response did not contain 'available_datasets':", data);
        }
      } catch (error) {
        console.error("Error loading datasets (catch block):", error);
        // Optionally inform user
        // alert(`Failed to load course list. Please check the backend server. Error: ${error}`);
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
      setShowResults(false); // Make sure results are hidden if test is completed and we're showing the main path
    }
  }, []); // Empty dependency array means this runs once on mount

  // 🧠 Submit answers → Get user category
  const handleTestComplete = async (answers: any) => {
    try {
      const fullUrl = `${API_BASE}/api/predict-learning-path`; // Build the full URL explicitly
      console.log("Attempting POST to predict-learning-path:", fullUrl); // Log the exact URL being hit (for debugging)
      const res = await fetch(fullUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(answers),
      });

      if (!res.ok) {
        const errorText = await res.text(); // Get more specific error from backend
        console.error("Backend error response from predict-learning-path:", res.status, res.statusText, errorText);
        throw new Error(`Failed to connect to backend: ${res.status} ${res.statusText} - ${errorText}`);
      }

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const raw = await res.text();
        console.error("predict-learning-path returned non-JSON:", contentType, raw);
        throw new Error("Expected JSON from predict-learning-path but received non-JSON response.");
      }

      const data = await res.json();
      console.log("Successfully fetched predict-learning-path data:", data); // Log success

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
      alert(`Something went wrong while processing your test: ${error}. Please try again.`);
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
    setCourses([]); // Clear courses to re-trigger fetchData if needed
    setModules([]); // Clear modules
    // Re-run the initial data fetch after reset
    const fetchData = async () => {
        try {
            const checkDataUrl = `${API_BASE}/api/check-data`;
            const res = await fetch(checkDataUrl, { headers: { "Accept": "application/json" } });
            if (!res.ok) return;
            const data = await res.json();
            if (data && data.available_datasets) {
                setCourses(data.available_datasets.filter((f: string) => !!f).map((f: string) => f.replace('_learning', '')));
            }
        } catch (error) {
            console.error("Error re-loading datasets after reset:", error);
        }
    };
    fetchData();
  };

  // 📚 Load course modules
  const loadLearningPath = async (courseName: string) => {
    if (!learningMode) {
      alert("Please complete the psychological test first!");
      return;
    }

    setLoading(true);
    setModules([]); // Clear previous modules before loading new ones
    try {
      // make courseName safe for URL paths
      const encodedCourse = encodeURIComponent(courseName);
      const encodedMode = encodeURIComponent(learningMode);
      const learningPathUrl = `${API_BASE}/api/learning-path/${encodedCourse}?mode=${encodedMode}`;
      console.log("Attempting GET to learning-path:", learningPathUrl); // Log the exact URL for learning-path

      const res = await fetch(learningPathUrl, {
        method: "GET",
        headers: { "Accept": "application/json" },
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Backend /api/learning-path response was not OK:", res.status, res.statusText, errorText);
        throw new Error(`Failed to load learning path: ${res.status} ${res.statusText}`);
      }

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
          const rawResponse = await res.text();
          console.error("Backend /api/learning-path did not return JSON. Content-Type:", contentType, "Raw Response:", rawResponse);
          throw new Error("Expected JSON from /api/learning-path but received non-JSON response.");
      }

      // parse JSON safely
      const data = await res.json();
      console.log("Successfully fetched /api/learning-path data:", data); // Log success

      if (data && data.content) {
        setModules(data.content);
        setSelectedCourse(courseName);
      } else {
        setModules([]);
        console.warn("/api/learning-path response did not contain 'content':", data);
      }
    } catch (error) {
      console.error("Error loading learning path:", error);
      setModules([]); // Ensure modules are empty on error
      // Optionally show an in-UI error to the user here
    } finally {
      setLoading(false);
    }
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
        {loading && courses.length === 0 ? (
          <div className="flex justify-center mt-8">
            <Loader2 className="animate-spin text-purple-400" size={40} />
            <p className="ml-2 text-gray-400">Loading courses...</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3 mb-8">
            {courses.length > 0 ? (
              courses.map((course) => (
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
              ))
            ) : (
              <p className="text-center text-gray-400 w-full">No courses available. Check backend datasets.</p>
            )}
          </div>
        )}

        {/* Loading Modules Indicator */}
        {loading && selectedCourse && modules.length === 0 && (
          <div className="flex justify-center mt-8">
            <Loader2 className="animate-spin text-purple-400" size={40} />
            <p className="ml-2 text-gray-400">Loading modules for {selectedCourse.replace(/_/g, " ").toUpperCase()}...</p>
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
            No modules found for this course or learning mode.
          </p>
        )}
      </main>
    </div>
  );
};

export default LearningPath;
