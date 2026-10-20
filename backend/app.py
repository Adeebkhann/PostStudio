"""
PostStudio Python & Multi-Agent FastAPI Backend
Powers Post Generation, Model Discovery, and Tech Disruption Radar.
"""

import os
import logging
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from pydantic import BaseModel
import httpx

from post_engine import generate_python_post
from radar_engine import fetch_python_radar_feed

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("poststudio-backend")

app = FastAPI(
    title="PostStudio Python Core Backend",
    description="Python 3.13 Multi-Agent Engine for High-Density LinkedIn Posts & Tech Disruption Radar",
    version="2.1.0"
)

# Enable CORS for React frontend (ports 3000, 5173, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------

class GenerateRequest(BaseModel):
    thought: str
    profession: Optional[str] = "Technology & Software"
    role: Optional[str] = "Principal Architect"
    tone: Optional[str] = "auto"
    apiKey: Optional[str] = None
    provider: Optional[str] = "gemini"


class GenerateResponse(BaseModel):
    post: str
    hook: str
    takeaways: List[str]
    tags: List[str]
    source: str
    method: str


class KeyTestRequest(BaseModel):
    apiKey: str
    provider: Optional[str] = "gemini"


class KeyTestResponse(BaseModel):
    valid: bool
    message: str
    activeModel: Optional[str] = None
    availableModels: List[str] = []


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "engine": "PostStudio Python Multi-Agent Backend",
        "python_version": "3.13.5",
        "framework": "FastAPI + Uvicorn",
        "features": [
            "NLP Semantic Parsing",
            "Multi-Cadence Anti-AI Synthesis",
            "Dynamic Gemini Model Discovery",
            "Live Radar Intelligence Scraper"
        ]
    }


@app.post("/api/generate/deep", response_model=GenerateResponse)
def generate_deep_post(req: GenerateRequest):
    """
    Executes the Python multi-agent post generation pipeline.
    """
    result = generate_python_post(
        thought=req.thought,
        role=req.role or "Principal Architect",
        profession=req.profession or "Technology & Software",
        tone=req.tone or "auto",
        api_key=req.apiKey,
        provider=req.provider or "gemini"
    )

    post_text = result["post"]
    lines = [l.strip() for l in post_text.split("\n") if l.strip()]
    hook = lines[0] if lines else req.thought

    # Generate relevant Python/Tech tags
    t_lower = req.thought.lower()
    tags = ["#Engineering", "#SoftwareArchitecture", "#TechLeadership"]
    if "python" in t_lower or "code" in t_lower or "rust" in t_lower:
        tags = ["#Python", "#Backend", "#DevOps", "#Programming"]
    elif "ai" in t_lower or "rag" in t_lower or "agent" in t_lower:
        tags = ["#GenerativeAI", "#AIEngineering", "#LLM", "#SystemDesign"]

    return GenerateResponse(
        post=post_text,
        hook=hook,
        takeaways=[
            "Deterministic contracts prevent cascading runtime errors",
            "Automate toil so teams focus on high-leverage business logic",
            "Evaluate edge cases under load before shipping to production"
        ],
        tags=tags,
        source=result["source"],
        method=result["method"]
    )


@app.get("/api/radar/feed")
def get_radar_feed(page: int = 1):
    """
    Scrapes and processes live developer feeds using Python.
    """
    articles = fetch_python_radar_feed(page=page)
    return {
        "articles": articles,
        "page": page,
        "count": len(articles),
        "source": "Python Live Intelligence Scraper"
    }


@app.post("/api/test-key", response_model=KeyTestResponse)
def test_provider_key(req: KeyTestRequest):
    """
    Tests the user's API key against the selected provider (Gemini, OpenAI, Groq),
    dynamically discovers supported models, and returns verified status.
    """
    key = req.apiKey.strip()
    if not key:
        return KeyTestResponse(
            valid=False,
            message="Please provide an API key.",
            availableModels=[]
        )

    provider = (req.provider or "gemini").lower()

    # 1. OpenAI verification
    if provider == "openai":
        try:
            with httpx.Client(timeout=10.0) as client:
                res = client.get("https://api.openai.com/v1/models", headers={"Authorization": f"Bearer {key}"})
                if res.status_code == 200:
                    data = res.json()
                    models = [m.get("id") for m in data.get("data", []) if "gpt" in m.get("id", "")]
                    return KeyTestResponse(
                        valid=True,
                        message="✓ OpenAI Key is Valid! Active Model: gpt-4o-mini",
                        activeModel="gpt-4o-mini",
                        availableModels=models[:10]
                    )
                else:
                    return KeyTestResponse(
                        valid=False,
                        message=f"OpenAI Key verification failed (HTTP {res.status_code})",
                        availableModels=[]
                    )
        except Exception as e:
            return KeyTestResponse(valid=False, message=f"OpenAI error: {str(e)}", availableModels=[])

    # 2. Groq verification
    if provider == "groq":
        try:
            with httpx.Client(timeout=10.0) as client:
                res = client.get("https://api.groq.com/openai/v1/models", headers={"Authorization": f"Bearer {key}"})
                if res.status_code == 200:
                    return KeyTestResponse(
                        valid=True,
                        message="✓ Groq Key is Valid! Active Model: llama-3.3-70b-versatile",
                        activeModel="llama-3.3-70b-versatile",
                        availableModels=["llama-3.3-70b-versatile", "llama-3.1-8b-instant"]
                    )
                else:
                    return KeyTestResponse(
                        valid=False,
                        message=f"Groq Key verification failed (HTTP {res.status_code})",
                        availableModels=[]
                    )
        except Exception as e:
            return KeyTestResponse(valid=False, message=f"Groq error: {str(e)}", availableModels=[])

    # 3. Google Gemini verification (Default)
    url = f"https://generativelanguage.googleapis.com/v1beta/models?key={key}"

    try:
        with httpx.Client(timeout=10.0) as client:
            res = client.get(url)
            if res.status_code == 200:
                data = res.json()
                models = [
                    m.get("name", "").replace("models/", "")
                    for m in data.get("models", [])
                    if "generateContent" in m.get("supportedGenerationMethods", [])
                ]

                # Pick the best model available
                best = "gemini-1.5-flash"
                for candidate in ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-1.5-pro", "gemini-1.5-pro-latest"]:
                    if candidate in models:
                        best = candidate
                        break

                return KeyTestResponse(
                    valid=True,
                    message=f"✓ Google Gemini Key is Valid! Active Model: {best}",
                    activeModel=best,
                    availableModels=models[:10]
                )
            else:
                err_msg = f"HTTP {res.status_code}"
                try:
                    err_data = res.json()
                    err_msg = err_data.get("error", {}).get("message", err_msg)
                except Exception:
                    pass
                return KeyTestResponse(
                    valid=False,
                    message=f"Google API Key verification failed: {err_msg}",
                    availableModels=[]
                )
    except Exception as e:
        return KeyTestResponse(
            valid=False,
            message=f"Connection error: {str(e)}",
            availableModels=[]
        )


# ---------------------------------------------------------------------------
# Mount Built React Frontend (For Single-Server & Cloud Deployments)
# ---------------------------------------------------------------------------
dist_dir = Path(__file__).resolve().parent.parent / "dist"
if dist_dir.exists():
    logger.info(f"Mounting static frontend build from {dist_dir}")
    app.mount("/", StaticFiles(directory=str(dist_dir), html=True), name="static")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
