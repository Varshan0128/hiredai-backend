# backend/main.py
import os
import math
import typing as t
import difflib
import urllib.parse
from pathlib import Path
import logging
import time
import re
from fastapi.responses import Response

from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel

import openai
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger("hiredai")
logger.info("Loaded backend from file: %s", __file__)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if OPENAI_API_KEY:
    openai.api_key = OPENAI_API_KEY

app = FastAPI(title="HiredAI Backend (final corrected)")

_allowed = os.getenv("FRONTEND_ORIGINS", "")
if _allowed:
    FRONTEND_ORIGINS = [s.strip() for s in _allowed.split(",") if s.strip()]
else:
    FRONTEND_ORIGINS = [
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://hiredai-frontend-qdsonjees-kvarshan2007-5873s-projects.vercel.app",
    ]

logger.info("Allowed CORS origins: %s", FRONTEND_ORIGINS)
# allow any vercel preview hostname like https://<something>.vercel.app
ALLOW_ORIGIN_REGEX = r"^https:\/\/[A-Za-z0-9-]+\.vercel\.app$"
logger.info("Allowed CORS origin regex: %s", ALLOW_ORIGIN_REGEX)


app.add_middleware(
    CORSMiddleware,
    allow_origins=FRONTEND_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- safe preflight OPTIONS handler ---
_origin_re = re.compile(ALLOW_ORIGIN_REGEX)

@app.options("/{rest_of_path:path}", include_in_schema=False)
async def preflight_handler(rest_of_path: str, request: Request):
    """
    Handles automatic preflight OPTIONS requests for any path.
    Returns Access-Control-Allow-* headers only when the Origin is allowed
    (either in explicit FRONTEND_ORIGINS or matches the ALLOW_ORIGIN_REGEX).
    """
    origin = request.headers.get("origin")
    logger.info("Preflight OPTIONS for %s from Origin=%s", rest_of_path, origin)

    if not origin:
        return Response(status_code=200)

    if origin in FRONTEND_ORIGINS or _origin_re.match(origin):
        headers = {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
            "Access-Control-Allow-Headers": request.headers.get("access-control-request-headers", "*"),
            "Access-Control-Allow-Credentials": "true",
        }
        return Response(status_code=200, headers=headers)

    logger.warning("Blocked preflight from origin: %s", origin)
    return Response(status_code=403, content="Origin not allowed")


# Simple request logging middleware to show incoming paths and response status
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    path = request.url.path
    logger.info("Incoming request: %s %s", request.method, path)
    response = await call_next(request)
    duration = (time.time() - start) * 1000
    logger.info("Completed %s %s -> %s (%.1fms)", request.method, path, response.status_code, duration)
    return response

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.path.join(BASE_DIR, "datasets")
os.makedirs(DATASET_DIR, exist_ok=True)

FRONTEND_DIST_DIR = os.path.join(BASE_DIR, "dist")
if os.path.isdir(FRONTEND_DIST_DIR):
    logger.info("Found frontend dist at %s - mounting static files", FRONTEND_DIST_DIR)
    app.mount("/static", StaticFiles(directory=os.path.join(FRONTEND_DIST_DIR, "assets")), name="static_assets")


# -------------------------
# Models
# -------------------------
class PromptRequest(BaseModel):
    prompt: str
    max_tokens: t.Optional[int] = 200
    temperature: t.Optional[float] = 0.6

class AssessmentScores(BaseModel):
    Realistic: int
    Elaborate: int
    Short: int

class PsychologyAssessmentResult(BaseModel):
    dominantStyle: str
    scores: AssessmentScores
    percentage: int


# -------------------------
# Utilities
# -------------------------
def replace_nan_with_none(obj):
    if isinstance(obj, dict):
        return {k: replace_nan_with_none(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [replace_nan_with_none(x) for x in obj]
    if isinstance(obj, float) and math.isnan(obj):
        return None
    return obj

def normalize_text_for_match(s: str) -> str:
    if s is None:
        return ""
    s = s.strip().lower()
    for ch in ("-", "_", ".", "/"):
        s = s.replace(ch, " ")
    s = " ".join(s.split())
    return s

def tokens_from(s: str):
    return [t for t in normalize_text_for_match(s).split(" ") if t]

def find_dataset_filename_for_course(course_name: str) -> t.Optional[str]:
    if not os.path.isdir(DATASET_DIR):
        logger.error("DATASET_DIR not found: %s", DATASET_DIR)
        return None

    files = [f for f in os.listdir(DATASET_DIR) if f.lower().endswith(".csv")]
    if not files:
        logger.warning("No CSV files found in DATASET_DIR: %s", DATASET_DIR)
        return None

    try:
        decoded = urllib.parse.unquote(course_name)
    except Exception:
        decoded = course_name
    norm_input = normalize_text_for_match(decoded)
    logger.info("find_dataset: raw='%s' decoded='%s' normalized='%s'", course_name, decoded, norm_input)

    lower_map = {f.lower(): f for f in files}
    basenames = {os.path.splitext(f)[0].lower(): f for f in files}

    candidates = set()
    candidates.add(f"{norm_input.replace(' ', '_')}_learning.csv")
    candidates.add(f"{norm_input.replace(' ', '-')}_learning.csv")
    candidates.add(f"{norm_input.replace(' ', '')}_learning.csv")
    candidates.add(f"{norm_input}_learning.csv")
    candidates.add(f"{norm_input.replace(' ', '_')}.csv")
    candidates.add(f"{norm_input.replace(' ', '-')}.csv")
    candidates.add(f"{norm_input}.csv")

    for cand in candidates:
        if cand in lower_map:
            logger.info("Matched candidate filename: %s -> %s", cand, lower_map[cand])
            return lower_map[cand]

    input_tokens = tokens_from(norm_input)
    if input_tokens:
        for base_lower, orig_filename in basenames.items():
            if all(tok in base_lower for tok in input_tokens):
                logger.info("Matched by token containment: input tokens %s -> %s", input_tokens, orig_filename)
                return orig_filename

    try:
        keys = list(basenames.keys())
        matches = difflib.get_close_matches(norm_input, keys, n=1, cutoff=0.55)
        if matches:
            matched_base = basenames[matches[0]]
            logger.info("Fuzzy matched '%s' -> '%s'", norm_input, matched_base)
            return matched_base
    except Exception as e:
        logger.exception("Fuzzy matching error: %s", e)

    for base_lower, orig_filename in basenames.items():
        if any(tok in base_lower for tok in input_tokens):
            logger.info("Lenient token match (any token) matched %s -> %s", input_tokens, orig_filename)
            return orig_filename

    logger.warning("No matching dataset file for '%s'. Available: %s", course_name, files)
    return None


# -------------------------
# Root / health / API endpoints (ALL defined BEFORE API fallback)
# -------------------------
@app.get("/api/health")
def health():
    return {"status": "ok", "dataset_dir": DATASET_DIR, "dataset_count": len([f for f in os.listdir(DATASET_DIR) if f.lower().endswith('.csv')])}

@app.get("/api/check-data")
async def check_data():
    if not os.path.isdir(DATASET_DIR):
        raise HTTPException(status_code=404, detail="Datasets directory not found.")
    available_files = [f for f in os.listdir(DATASET_DIR) if f.lower().endswith(".csv")]
    return {"available_files": available_files, "available_datasets": [os.path.splitext(f)[0] for f in available_files]}


@app.post("/api/generate-answer")
async def generate_answer(req: PromptRequest):
    if not OPENAI_API_KEY:
        return {"answer": "💡 (Local fallback) Structure answers with STAR: Situation, Task, Action, Result."}
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an interview coach that writes concise STAR-format answers."},
                {"role": "user", "content": req.prompt},
            ],
            max_tokens=req.max_tokens or 200,
            temperature=req.temperature or 0.6,
            n=1,
        )
        answer = response["choices"][0]["message"]["content"].strip()
        return {"answer": answer}
    except Exception as e:
        logger.exception("OpenAI error")
        return {"answer": f"Error: AI generation failed ({str(e)})"}


@app.post("/api/predict-learning-path")
async def predict_learning_path(assessment_result: PsychologyAssessmentResult):
    try:
        dominant = assessment_result.dominantStyle
        scores = assessment_result.scores.dict()
        percentage = assessment_result.percentage
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
        logger.info("Predicted learning path for %s -> %s", dominant, result["recommended_courses"])
        return result
    except Exception as e:
        logger.exception("Error predicting learning path")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/learning-path/{course_name}")
def get_learning_path(course_name: str, mode: str = Query("Elaborate", enum=["Short", "Elaborate", "Realistic"])):
    logger.info("Request learning-path for '%s' mode=%s", course_name, mode)
    try:
        filename = find_dataset_filename_for_course(course_name)
        logger.info("find_dataset_filename_for_course returned: %s", filename)
        if not filename:
            raise HTTPException(status_code=404, detail=f"Learning path data not found for course: {course_name}")

        file_path = os.path.join(DATASET_DIR, filename)
        if not os.path.isfile(file_path):
            logger.error("Expected dataset file missing at path: %s", file_path)
            raise HTTPException(status_code=404, detail=f"Dataset file not found at expected path: {file_path}")

        try:
            import pandas as pd
            df = pd.read_csv(file_path, encoding="utf-8", on_bad_lines="skip")
            df = df.where(pd.notnull(df), None)

            if mode == "Short":
                df = df.sample(frac=0.5, random_state=42) if len(df) > 1 else df
            elif mode == "Realistic" and "difficulty" in df.columns:
                df = df[df["difficulty"].isin(["Intermediate", "Advanced"])]
                if len(df) == 0:
                    logger.info("No Intermediate/Advanced found for Realistic mode; using full dataset")
                    df = pd.read_csv(file_path, encoding="utf-8", on_bad_lines="skip")

            data_records = df.to_dict(orient="records")
        except Exception as e:
            logger.exception("Error reading CSV %s: %s", file_path, e)
            raise HTTPException(status_code=500, detail=f"Error loading course data: {str(e)}")

        if not data_records:
            logger.warning("No records in dataset, using fallback embedded content for course: %s", course_name)
            fallback_content_map = {
                "advanced_react_patterns": [
                    {"module_id": 1, "module_name": "Advanced React Patterns", "topic_title": "Compound Components", "content_summary": "Allows multiple components to work together", "difficulty": "Advanced"},
                    {"module_id": 2, "module_name": "Advanced React Patterns", "topic_title": "Custom Hooks", "content_summary": "Encapsulate reusable stateful logic", "difficulty": "Intermediate"},
                ]
            }
            key = normalize_text_for_match(course_name).replace(" ", "_")
            data_records = fallback_content_map.get(key, [])

        data_records = replace_nan_with_none(data_records)
        return {
            "course_name": course_name,
            "dataset_filename": filename,
            "learning_mode": mode,
            "total_modules": len(data_records),
            "content": data_records,
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Unhandled exception in get_learning_path: %s", e)
        raise HTTPException(status_code=500, detail=str(e))


# -------------------------
# API fallback: declared AFTER real API routes so it only catches unknown API paths
# -------------------------
@app.get("/api/{rest:path}", include_in_schema=False)
def api_fallback(rest: str):
    logger.info("API fallback triggered for path: /api/%s", rest)
    raise HTTPException(status_code=404, detail="API endpoint not found.")


# -------------------------
# Serve frontend index + SPA fallback (non-API paths)
# -------------------------
@app.get("/", include_in_schema=False)
def serve_root():
    index_path = os.path.join(FRONTEND_DIST_DIR, "index.html")
    if os.path.isfile(index_path):
        return FileResponse(index_path, media_type="text/html")
    return JSONResponse({"message": "Backend running. No frontend build found."})


@app.get("/{full_path:path}", include_in_schema=False)
def spa_fallback(full_path: str, request: Request):
    normalized = (full_path or "").lstrip("/")
    if normalized.lower().startswith("api/") or normalized.lower() == "api":
        logger.info("SPA fallback blocking API path: %s", normalized)
        return JSONResponse({"detail": "Not Found."}, status_code=404)

    requested = os.path.join(FRONTEND_DIST_DIR, full_path)
    if os.path.isfile(requested):
        return FileResponse(requested)
    index_path = os.path.join(FRONTEND_DIST_DIR, "index.html")
    if os.path.isfile(index_path):
        return FileResponse(index_path, media_type="text/html")
    return JSONResponse({"message": "Backend running. No frontend build found."})


# -------------------------
# Admin sample
# -------------------------
class CreateUserPayload(BaseModel):
    email: str
    password: str

@app.post("/api/admin/create-user")
async def create_user(payload: CreateUserPayload):
    return {"ok": True, "user": {"email": payload.email}}