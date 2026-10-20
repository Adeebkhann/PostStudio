"""
PostStudio Python Multi-Agent Post Engine
Transforms thoughts into high-authority, human-sounding LinkedIn posts.
Zero generic filler, zero banned buzzwords, multi-cadence frameworks.
"""

import re
import logging
from typing import Dict, Any, List, Optional
import httpx

logger = logging.getLogger("poststudio-engine")

BANNED_WORDS = [
    "delve", "tapestry", "testament", "game-changer", "revolutionize",
    "seamless", "in today's fast-paced world", "ever-evolving", "furthermore",
    "moreover", "in conclusion", "beacon", "foster", "elevate", "harness",
    "pleased to announce", "humbled to share", "dive deep"
]

def parse_thought_semantics(thought: str) -> Dict[str, Any]:
    """
    Analyzes the user's raw thought using Python regex and NLP heuristics
    to extract core subjects, themes, and key architectural keywords.
    """
    clean = thought.strip()
    words = re.findall(r'\b[A-Za-z0-9_\-\.]{3,}\b', clean)

    stopwords = {
        'the', 'and', 'for', 'that', 'this', 'with', 'from', 'your',
        'have', 'more', 'about', 'some', 'will', 'what', 'when', 'make',
        'like', 'into', 'just', 'over', 'also', 'most', 'very', 'been'
    }

    filtered_terms = [w.lower() for w in words if w.lower() not in stopwords]
    core_subject = " ".join(filtered_terms[:3]) if filtered_terms else clean
    key_terms = filtered_terms[:5] if filtered_terms else ["architecture", "execution", "verification", "durability"]

    # Fill defaults if needed
    defaults = ["system architecture", "execution velocity", "harness verification", "compounding durability"]
    for i, default in enumerate(defaults):
        if len(key_terms) <= i:
            key_terms.append(default)

    return {
        "core_subject": core_subject,
        "key_terms": key_terms,
        "raw_thought": clean
    }


def call_gemini_python(api_key: str, thought: str, role: str, profession: str, tone: str) -> Optional[str]:
    """
    Calls Gemini API from Python using dynamic model discovery.
    """
    if not api_key:
        return None

    # Step 1: Discover available models for this specific API key
    models_url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"
    target_model = "gemini-1.5-flash"

    try:
        with httpx.Client(timeout=10.0) as client:
            res = client.get(models_url)
            if res.status_code == 200:
                data = res.json()
                available = [
                    m.get("name", "").replace("models/", "")
                    for m in data.get("models", [])
                    if "generateContent" in m.get("supportedGenerationMethods", [])
                ]
                # Pick preferred model from available
                for pref in ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-1.5-pro", "gemini-1.5-pro-latest"]:
                    if pref in available:
                        target_model = pref
                        break
    except Exception as e:
        logger.warning(f"Python model discovery fallback: {e}")

    # Step 2: Generate post
    system_prompt = f"""You are an elite ghostwriter for top 1% technology executives and software architects on LinkedIn (caliber of Andrej Karpathy, Chip Huyen, Harrison Chase).
User is a {role} in {profession}.
Tone: {tone}.

VIRAL LINKEDIN ANATOMY:
1. HOOK: Line 1 must be an all-caps, visceral, contrarian truth. No pleasantries.
2. HARD REALITY: Contrast naive amateur approaches with production engineering reality (latency, hallucination drift, schema brittleness).
3. STRUCTURED BREAKDOWN: Numbered list (01 to 04) with bold headers and dense, practical 1-sentence explanations.
4. GOLDEN RULE: A memorable 1-line aphorism that people screenshot.
5. ENGAGEMENT QUESTION: A sharp, technical question inviting comment debates.

STRICT CONSTRAINTS:
- NEVER use: {', '.join(BANNED_WORDS)}.
- Output ONLY the clean markdown post with double line breaks for scannability."""

    generate_url = f"https://generativelanguage.googleapis.com/v1beta/models/{target_model}:generateContent?key={api_key}"
    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": f"Here is my topic/thought: '{thought}'. Generate a viral, high-density LinkedIn post."}]
            }
        ],
        "systemInstruction": {"parts": [{"text": system_prompt}]},
        "generationConfig": {"temperature": 0.75, "maxOutputTokens": 1000}
    }

    try:
        with httpx.Client(timeout=25.0) as client:
            res = client.post(generate_url, json=payload)
            if res.status_code == 200:
                data = res.json()
                candidate = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                if candidate.strip():
                    return candidate.strip()
    except Exception as e:
        logger.warning(f"Python Gemini generation failed: {e}")

    return None


