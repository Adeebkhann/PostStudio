# Product Requirements Document (PRD)
## Project: PostStudio (AI Everyday LinkedIn Post Maker & Multi-Agent Architecture)

**Author:** John (BMAD Product Manager)  
**Collaborators:** Winston (Architecture), Sally (UX), Sophia (Storytelling), Carson (Brainstorming), DELL (Product Owner)  
**Date:** October 20, 2026  
**Status:** Approved & Implemented (v2.2 Production Release — Multi-Provider & Python Multi-Agent Core)

---

## 1. Executive Summary & Problem Statement

### 1.1 The Problem
LinkedIn creators, software engineers, and technology leaders face severe creative fatigue and repetitive workflows. Writing authentic, authoritative daily posts takes 30–60 minutes. Standard generative AI tools fail because:
1. **The "AI Slop" Smell:** Typical LLM output is contaminated with predictable buzzwords (*"delve", "testament", "tapestry", "game-changer", "revolutionize", "seamless"*), triggering instant reader skepticism.
2. **Single-Vendor Fragility:** Apps hardcoded to a single API model experience frequent 404/quota outages, regional limits, or version deprecations.
3. **Missing Technical Context:** Developers and architects need live intelligence on upcoming technology shifts, framework deprecations, and career leverage—not generic platitudes.
4. **Cluttered Visual Tools:** Canvas and visual generators are often overloaded with messy, unwanted blueprints and complicated templates rather than clean whiteboards.

### 1.2 The Solution: PostStudio 2.2
PostStudio is a distraction-free, high-authority creation studio featuring a **Python 3.13 Multi-Agent Core**, **Multi-Provider AI Gateway**, and **Live Tech Disruption Radar**:
- **Python Multi-Agent NLP Engine:** Semantic extraction, multi-cadence anti-AI synthesis, and live developer intelligence scraping executed in Python (FastAPI).
- **Multi-Provider Access Gateway:** Allows creators to choose their own AI provider (**Google Gemini**, **OpenAI GPT-4o**, **Anthropic Claude**, **Groq Cloud**, or **100% Offline Python Local**) and paste their own keys with live validation.
- **Live Tech & Job Radar:** Real-time developer intelligence scraper tracking emerging code trends, Big Tech executive announcements, and career/compensation implications with bold typography and high-stakes analysis.
- **Expanded Visual Workbench:** Clean, distraction-free whiteboard canvas free from cluttered example templates, equipped with custom shape, text, drawing, and high-resolution export tools.

---

## 2. Multi-Provider AI Access & Key Management

### 2.1 Supported AI Providers
Users can toggle between multiple enterprise AI backends without altering existing code or losing state:
1. **Google Gemini (v1beta):** Gemini 1.5 Flash, Gemini 2.0 Flash, and Gemini 1.5 Pro with dynamic model discovery to prevent 404 model-not-found errors.
2. **OpenAI GPT-4o:** GPT-4o and GPT-4o-mini structured intelligence for high-precision business and strategy posts.
3. **Anthropic Claude:** Claude 3.5 Sonnet and Haiku for long-form, reflective essays and nuanced technical perspectives.
4. **Groq Cloud:** Ultra-fast (500+ tokens/sec) inference powered by Llama 3.3 70B Versatile.
5. **Python Multi-Agent Core (Local):** 100% local, offline FastAPI NLP engine requiring zero external API keys and zero cost.

### 2.2 Access Gateway & Login Modal
- **First-Run Gateway:** Unauthenticated users are presented with a clean login modal to select their provider, paste their API key, test connectivity, or choose **"Continue as Guest / Python Local"**.
- **Live Credential Verification:** A dedicated **Test Key** action queries the provider's official model discovery endpoint and confirms model readiness before entering the studio.
- **Local Browser Storage:** API keys and credentials reside exclusively in the client's encrypted `localStorage`. No keys are persisted on third-party intermediary servers.
- **Header Profile & Quick Switch:** The active provider badge (`⚡ GEMINI`, `🤖 GPT-4O`, `🧠 CLAUDE`, `⚡ GROQ`, `🐍 PYTHON`) and user profile are surfaced in the top header, allowing one-click switching anytime.

---

## 3. Core Functional Pillars

### 3.1 Pillar 1: Thought-to-Post Multi-Cadence Engine
- **Input:** Single-sentence or paragraph thought, user profession, job role, and tone selection (`Auto`, `Contrarian`, `Story`, `Tactical`, `Observation`).
- **Processing:** Analyzes syntax and intent through Python multi-agent NLP heuristics, filtering out 20+ banned AI buzzwords and enforcing variable rhythm (burstiness).
- **Output:** Human-sounding post copy with preserved mobile formatting, actionable takeaways, and a debate-sparking conclusion.

