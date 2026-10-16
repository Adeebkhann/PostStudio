# Product Requirements Document (PRD)
## Project: PostStudio (AI Everyday LinkedIn Post Maker)

**Author:** John (BMAD Product Manager)  
**Collaborators:** Sally (UX), Sophia (Storytelling), Winston (Architecture), Carson (Brainstorming), DELL (Product Owner)  
**Date:** October 17, 2026  
**Status:** Approved for Implementation (Updated with Dynamic Trending Tags Engine)  

---

## 1. Executive Summary & Problem Statement

### 1.1 The Problem
LinkedIn creators, founders, and professionals face daily creative fatigue. Writing authentic, engaging daily posts takes 30–60 minutes. Standard AI tools (generic ChatGPT/Claude prompts) fail because:
1. **The "AI Slop" Smell:** Posts are filled with dead giveaways (*"In today's fast-paced digital world...", "Let's dive in...", "It is a testament to..."*).
2. **Cognitive Overload:** Most AI tools require complex prompt engineering or multi-step wizards.
3. **Missing Visuals & Stale Tags:** Creators struggle to find matching eye-catching images and don't know what tags are currently gaining algorithmic momentum on LinkedIn.

### 1.2 The Solution: PostStudio
A dead-simple, distraction-free daily studio (matching the minimal sage/warm-gray editorial aesthetic of the reference UI). 
- **User input is minimal:** User selects **Profession** and **Job Role** (stored persistently in the left sidebar), then types **one sentence or thought** in the middle text area.
- **Magic output:** An accordion card unfolds smoothly right beneath the input card containing:
  1. **Non-AI Detected, Human-Cadence Post Copy:** Bypasses both AI detectors and human cynicism through conversational rhythm, real hooks, and zero corporate fluff.
  2. **Dynamic Trending Tags Engine:** Analyzes current real-time trending industry buzz, algorithmic momentum, and thought context to generate live trending hashtags (`🔥 Trending Now`, `📈 Rising`, `🎯 Niche Authority`).
  3. **Crazy / Scroll-Stopping AI Visual:** High-concept, surrealist-editorial 3D/metaphorical artwork directly reflecting the thought.
  4. **Instant Action:** 1-Click "Copy to Clipboard" with rich-text line breaks preserved and 1-Click "Download Image".

---

## 2. Dynamic Real-Time Trending Tags Engine (Deep Dive)

### 2.1 Two-Tier Trending Tag Discovery
1. **Live Feed & Industry Radar:**
   - Synchronizes with current real-time industry topics based on the user's selected Profession and Role.
   - Provides an instant **"Refresh Current Trends"** trigger in the "Ideas in your orbit" card so the user can see what is trending *right now* today.
2. **Context-Aware Trend Generator:**
   - When the user generates a post from their thought, the engine blends the specific post context with current real-time trending vectors.
   - Categorizes tags into:
     - **🔥 High Velocity / Viral:** Broad high-traffic tags currently peaking.
     - **📈 Rising / Momentum:** Emerging terminology and breaking conversations.
     - **🎯 Industry Core:** Evergreen high-engagement tags for the role.

### 2.2 Interactive UX for Trending Tags
- Displayed as sleek, clickable pill badges with momentum indicators (e.g., `#AIAgents [🔥 Trending]`, `#PromptEngineering [📈 Rising]`).
- **1-Click Tag Injection:** Clicking any trending pill toggles its inclusion into the post text with automatic spacing.
- **"Regenerate Trends" button:** Allows fetching fresh or alternative trending tags with a single click.

---

## 3. Reference UI & Layout Architecture

```
┌─────────────────────────────────┬──────────────────────────────────┬──────────────────────┐
│  LEFT SIDEBAR                   │  CENTER STAGE                    │  RIGHT SIDEBAR       │
│                                 │                                  │                      │
│  [Logo] postmark / studio       │  Header: Good ideas start        │  Card: A GOOD        │
│                                 │          with a thought.         │        REMINDER      │
│  YOUR STUDIO                    │                                  │  "Useful beats       │
│  - Today's studio (active)      │  [ Card 01: What's on your mind? ]│  impressive..."      │
│  - Drafts (count badge)         │  • 500-char counter + Voice Mic  │                      │
│  - Settings                     │  • Auto-tone / Quick tone pills  │  Card: STATUS        │
│                                 │  • [ Generate Post ✨ (Cmd+Enter) ]│  • Copy to Clipboard │
│  YOUR POINT OF VIEW             │                                  │    Mode Active       │
│  • Profession: [Education    ▼] │  ▼▼▼ UNFOLDS INLINE BELOW ▼▼▼    │                      │
│  • Your role:  [AI Engineer   ] │  [ Card 02: Generated Studio ]   │                      │
│                                 │  • Human Post Copy (Editable)    │                      │
│  [Offline Mode / Copy Status]   │  • 🔥 REAL-TIME TRENDING TAGS    │                      │
│                                 │    (Click to append/remove)      │                      │
│                                 │  • "Crazy" Surreal AI Visual     │                      │
│                                 │  • [Copy Text] [Download Image]  │                      │
└─────────────────────────────────┴──────────────────────────────────┴──────────────────────┘
```

---

## 4. Key Functional Requirements

### 4.1 Left Sidebar: Identity & Point of View
- **Profession Selector & Job Role Input:** Persistent in `localStorage`.
- Context is continuously injected into both copy generation and trending tag discovery.

### 4.2 Central Studio: Daily Thought & Trigger
- **Card 01: "What's on your mind today?"**
  - Text area with character counter (`0 / 500`).
  - Voice-to-Text microphone button.
  - Dual Tone Mode: Autopilot by default, with quick-select pills (`Contrarian`, `Story`, `Tactical`, `Observation`).
  - Primary CTA: **"Generate Post ✨"** (`Cmd/Ctrl + Enter`).

### 4.3 Center Unfolding Card: Generated Output (Inline Reveal)
Unfolds directly below Card 01 with a spring animation:
- **A. Human Post Copy (Anti-AI):** Banned buzzwords filter, variable cadence, genuine hook, mobile-formatted line breaks.
- **B. Dynamic Trending Tags Bar:** Live-generated trending tags with status pills, 1-click toggle into copy.
- **C. "Crazy" AI Visual:** Surrealist 3D isometric conceptual artwork with 1-click regenerate and high-res download.
- **D. Action Toolbar:** Primary `📋 Copy to Clipboard` button + `💾 Save Draft`.

---

## 5. Technical Specifications & Stack

- **Frontend:** Next.js / Vite React, TailwindCSS, Framer Motion, Lucide Icons.
- **Color Palette:** Warm sage green (`#1B3B2B`), soft off-white (`#F4F6F0`), paper-gray cards (`#FFFFFF`).
- **Trending Tags Discovery Engine:** Combines real-time web/news signals and LLM semantic clustering to produce authentic, verified trending tags.
- **AI Text Engine:** Gemini 2.5 / 3 Flash with strict human-voice system prompt and banned-word enforcement.
- **AI Image Engine:** High-concept surrealist visual generator via Imagen / Gemini Omni.
- **Storage:** LocalStorage for drafts and preferences.

