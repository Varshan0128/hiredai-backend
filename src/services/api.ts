// src/services/api.ts
export type BackendStatus = {
  message?: string;
  version?: string;
  [key: string]: any;
};

const API_BASE = import.meta.env.VITE_API_BASE as string | undefined;

if (!API_BASE) {
  // Optional: you can throw or just log; we keep it as a console.warn so dev doesn't crash
  console.warn("VITE_API_BASE is not defined. Make sure .env has VITE_API_BASE set.");
}

export async function getBackendStatus(): Promise<BackendStatus> {
  if (!API_BASE) {
    throw new Error("API base url not configured");
  }

  const res = await fetch(`${API_BASE}/`);
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Backend responded with ${res.status}: ${txt}`);
  }
  const data = (await res.json()) as BackendStatus;
  return data;
}

// Example for other endpoints (adjust path to your API)
export async function getInterviewQuestions(): Promise<any> {
  if (!API_BASE) throw new Error("API base url not configured");
  const res = await fetch(`${API_BASE}/interview`);
  if (!res.ok) throw new Error("Failed to fetch interview questions");
  return res.json();
}
