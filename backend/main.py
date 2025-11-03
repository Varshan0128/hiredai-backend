# backend/main.py
import os
import math
import typing as t
import difflib
from pathlib import Path

from fastapi import FastAPI, HTTPException, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

# Optional OpenAI usage (preserve your existing generate-answer endpoint behavior)
import openai
from dotenv import load_dotenv

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if OPENAI_API_KEY:
    openai.api_key = OPENAI_API_KEY

# App + CORS
app = FastAPI(title="HiredAI Backend (merged)")

FRONTEND_ORIGINS = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=FRONTEND_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.path.join(BASE_DIR, "datasets")
os.makedirs(DATASET_DIR, exist_ok=True)
if os.path.isdir(DATASET_DIR):
    app.mount("/ai_datasets", StaticFiles(directory=DATASET_DIR), name="ai_datasets")

# -------------------------
# Models
# -------------------------
class PromptRequest(BaseModel):
    prompt: str
    max_tokens: t.Optional[int] = 200
    temperature: t.Optional[float] = 0.6

# Accept either a raw answers map OR an already-computed assessment.
# We'll handle both input shapes in the handler.
class AssessmentScores(BaseModel):
    Realistic: int
    Elaborate: int
    Short: int

class PsychologyAssessmentResult(BaseModel):
    dominantStyle: str
    scores: AssessmentScores
    percentage: int

