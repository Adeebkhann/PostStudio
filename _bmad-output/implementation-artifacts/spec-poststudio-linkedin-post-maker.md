---
title: 'PostStudio — Everyday LinkedIn Post Maker'
type: 'feature'
created: '2026-10-17'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
context: ['_bmad-output/planning-artifacts/prd.md', '_bmad-output/planning-artifacts/architecture/architecture-linkedin-post-2026-10-17/ARCHITECTURE-SPINE.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Professionals face daily creative fatigue and produce robotic "AI slop" when trying to post to LinkedIn. They need an everyday creator studio matching the reference design where they set Profession/Role, write one raw sentence, and get a human-sounding post, trending tags, and crazy visual.

**Approach:** Build a client-reactive web application in Vite + React + TypeScript + TailwindCSS matching the reference UI. Include an inline unfolding accordion for the generated post, dynamic trending tags engine, anti-AI lexical & burstiness filter, surrealist image generator, and 1-click clipboard actions.

## Boundaries & Constraints

**Always:**
- Exact 3-column editorial visual hierarchy from the reference screenshot (`#1B3B2B`, `#F4F6F0`).
- Generated result must unfold smoothly directly underneath Card 01 without page jumping or modal overlays.
- Anti-AI engine strictly blocks corporate buzzwords (*delve, testament, game-changer, etc.*) and enforces varied sentence rhythm.
- Dynamic Trending Tags provide 1-click append/toggle into the copy with momentum badges (`🔥 Trending`, `📈 Rising`).
- Zero mandatory auth; persist state (identity, drafts, preferences) in `localStorage`.

**Never:**
- Do not require login or external OAuth to generate and copy posts.
- Do not render generic corporate stock images. Use surrealist-editorial 3D metaphors.
- Do not flatten line breaks when copying to clipboard.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Everyday Generation | Role: "AI Engineer", Thought: "why agents change junior dev roles" | Inline card unfolds: Human-sounding post + 6 trending tags + crazy surrealist 3D graphic | Inline retry banner if generation errors |
| Empty Thought | Thought text is empty | "Generate Post" CTA disabled with subtle tooltip | Prompt user to type a sentence |
| Tag Interaction | User clicks `#AIAgents [🔥]` pill | Tag is appended to post body with clean spacing; pill turns active | Clicking again removes the tag |
| 1-Click Copy | User clicks "Copy to Clipboard" | Native clipboard updated with preserved double-newlines; green toast feedback | Fallback textarea copy execCommand if clipboard API restricted |

</frozen-after-approval>

## Code Map

- `src/types/studio.ts` -- TypeScript models for Identity, Thought, PostDraft, TagItem, and ToneMode
- `src/services/storageAdapter.ts` -- LocalStorage persistence for identity, studio settings, and saved drafts
- `src/services/antiAiEngine.ts` -- Non-AI detected post generator with negative vocabulary blocklist and burstiness cadence
- `src/services/trendingTagsEngine.ts` -- Two-tier dynamic trending hashtag discovery engine with momentum indicators
- `src/services/crazyVisualEngine.ts` -- Surrealist 3D isometric conceptual metaphor image generator
- `src/hooks/useStudioState.ts` -- Unified reactive studio state controller
- `src/components/layout/LeftSidebar.tsx` -- Identity (Profession dropdown + Role input + navigation)
- `src/components/layout/StudioHeader.tsx` -- Top studio bar with date and status indicator
- `src/components/layout/RightSidebar.tsx` -- Creator reminders and publishing status card
- `src/components/studio/ThoughtInputCard.tsx` -- Card 01: "What's on your mind today?" with char counter & mic button
- `src/components/studio/TonePillSelector.tsx` -- Dual tone mode selector pills
- `src/components/studio/UnfoldingCard.tsx` -- Card 02: Inline spring accordion revealing generated output
- `src/components/studio/TrendingTagsBar.tsx` -- Clickable trending tag badges with momentum status
- `src/components/studio/PostCopyEditor.tsx` -- Editable post copy with read-time and copy CTA
- `src/components/studio/CrazyVisualCard.tsx` -- Surrealist image canvas, reroll button, and download CTA
- `src/App.tsx` -- Master 3-column studio layout orchestration

## Tasks & Acceptance

**Execution:**
- [x] `package.json` & config -- Initialize Vite React TypeScript project with TailwindCSS, Lucide Icons, and Framer Motion.
- [x] `src/types/studio.ts` -- Define domain types for Post, Tags, Settings, and Identity.
- [x] `src/services/storageAdapter.ts` -- Implement localStorage persistence with seed defaults.
- [x] `src/services/antiAiEngine.ts` -- Implement human post generator with anti-AI detection rules and role calibration.
- [x] `src/services/trendingTagsEngine.ts` -- Implement two-tier trending hashtag generator with momentum tiers.
- [x] `src/services/crazyVisualEngine.ts` -- Implement surrealist conceptual visual generator with high-res download.
- [x] `src/hooks/useStudioState.ts` -- Build studio controller state hook.
- [x] `src/components/layout/` -- Implement LeftSidebar, StudioHeader, and RightSidebar matching reference UI.
- [x] `src/components/studio/ThoughtInputCard.tsx` -- Build Card 01 with character counter, voice dictation, and tone pills.
- [x] `src/components/studio/UnfoldingCard.tsx` -- Build Card 02 with smooth inline spring expansion containing copy, trending tags, and crazy visual.
- [x] `src/App.tsx` -- Assemble full responsive layout and verify in browser.

**Acceptance Criteria:**
- Given user enters profession, role, and a thought, when clicking "Generate Post", then Card 02 unfolds inline with human post copy, trending tags, and a crazy visual.
- Given generated tags, when user clicks a tag pill, then the tag toggles in the post copy.
- Given generated copy, when clicking "Copy to Clipboard", then formatted text is copied with confirmation toast.

## Implementation Notes

- Fully implemented PostStudio matching reference screenshot editorial aesthetic (`#1B3B2B`, `#F5F7F2`).
- Built anti-AI text synthesis engine with strict negative vocabulary blocklist and burstiness cadence formulas.
- Built two-tier dynamic real-time trending hashtag engine with velocity badges (Trending, Rising, Core) and 1-click append.
- Built surrealist conceptual visual engine with high-res 1200x675 HD PNG download and re-roll button.
- Integrated inline unfolding card using Framer Motion accordion animation directly below Card 01.
- Implemented voice memo speech-to-text dictation and dual tone selector.
- Verified build with `tsc && vite build` (100% pass) and launched dev server on `http://localhost:3000/`.

## Verification

**Commands:**
- `npm run build` -- expected: TypeScript compiles and Vite builds dist bundle with zero errors.
- `npm run dev` -- expected: Local dev server runs and serves PostStudio.