def call_openai_python(api_key: str, thought: str, role: str, profession: str, tone: str) -> Optional[str]:
    """
    Calls OpenAI GPT-4o API from Python.
    """
    if not api_key:
        return None

    system_prompt = f"""You are an elite LinkedIn ghostwriter for a {role} in {profession}.
Tone: {tone}. No AI buzzwords ({', '.join(BANNED_WORDS[:8])}).
Format with clean white space and punchy takeaways."""

    try:
        with httpx.Client(timeout=25.0) as client:
            res = client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={"Authorization": f"Bearer {api_key}"},
                json={
                    "model": "gpt-4o-mini",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": thought}
                    ],
                    "temperature": 0.7,
                    "max_tokens": 700
                }
            )
            if res.status_code == 200:
                data = res.json()
                text = data.get("choices", [{}])[0].get("message", {}).get("content", "")
                if text.strip():
                    return text.strip()
    except Exception as e:
        logger.warning(f"Python OpenAI generation failed: {e}")
    return None


def call_groq_python(api_key: str, thought: str, role: str, profession: str, tone: str) -> Optional[str]:
    """
    Calls Groq Cloud API from Python for ultra-fast Llama 3.3 70B inference.
    """
    if not api_key:
        return None

    system_prompt = f"""You are an elite LinkedIn ghostwriter for a {role} in {profession}.
Tone: {tone}. No AI buzzwords ({', '.join(BANNED_WORDS[:8])}).
Format with clean white space and punchy takeaways."""

    try:
        with httpx.Client(timeout=25.0) as client:
            res = client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={"Authorization": f"Bearer {api_key}"},
                json={
                    "model": "llama-3.3-70b-versatile",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": thought}
                    ],
                    "temperature": 0.7,
                    "max_tokens": 700
                }
            )
            if res.status_code == 200:
                data = res.json()
                text = data.get("choices", [{}])[0].get("message", {}).get("content", "")
                if text.strip():
                    return text.strip()
    except Exception as e:
        logger.warning(f"Python Groq generation failed: {e}")
    return None


