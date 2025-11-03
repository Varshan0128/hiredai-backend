// src/utils/datasetLoader.ts
// Small CSV loader + helper functions used by InterviewPrep
import Papa from "papaparse";

/**
 * loadCSV(path) -> returns parsed rows array (objects if header present)
 * - path should be an absolute path served by Vite (e.g. "/datasets/amazon_clean.csv")
 */
export async function loadCSV(path: string): Promise<any[]> {
  if (!path) return [];

  try {
    console.info("[datasetLoader] fetch start ->", path);
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }
    const text = await res.text();
    console.info("[datasetLoader] fetch success ->", path, `(bytes: ${text.length})`);

    // Parse via PapaParse: will return array of objects if header exists
    const parsed = Papa.parse(text, { header: true, skipEmptyLines: true, dynamicTyping: false });
    if (parsed && parsed.errors && parsed.errors.length) {
      console.warn("[datasetLoader] Papa parse warnings/errors ->", parsed.errors);
    }

    const rows = parsed && parsed.data ? parsed.data : [];
    console.info("[datasetLoader] Papa parsed (header) rows=" + rows.length + " for " + path);
    return rows;
  } catch (err) {
    console.warn("[datasetLoader] fetch failed ->", path, err && (err as Error).message ? (err as Error).message : err);
    return [];
  }
}

/**
 * getRandomQuestions(rows, n)
 * - rows can be array of objects (with `question` or `Question`) or array of strings
 * - returns array of text question strings (deduped) of length up to n
 */
export function getRandomQuestions(rows: any[], n = 10): string[] {
  if (!rows || !Array.isArray(rows)) return [];

  // Extract candidate strings
  const candidates: string[] = [];
  for (const r of rows) {
    if (!r) continue;
    if (typeof r === "string") {
      if (r.trim()) candidates.push(r.trim());
      continue;
    }
    // r is object
    const keys = Object.keys(r);
    if (keys.length === 0) continue;
    // common field names
    const qKey = keys.find(k => /question/i.test(k)) ?? keys[0];
    const val = r[qKey];
    if (val == null) continue;
    const str = typeof val === "string" ? val.trim() : String(val).trim();
    if (str) candidates.push(str);
  }

  // dedupe preserving order
  const seen = new Set<string>();
  const deduped: string[] = [];
  for (const c of candidates) {
    const k = c.toLowerCase().trim();
    if (!k) continue;
    if (!seen.has(k)) {
      seen.add(k);
      deduped.push(c);
    }
  }

  // shuffle
  for (let i = deduped.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deduped[i], deduped[j]] = [deduped[j], deduped[i]];
  }

  return deduped.slice(0, n);
}
