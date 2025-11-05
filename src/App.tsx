// src/App.tsx
import React, { useEffect, useRef, useState } from "react";
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

const DEFAULT_POLL_INTERVAL_MS = (() => {
  const raw = (import.meta as any).env?.VITE_STATUS_POLL_INTERVAL;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : 0;
})();

async function fetchHealthDirect(timeoutMs = 5000): Promise<BackendStatus> {
  const backendBase =
    (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:8000/api";
  const url = `${backendBase.replace(/\/+$/, "")}/health`;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json as BackendStatus;
  } finally {
    clearTimeout(id);
  }
}

function useBackendStatus() {
  const mounted = useRef(true);
  const [status, setStatus] = useState<BackendStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);

    try {
      // Primary attempt: use service helper (if it exists).
      const data = await getBackendStatus();
      if (!mounted.current) return;
      setStatus(data ?? null);
      setError(null);
      return;
    } catch (err) {
      // fallback to direct fetch if the service layer fails (network / build-time mismatch)
      try {
        const direct = await fetchHealthDirect();
        if (!mounted.current) return;
        setStatus(direct);
        setError(null);
        return;
      } catch (err2: any) {
        if (!mounted.current) return;
        const msg =
          err2?.message ??
          (err instanceof Error ? err.message : "Backend not reachable");
        setStatus(null);
        setError(String(msg));
        return;
      }
    } finally {
      if (mounted.current) setLoading(false);
    }
  };

  useEffect(() => {
    mounted.current = true;
    load();

    let intervalId: number | undefined;
    if (DEFAULT_POLL_INTERVAL_MS > 0) {
      intervalId = window.setInterval(() => {
        load().catch(() => {});
      }, DEFAULT_POLL_INTERVAL_MS);
    }

    return () => {
      mounted.current = false;
      if (intervalId) clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  return { status, loading, error, reload: load };
}

function StatusPill({
  loading,
  error,
  status,
  onRetry,
}: {
  loading: boolean;
  error: string | null;
  status: BackendStatus | null;
  onRetry: () => void;
}) {
  if (loading) {
    return <span>Checking backend…</span>;
  }
  if (error) {
    return (
      <span style={{ color: "#ff6b6b", display: "inline-flex", gap: 8, alignItems: "center" }}>
        Backend unreachable ({error})
        <button
          onClick={onRetry}
          style={{
            marginLeft: 8,
            background: "#111827",
            color: "white",
            borderRadius: 6,
            padding: "4px 8px",
            border: "none",
            cursor: "pointer",
            fontSize: 12,
          }}
        >
          Retry
        </button>
      </span>
    );
  }

  return (
    <span style={{ color: "#4ade80" }}>
      ✅ {status?.message ?? "Backend running"}
      {status?.version ? ` — v${status.version}` : ""}
    </span>
  );
}

export default function App() {
  const { status, loading, error, reload } = useBackendStatus();

  return (
    <div className="App" style={{ minHeight: "100vh", background: "#fff" }}>
      {/* Top status bar */}
      <div
        style={{
          width: "100%",
          padding: "8px 14px",
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
          <div style={{ opacity: 0.95 }}>
            <StatusPill loading={loading} error={error} status={status} onRetry={() => reload()} />
          </div>
        </div>

        <div style={{ opacity: 0.75, fontSize: 12 }}>
          {(import.meta as any).env?.VITE_API_BASE_URL ? "prod" : process.env.NODE_ENV === "development" ? "dev" : "prod"}
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
