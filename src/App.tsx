import React from "react";
import { Routes, Route } from "react-router-dom";
// Pages
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Builder from "./pages/Builder";
import ApplicationTracker from "./pages/ApplicationTracker";
import InterviewPrep from "./pages/InterviewPrep";
import LearningPath from "./pages/LearningPath";
import Templates from "./pages/Templates";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import Jobs from "./pages/Jobs";
import NotFound from "./pages/NotFound";

// Protected Route
import ProtectedRoute from "./components/ProtectedRoute";

// Optional: silence React Router upgrade warnings
if (process.env.NODE_ENV === "development") {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    const msg = args.join(" ");
    if (
      msg.includes("React Router Future Flag Warning") ||
      msg.includes("v7_startTransition") ||
      msg.includes("v7_relativeSplatPath")
    ) {
      return;
    }
    originalWarn(...args);
  };
}

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/home" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/learning" element={<LearningPath />} />
        <Route path="/learning-path" element={<LearningPath />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/builder" element={<ProtectedRoute><Builder /></ProtectedRoute>} />
        <Route path="/applications" element={<ProtectedRoute><ApplicationTracker /></ProtectedRoute>} />
        <Route path="/interview-prep" element={<ProtectedRoute><InterviewPrep /></ProtectedRoute>} />
        <Route path="/ATS-score" element={<ProtectedRoute><LearningPath /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />

        {/* 404 Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;