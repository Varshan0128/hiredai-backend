// src/pages/DatasetDebug.tsx
import React, { useEffect } from "react";
import { loadCSV, getRandomQuestions } from "@/utils/datasetLoader";

export default function DatasetDebug() {
  useEffect(() => {
    (async () => {
      const files = [
        "/datasets/amazon_single_qna.csv",
        "/datasets/amazon_multi_questions.csv",
        "/datasets/amazon_multi_answers.csv",
        "/datasets/linkedin_question_clean.csv"
      ];
      for (const f of files) {
        try {
          console.log("==> DEBUG load", f);
          const rows = await loadCSV(f);
          console.log(f, "-> rows:", Array.isArray(rows) ? rows.length : "not-array", rows?.slice(0,3));
          const qs = getRandomQuestions(rows, 10);
          console.log(f, "-> extracted questions:", qs.length, qs);
        } catch (e) {
          console.error("DEBUG error loading", f, e);
        }
      }
    })();
  }, []);
  return (
    <div style={{ padding: 32 }}>
      <h2>Dataset Debug — open console (F12)</h2>
      <p>Check the console for per-file logs and extracted question counts.</p>
    </div>
  );
}