### 3.2 Pillar 2: Dynamic Trending Tags Bar
- **Categorized Momentum:** Generates hashtags classified into `🔥 Trending Now`, `📈 Rising`, and `🎯 Core Industry`.
- **1-Click Injection:** Clicking a tag seamlessly toggles its presence at the bottom of the post text.
- **Live Regeneration:** Allows refreshing tags independently without regenerating the post copy.

### 3.3 Pillar 3: Tech & Job Disruption Radar
- **Live Intelligence Scraping:** Python HTTPX scraper monitors dev and tech dispatches across categories: *Job & Workflow Disruption*, *Big Tech Updates & Executive Words*, and *Emerging Tech & Next-Gen Code*.
- **Career & Leverage Enrichment:** Analyzes routine task commoditization vs. high-leverage engineering skills (\$200k–\$320k compensation impact, automated boilerplate vs. evaluation harnesses).
- **Enriched Typography:** Clean, large titles (`text-xl md:text-2xl`), readable summaries (`text-base`), pull quotes, and 1-click **"Remix to Studio"** buttons.

### 3.4 Pillar 4: Visual Workbench (Clean Whiteboard)
- **Distraction-Free Canvas:** Blank whiteboard surface stripped of pre-rendered clutter or unwanted example blueprints.
- **Creation Tools:** Shapes (rectangles, diamonds, circles, nodes), rich typography, drawing pens, grid snapping, and brand color palette swatches.
- **Direct Studio Integration:** Export visual directly into the Studio unfolding card or download as a high-resolution PNG.

### 3.5 Pillar 5: Executive Brand Kit & Settings
- **Watermarking & Customization:** Creator name, handle, job title, and brand palette automatically stamped onto exported visuals.
- **Python Core Diagnostics:** Status monitor for FastAPI backend (`http://127.0.0.1:8000`) with active endpoints and model discovery health.

---

## 4. Layout & UX Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│  TOP HEADER: [p. postmark / studio]  |  [⚡ GEMINI 1.5/2.0]  |  [🐍 PYTHON ACTIVE]  | [👤 User]│
├─────────────────────────────────┬──────────────────────────────────┬────────────────────────┤
│  LEFT SIDEBAR                   │  CENTER STAGE                    │  RIGHT SIDEBAR         │
│                                 │                                  │                        │
│  YOUR STUDIO                    │  Header: Good ideas start        │  Card: A GOOD REMINDER │
│  - Today's studio (active)      │          with a thought.         │  "Useful beats         │
│  - Visual Workbench             │                                  │   impressive..."       │
│  - Tech & Job Radar             │  [ Card 01: What's on your mind? ]│                        │
│  - Drafts (count badge)         │  • Character counter + Voice Mic │  Card: STATUS & CADENCE│
│  - Settings & Keys              │  • Auto / Contrarian / Tactical  │  • Multi-Provider Active│
│                                 │  • [ Generate Post ✨ (Cmd+Enter) ]│                        │
│  YOUR POINT OF VIEW             │                                  │                        │
│  • Profession: [Software Tech▼] │  ▼▼▼ UNFOLDS INLINE BELOW ▼▼▼    │                        │
│  • Your role:  [Lead Architect] │  [ Card 02: Generated Output ]   │                        │
│                                 │  • Human Post Copy (Editable)    │                        │
│  [Offline Mode / Copy Status]   │  • 🔥 REAL-TIME TRENDING TAGS    │                        │
│                                 │  • Surreal AI Artwork / Ast      │                        │
│                                 │  • [Copy Text] [Save Draft]      │                        │
└─────────────────────────────────┴──────────────────────────────────┴────────────────────────┘
```

---

## 5. Technical Specifications & Dependencies

- **Frontend Application:** React 18, Vite 5, TypeScript 5, TailwindCSS 4, Lucide Icons, Framer Motion, HTML2Canvas.
- **Python Multi-Agent Backend:** Python 3.13+, FastAPI, Uvicorn, HTTPX, Pydantic v2.
- **AI Integrations:**
  - Google Gemini API (`/v1beta/models`, `generateContent`)
  - OpenAI REST API (`/v1/chat/completions`, `/v1/models`)
  - Groq Cloud API (`/openai/v1/chat/completions`)
  - Anthropic Messages API
- **Persistence:** LocalStorage adapter with zero external telemetry, zero forced registration, and offline-first design.