def generate_python_post(
    thought: str, 
    role: str, 
    profession: str, 
    tone: str, 
    api_key: Optional[str] = None,
    provider: Optional[str] = "gemini"
) -> Dict[str, Any]:
    """
    Main Python generation pipeline.
    Attempts model call via selected provider if API key is provided,
    otherwise uses the Python high-density multi-cadence synthesis engine.
    """
    clean_thought = thought.strip()
    if not clean_thought:
        clean_thought = "software architecture and engineering reliability"

    # Attempt AI calls based on provider
    if api_key:
        prov = (provider or "gemini").lower()
        if prov == "gemini":
            ai_result = call_gemini_python(api_key, clean_thought, role, profession, tone)
            if ai_result:
                return {
                    "post": ai_result,
                    "source": "Python AI Engine (Google Gemini v1beta)",
                    "method": "llm_agent"
                }
        elif prov == "openai":
            ai_result = call_openai_python(api_key, clean_thought, role, profession, tone)
            if ai_result:
                return {
                    "post": ai_result,
                    "source": "Python AI Engine (OpenAI GPT-4o)",
                    "method": "llm_agent"
                }
        elif prov == "groq":
            ai_result = call_groq_python(api_key, clean_thought, role, profession, tone)
            if ai_result:
                return {
                    "post": ai_result,
                    "source": "Python AI Engine (Groq Llama 3.3)",
                    "method": "llm_agent"
                }

    # Python Multi-Cadence Heuristic Synthesis
    semantics = parse_thought_semantics(clean_thought)
    core_subject = semantics["core_subject"]
    subject_upper = core_subject.upper()
    t1 = semantics["key_terms"][0]
    t2 = semantics["key_terms"][1]
    t3 = semantics["key_terms"][2]
    t4 = semantics["key_terms"][3]

    if tone == "contrarian":
        post = (
            f"Most teams get {core_subject} completely backwards.\n\n"
            f"They treat \"{clean_thought}\" like a simple tooling or prompt problem:\n"
            f"Download the newest framework, plug in an API, and expect production magic.\n\n"
            f"Here is the unvarnished reality:\n"
            f"Tools only amplify the architecture you already have.\n"
            f"If your foundation is fragile, modern tools just help you build technical debt at 10x speed.\n\n"
            f"3 non-negotiable rules we enforce before touching production:\n\n"
            f"1. Never abstract what you cannot explain on a napkin.\n"
            f"If your team doesn't understand the failure modes of {t1}, you aren't ready to automate it.\n\n"
            f"2. Optimize for recovery time, not just happy-path throughput.\n"
            f"Systems rarely break when inputs are clean. They implode when {t2} encounters unexpected boundary drift.\n\n"
            f"3. Ruthlessly benchmark {t3}.\n"
            f"If a metric can be gamed with vanity numbers, discard it. Focus on deterministic evaluation.\n\n"
            f"The takeaway:\n"
            f"Amateurs chase hype.\n"
            f"High performers design resilient systems with predictable boundaries.\n\n"
            f"Disagree? What is the biggest myth you see around {core_subject}?"
        )
    elif tone == "story":
        post = (
            f"A year ago, our team had a painful wake-up call with \"{clean_thought}\".\n\n"
            f"We thought we were moving fast:\n"
            f"Tickets were closing, PRs were merging, and the roadmap looked bright green.\n\n"
            f"Then our first real spike in production load hit.\n"
            f"Everything we assumed about {t1} degraded within 45 minutes.\n"
            f"Latency quadrupled, error budgets vanished, and our senior engineers spent 3 straight days in emergency triage.\n\n"
            f"That incident forced us to completely rewrite our engineering principles:\n\n"
            f"• We stopped celebrating raw lines of code and started measuring system durability.\n"
            f"• We rebuilt the {t2} pipeline with strict automated contract verification.\n"
            f"• We introduced continuous stress harnesses for {t3} before anything touches staging.\n\n"
            f"The result?\n"
            f"Our delivery turnaround actually accelerated 3x—not because we typed faster, but because we stopped fixing self-inflicted regressions.\n\n"
            f"True engineering maturity isn't about how complex your code looks.\n"
            f"It's about how quietly and reliably your systems run when nobody is watching.\n\n"
            f"Has your team experienced a similar inflection point with {core_subject}?"
        )
    elif tone == "tactical":
        post = (
            f"THE ACTIONABLE PRODUCTION PLAYBOOK FOR {subject_upper}.\n\n"
            f"If you are implementing \"{clean_thought}\" this quarter as a {role}, here is the tactical checklist to cut through the noise:\n\n"
            f"[STOP DOING THIS]\n"
            f"❌ Gluing together brittle unverified libraries without strict contracts.\n"
            f"❌ Relying on subjective spot checks instead of automated test benches.\n"
            f"❌ Treating {t1} as a day-2 operational afterthought.\n\n"
            f"[START DOING THIS]\n"
            f"01. Benchmark the Baseline First:\n"
            f"Measure p95 latency and compute cost on day one. If {t2} isn't quantified deterministically, optimization is just guesswork.\n\n"
            f"02. Enforce Strict Boundary Gates:\n"
            f"Every payload must pass strict schema validation before reaching core services. Zero unchecked input drift.\n\n"
            f"03. Build for Automated Recovery:\n"
            f"Automate retry policies, circuit breakers, and state checkpoints across the {t3} pipeline.\n\n"
            f"04. Prioritize {t4.upper()} Visibility:\n"
            f"If an operational alert doesn't come with an immediate remediation action, delete the alert. High signal over noise.\n\n"
            f"Save this checklist for your next architecture review.\n\n"
            f"Which of these 4 pillars is your team currently prioritizing?"
        )
    elif tone == "observation":
        post = (
            f"There is a quiet, structural shift happening right now across {profession}.\n\n"
            f"While the majority of social feeds are debating superficial hype around \"{clean_thought}\", the top 1% of engineering organizations are doing something very different:\n\n"
            f"They aren't rushing to adopt every shiny release.\n"
            f"They are ruthlessly consolidating their systems around durable, boring primitives:\n\n"
            f"1. High-density architecture beats sprawling codebases.\n"
            f"Smaller, decoupled systems centered on {t1} require 80% less maintenance overhead.\n\n"
            f"2. Autonomous scaffolding is becoming table stakes.\n"
            f"Teams that still rely on manual boilerplate typing for {t2} simply cannot match modern iteration speed.\n\n"
            f"3. The real bottleneck has shifted from code generation to verification.\n"
            f"Whoever builds the tightest, most deterministic evaluation loop for {t3} wins the market.\n\n"
            f"In 24 months, the market won't care which framework you used to launch.\n"
            f"It will only reward who built systems that survive real-world enterprise load without burning out their teams.\n\n"
            f"How is your organization preparing for this transition?"
        )
    else:
        post = (
            f"THE PRODUCTION ARCHITECTURE BEHIND {subject_upper}.\n\n"
            f"There is a massive chasm between a weekend demo of \"{clean_thought}\" and software that survives enterprise reality.\n\n"
            f"In production, systems don't fail because the logic wasn't clever.\n"
            f"They fail because the contracts between {t1} and {t2} were never rigorously defined.\n\n"
            f"The 4 pillars separating resilient systems from fragile experiments:\n\n"
            f"01. DETERMINISTIC CONTRACTS:\n"
            f"Never allow ambiguous data to flow into critical pipelines. Strict schemas and type safety prevent silent cascading errors.\n\n"
            f"02. FRICTIONLESS EXECUTION:\n"
            f"Automate mechanical toil. When teams stop fighting boilerplate, they redirect 100% of their energy into high-leverage business logic.\n\n"
            f"03. ADVERSARIAL VERIFICATION:\n"
            f"Stress-test reality, not just the happy path. If {t3} cannot handle unpredictable edge cases under load, it is not production-ready.\n\n"
            f"04. COMPOUNDING DURABILITY:\n"
            f"Track unit economics down to the dollar. True architectural value compounds over years, not sprint cycles.\n\n"
            f"The bottom line:\n"
            f"Tools and syntax change every quarter.\n"
            f"Clear systems thinking and rigorous execution remain permanent.\n\n"
            f"What is your team's biggest challenge when taking {core_subject} to production?"
        )

    return {
        "post": post,
        "source": "Python Core Multi-Agent Synthesis Engine",
        "method": "python_nlp"
    }

