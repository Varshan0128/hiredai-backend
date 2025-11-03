// src/utils/textUtils.ts
export const stripHtmlTags = (html: string) =>
  typeof window !== "undefined"
    ? (new DOMParser().parseFromString(String(html), "text/html").body.textContent || "").trim()
    : String(html).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const unescapeJsonString = (s: string) =>
  s && typeof s === "string"
    ? s.replace(/^"(.*)"$/, "$1").replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\\\\/g, "\\")
    : s;

export const sanitizeQuestion = (raw: any): string => {
  try {
    if (raw === null || raw === undefined) return "(no question)";

    // If the row is an object, try common keys
    if (typeof raw === "object") {
      const keys = ["Question", "question", "text", "prompt", "Question Text"];
      for (const k of keys) if (raw[k]) return sanitizeQuestion(raw[k]);
      for (const v of Object.values(raw)) if (typeof v === "string" && v.trim()) return sanitizeQuestion(v);
      return String(raw);
    }

    // Now raw is a string
    let s = String(raw).trim();

    // If it looks like JSON, try parse
    if ((s.startsWith("{") && s.endsWith("}")) || (s.startsWith("[") && s.endsWith("]"))) {
      try {
        const parsed = JSON.parse(s);
        if (typeof parsed === "string") s = parsed;
        else if (typeof parsed === "object") {
          const vals = Object.values(parsed).filter((v) => typeof v === "string" && v.trim().length);
          if (vals.length) s = vals[0] as string;
          else s = JSON.stringify(parsed);
        }
      } catch {
        s = unescapeJsonString(s);
      }
    }

    // Remove escape sequences
    if (s.includes('\\"') || s.includes("\\n") || s.includes("\\\\")) {
      s = s.replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
    }

    // Strip HTML if present
    if (/<[a-z][\s\S]*>/i.test(s) || s.toLowerCase().includes("<!doctype")) {
      s = stripHtmlTags(s);
    }

    // Decode HTML entities in browser
    if (typeof window !== "undefined" && /&[a-zA-Z]+;|&#\d+;/.test(s)) {
      const txt = document.createElement("textarea");
      txt.innerHTML = s;
      s = txt.value;
    }

    s = s.replace(/^[\s"'`]+|[\s"'`]+$/g, "").trim();
    return s.length ? s : "(no question)";
  } catch (err) {
    console.error("sanitizeQuestion error", err);
    return String(raw);
  }
};