# -------------------------
# Helper utilities
# -------------------------
def replace_nan_with_none(obj):
    """Recursively replace NaN floats with None so JSON serialization is safe."""
    if isinstance(obj, dict):
        return {k: replace_nan_with_none(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [replace_nan_with_none(x) for x in obj]
    if isinstance(obj, float) and math.isnan(obj):
        return None
    return obj

def normalize_slug(name: str) -> str:
    return name.strip().lower().replace("-", " ").replace("_", " ").replace(".", " ")

def find_dataset_filename_for_course(course_name: str) -> t.Optional[str]:
    """Look for <course_name>_learning.csv in datasets/ (tolerant fuzzy matching)."""
    if not os.path.isdir(DATASET_DIR):
        return None
    files = [f for f in os.listdir(DATASET_DIR) if f.lower().endswith(".csv")]
    candidate = f"{course_name}_learning.csv"
    if candidate in files:
        return candidate
    norm = normalize_slug(course_name)
    variants = [
        f"{norm.replace(' ', '_')}_learning.csv",
        f"{norm.replace(' ', '-')}_learning.csv",
        f"{norm.replace(' ', '')}_learning.csv",
    ]
    for v in variants:
        if v in files:
            return v
    basenames = [os.path.splitext(f)[0] for f in files]
    norm_map = {b: normalize_slug(b) for b in basenames}
    matches = difflib.get_close_matches(norm, list(norm_map.values()), n=1, cutoff=0.6)
    if matches:
        for orig_base, nval in norm_map.items():
            if nval == matches[0]:
                return orig_base + ".csv"
    return None

# -------------------------
# Root / health & check-data
# -------------------------
@app.get("/")
def root():
    return {
        "message": "✅ Backend running",
        "version": app.version,
        "dataset_dir": DATASET_DIR,
    }

@app.get("/check-data")
def check_data():
    try:
        if not os.path.exists(DATASET_DIR):
            return {"available_datasets": [], "total": 0, "note": f"{DATASET_DIR} not found"}
        files = []
        for root, _, filenames in os.walk(DATASET_DIR):
            for f in filenames:
                rel = os.path.relpath(os.path.join(root, f), DATASET_DIR)
                files.append(rel)
        return {"available_datasets": files, "total": len(files)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# -------------------------
# generate-answer (unchanged - keep behavior)
# -------------------------
@app.post("/generate-answer")
async def generate_answer(req: PromptRequest):
    if not OPENAI_API_KEY:
        return {
            "answer": (
                "💡 (Local fallback) Structure your answer with STAR: Situation, Task, Action, Result. "
                "Mention one metric or outcome and what you learned. Keep it concise."
            )
        }
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an interview coach that writes concise, realistic STAR-format answers."},
                {"role": "user", "content": req.prompt},
            ],
            max_tokens=req.max_tokens or 200,
            temperature=req.temperature or 0.6,
            n=1,
        )
        answer = response["choices"][0]["message"]["content"].strip()
        return {"answer": answer}
    except Exception as e:
        print(f"Error generating answer with OpenAI: {e}")
        return {"answer": f"Error: AI generation failed ({str(e)})"}

# -------------------------
# predict-learning-path
# Accepts either:
#  1) raw answers dict: {"q1":"A", "q2":"B", ...}
#  2) already computed assessment payload (dominantStyle, scores, percentage)
# Returns: user_category, scores, percentage, message, recommended_courses
# -------------------------
@app.post("/predict-learning-path/")
async def predict_learning_path(payload: t.Dict[str, t.Any] = Body(...)):
    """
    Accepts either raw answers or assessment. Returns classification and recommended courses.
    """
    try:
        # If payload already contains 'dominantStyle' assume it's the assessment and pass through (validate lightly)
        if isinstance(payload, dict) and "dominantStyle" in payload and "scores" in payload:
            # Light sanitization / ensure keys exist
            scores_raw = payload.get("scores", {})
            scores = {
                "Short": int(scores_raw.get("Short", 0)),
                "Elaborate": int(scores_raw.get("Elaborate", 0)),
                "Realistic": int(scores_raw.get("Realistic", 0)),
            }
            dominant = str(payload.get("dominantStyle", "Unknown"))
            total = sum(scores.values()) or 1
            percentage = int(round(scores.get(dominant, 0) / total * 100)) if dominant in scores else 0
            recommended_map = {
                "Short": ["advanced_react_patterns"],
                "Elaborate": ["typescript_deep_dive", "machine_learning_basics"],
                "Realistic": ["aws_developer", "hands_on_projects"],
            }
            return {
                "user_category": dominant,
                "scores": scores,
                "percentage": percentage,
                "message": f"User mapped to {dominant} learning style",
                "recommended_courses": recommended_map.get(dominant, []),
            }

        # Otherwise treat payload as raw answers map: q1->"A", q2->"B", ...
        answers: t.Dict[str, str] = {k: str(v).strip().upper() for k, v in (payload or {}).items()}

        if not answers:
            raise HTTPException(status_code=400, detail="No answers provided")

        # Define mapping for each question option to (category, weight)
        # You can extend to q1..q10 as needed; here is an example for q1..q10.
        mapping: t.Dict[str, t.Dict[str, t.Tuple[str, int]]] = {
            "q1": {"A": ("Short", 2), "B": ("Elaborate", 1), "C": ("Realistic", 0)},
            "q2": {"A": ("Short", 1), "B": ("Elaborate", 2), "C": ("Realistic", 2)},
            "q3": {"A": ("Short", 2), "B": ("Elaborate", 1), "C": ("Realistic", 1)},
            "q4": {"A": ("Short", 1), "B": ("Elaborate", 2), "C": ("Realistic", 2)},
            "q5": {"A": ("Short", 1), "B": ("Elaborate", 2), "C": ("Realistic", 1)},
            "q6": {"A": ("Short", 2), "B": ("Elaborate", 1), "C": ("Realistic", 0)},
            "q7": {"A": ("Short", 1), "B": ("Elaborate", 2), "C": ("Realistic", 1)},
            "q8": {"A": ("Short", 0), "B": ("Elaborate", 2), "C": ("Realistic", 2)},
            "q9": {"A": ("Short", 2), "B": ("Elaborate", 1), "C": ("Realistic", 1)},
            "q10": {"A": ("Short", 1), "B": ("Elaborate", 2), "C": ("Realistic", 2)},
        }

        scores = {"Short": 0, "Elaborate": 0, "Realistic": 0}
        counts = {"Short": 0, "Elaborate": 0, "Realistic": 0}
        total_possible = 0

        for q, ans in answers.items():
            key = str(q).strip()
            a = str(ans).strip().upper() if ans is not None else ""
            if key in mapping and a in mapping[key]:
                cat, w = mapping[key][a]
                scores[cat] += int(w)
                counts[cat] += 1
                total_possible += max(mapping[key].values(), key=lambda x: x[1])[1]  # approximate

        # if user provided fewer questions than mapping, total_possible may be 0; fallback:
        if total_possible == 0:
            # assume each question had max weight 2 and count number of answered questions
            total_possible = 2 * max(1, len([k for k in answers.keys() if k.lower().startswith("q")]))

        # Decide dominant category
        max_score = max(scores.values())
        winners = [c for c, v in scores.items() if v == max_score]

        if len(winners) == 1:
            dominant = winners[0]
        else:
            # tiebreak by counts
            tied_counts = {c: counts.get(c, 0) for c in winners}
            max_count = max(tied_counts.values())
            count_winners = [c for c, v in tied_counts.items() if v == max_count]
            if len(count_winners) == 1:
                dominant = count_winners[0]
            else:
                # deterministic fallback priority
                fallback_priority = ["Short", "Realistic", "Elaborate"]
                dominant = next((p for p in fallback_priority if p in count_winners), count_winners[0])

        # percentage: how much of total_possible the dominant scored (bounded)
        try:
            percentage = int(round((scores.get(dominant, 0) / max(1, total_possible)) * 100))
        except Exception:
            percentage = 0

        recommended_map = {
            "Short": ["advanced_react_patterns"],
            "Elaborate": ["typescript_deep_dive", "machine_learning_basics"],
            "Realistic": ["aws_developer", "hands_on_projects"],
        }

        result = {
            "user_category": dominant,
            "scores": scores,
            "percentage": percentage,
            "message": f"User mapped to {dominant} learning style",
            "recommended_courses": recommended_map.get(dominant, []),
        }
        return result

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze: {str(e)}")

# -------------------------
# learning-path endpoint
# Returns content from CSV if present, otherwise fallback embedded content
# -------------------------
@app.get("/learning-path/{course_name}")
def get_learning_path(course_name: str, mode: str = Query("Elaborate", enum=["Short", "Elaborate", "Realistic"])):
    try:
        # Attempt CSV dataset first
        filename = find_dataset_filename_for_course(course_name)
        data_records = None

        if filename:
            # try to load using pandas if available
            try:
                import pandas as pd
                import numpy as np
                file_path = os.path.join(DATASET_DIR, filename)
                df = pd.read_csv(file_path, encoding="utf-8", on_bad_lines="skip")
                # sanitize NaN to None
                df = df.replace({pd.NA: None}).replace({float("nan"): None})
                # apply mode filtering (deterministic)
                if mode == "Short":
                    df = df.sample(frac=0.5, random_state=42) if len(df) > 1 else df
                elif mode == "Realistic" and "difficulty" in df.columns:
                    df = df[df["difficulty"].isin(["Intermediate", "Advanced"])]
                    if len(df) == 0:
                        df = pd.read_csv(file_path, encoding="utf-8", on_bad_lines="skip")
                data_records = df.to_dict(orient="records")
            except Exception as e:
                # if pandas not available or read fails, fall back to embedded content below
                print(f"[WARN] Failed to load CSV dataset {filename}: {e}")
                data_records = None

        # If dataset not found or failed to load, use fallback embedded sample content
        if not data_records:
            # simple sample content for a few course slugs
            fallback_content_map = {
                "advanced_react_patterns": [
                    {
                        "module_id": 1,
                        "module_name": "Advanced React Patterns",
                        "topic_title": "Compound Components",
                        "content_summary": "Allows multiple components to work together as a cohesive unit; useful for flexible APIs.",
                        "code_example": "function Toggle({children}) { const [on,setOn] = React.useState(false); return React.Children.map(children, child => React.cloneElement(child, {on, toggle: () => setOn(!on)})); }",
                        "difficulty": "Advanced"
                    },
                    {
                        "module_id": 2,
                        "module_name": "Advanced React Patterns",
                        "topic_title": "Custom Hooks",
                        "content_summary": "Encapsulate reusable stateful logic to share across components.",
                        "code_example": "function useToggle(initial=false) { const [on,setOn] = React.useState(initial); const toggle = () => setOn(o => !o); return {on, toggle}; }",
                        "difficulty": "Intermediate"
                    },
                ],
                "aws_developer": [
                    {
                        "module_id": 1,
                        "module_name": "AWS Developer Path",
                        "topic_title": "Intro to AWS & IAM",
                        "content_summary": "Overview of AWS core services and Identity & Access Management basics.",
                        "code_example": "aws iam create-user --user-name demo-user",
                        "difficulty": "Beginner"
                    },
                    {
                        "module_id": 2,
                        "module_name": "AWS Developer Path",
                        "topic_title": "Lambda & Serverless",
                        "content_summary": "Build serverless functions and deploy with SAM or Serverless Framework.",
                        "code_example": "aws lambda create-function --function-name myFn --runtime python3.11 ...",
                        "difficulty": "Intermediate"
                    },
                ],
                "data_structures_algorithms": [
                    {
                        "module_id": 1,
                        "module_name": "DSA Fundamentals",
                        "topic_title": "Arrays & Strings",
                        "content_summary": "Basics of array and string manipulation and common techniques.",
                        "code_example": "function reverseString(s) { return s.split('').reverse().join(''); }",
                        "difficulty": "Beginner"
                    }
                ],
                "typescript_deep_dive": [
                    {
                        "module_id": 1,
                        "module_name": "TypeScript Deep Dive",
                        "topic_title": "Types & Interfaces",
                        "content_summary": "Understanding types, interfaces, unions and generics in TypeScript.",
                        "code_example": "type User = { id: number; name: string }; function greet(u: User){ console.log(u.name); }",
                        "difficulty": "Intermediate"
                    }
                ]
            }
            key = normalize_slug(course_name).replace(" ", "_")
            # try direct key, else try known slugs
            data_records = fallback_content_map.get(key) or fallback_content_map.get(course_name) or []

        # optionally filter by 'mode' to pick subset
        if mode == "Short" and isinstance(data_records, list) and len(data_records) > 1:
            # pick first half for quick path
            half = max(1, len(data_records) // 2)
            data_records = data_records[:half]
        elif mode == "Realistic" and isinstance(data_records, list):
            # prefer intermediate/advanced
            filtered = [r for r in data_records if r.get("difficulty") in ("Intermediate", "Advanced")]
            if filtered:
                data_records = filtered

        # sanitize possible NaN before returning
        data_records = replace_nan_with_none(data_records)

        return {
            "course_name": course_name,
            "dataset_filename": filename or "embedded_fallback",
            "learning_mode": mode,
            "total_modules": len(data_records),
            "content": data_records,
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load course data: {str(e)}")

# -------------------------
# Keep any admin/Supabase or interview code you already have below,
# or add extra endpoints. (I didn't modify any interview prep logic you said to preserve.)
# -------------------------

# Example admin endpoint placeholder (unchanged; remove if you don't use it)
class CreateUserPayload(BaseModel):
    email: str
    password: str

@app.post("/api/admin/create-user")
async def create_user(payload: CreateUserPayload):
    # This is a minimal placeholder — adapt to your httpx / supabase logic as needed.
    return {"ok": True, "user": {"email": payload.email}}
