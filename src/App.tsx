import React, { useEffect, useState } from "react";
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

import { getBackendStatus } from "./services/api";
import type { BackendStatus } from "./services/api";

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
  const [backendStatus, setBackendStatus] = useState<BackendStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [statusError, setStatusError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setStatusLoading(true);
    getBackendStatus()
      .then((data) => {
        if (!mounted) return;
        setBackendStatus(data ?? null);
        setStatusError(null);
      })
      .catch((err: any) => {
        if (!mounted) return;
        console.error("Backend status check failed:", err);
        setBackendStatus(null);
        setStatusError(err?.message ? String(err.message) : "Backend not reachable");
      })
      .finally(() => {
        if (!mounted) return;
        setStatusLoading(false);
      });

    // optional: poll every X seconds (disabled by default)
    // const id = setInterval(() => { /* call getBackendStatus again */ }, 30_000);

    return () => {
      mounted = false;
      // clearInterval(id);
    };
  }, []);

  const renderStatus = () => {
    if (statusLoading) return <span>Checking backend…</span>;
    if (statusError)
      return (
        <span style={{ color: "#ff6b6b" }}>
          Backend unreachable ({statusError})
        </span>
      );

    return (
      <span style={{ color: "#4ade80" }}>
        ✅ {backendStatus?.message ?? "Backend running"}
        {backendStatus?.version ? ` — v${backendStatus.version}` : ""}
      </span>
    );
  };

  return (
    <div className="App">
      {/* Small top status bar — adjust styling as needed for your app */}
      <div
        style={{
          width: "100%",
          padding: "6px 12px",
          background: "#0f172a",
          color: "#e6eef8",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 13,
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <strong style={{ color: "#cbd5e1" }}>Hired AI</strong>
          <span style={{ opacity: 0.7 }}>{renderStatus()}</span>
        </div>

        <div style={{ opacity: 0.65, fontSize: 12 }}>
          {/* You can add quick links / environment name here */}
          {process.env.NODE_ENV === "development" ? "dev" : "prod"}
        </div>
      </div>

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/home" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/learning" element={<LearningPath />} />
        <Route path="/learning-path" element={<LearningPath />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/builder"
          element={
            <ProtectedRoute>
              <Builder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <ApplicationTracker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interview-prep"
          element={
            <ProtectedRoute>
              <InterviewPrep />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ATS-score"
          element={
            <ProtectedRoute>
              <LearningPath />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <Jobs />
            </ProtectedRoute>
          }
        />

        {/* 404 Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
