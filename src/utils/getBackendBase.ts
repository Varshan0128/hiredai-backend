// src/utils/getBackendBase.ts
// Determines backend base URL safely for both Vite and CRA environments.
// Uses environment variable if available, otherwise defaults to localhost:8000.

export function getBackendBase(): string {
  // 1️⃣ Try to read from Vite environment variable (preferred)
  try {
    const envBase =
      (import.meta as any)?.env?.VITE_API_BASE_URL ||
      (import.meta as any)?.env?.VITE_BACKEND_URL;
    if (envBase) return String(envBase).replace(/\/+$/, "");
  } catch (_) {
    // Vite environment might not be available in some setups
  }

  // 2️⃣ Try CRA-style environment variable (for fallback setups)
  if (typeof process !== "undefined" && process?.env?.REACT_APP_BACKEND_URL) {
    return String(process.env.REACT_APP_BACKEND_URL).replace(/\/+$/, "");
  }

  // 3️⃣ Final fallback for local development
  // 🔥 Important: use localhost (not 127.0.0.1) to match CORS origins
  return "http://localhost:8000";
}

// Optional helper (used for Supabase admin route)
export function getCreateUserUrl(): string {
  const base = getBackendBase();
  return `${base.replace(/\/+$/, "")}/api/admin/create-user`;
}
