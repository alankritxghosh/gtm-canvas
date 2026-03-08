# Agentic GTM Canvas

The **Agentic GTM Canvas** is the culmination of my B2B product trajectory—the evolutionary next step in orchestrating full-scale agentic infrastructure. It bridges the gap between raw idea generation and ruthless, deployable execution.

Building on the foundation laid by specialized workflow automations like **Signal** and audit tools like **ZeroSample**, this canvas represents a shift toward building cohesive ecosystems of AI products. It transforms a scattered set of tools into a unified, visual strategy engine designed for rapid shipping and impactful results.

## The Vision

Gone are the days of disjointed chat interfaces for complex planning. The Agentic GTM Canvas provides a dynamic, nodal interface where strategic pillars expand autonomously into deployable artifacts (e.g., cold emails, boolean search queries, competitive battlecards). This isn’t just a whiteboard; it’s an interactive control center engineered to act as the Principal GTM Architect for ambitious SaaS founders.

---

## 🏗 System Architecture & Tech Stack

Engineered for production-grade reliability and lightning-fast UX, optimized specifically for Vercel's Edge network:

- **Core Framework:** Next.js (App Router, Edge Runtime)
- **Canvas Engine:** React Flow
- **State Management & Persistence:** Zustand (with `persist` middleware)
- **UI & Animations:** Tailwind CSS (Strict Dark Mode), Framer Motion, Lucide React
- **Validation:** Zod (Strict schema validation for defensive AI engineering)
- **Telemetry & UX Polish:** PostHog, Sonner, React Markdown
- **Artifact Export:** HTML2Canvas, jsPDF

---

## 🔥 Key Defenses & Mechanisms

1. **Defensive AI Engineering:** Every API payload from Gemini 3 Flash Preview is strictly validated via Zod schemas before rendering. Zero exceptions.
2. **Edge Runtimes:** API endpoints run on the Edge for zero cold-start latency.
3. **Graceful Degradation:** Malformed outputs trigger silent recalibrations and elegant error toasts via Sonner. No app crashes.
4. **Non-blocking UI:** Ghost nodes with pulse animations maintain visual engagement without blocking user interaction during API calls.
5. **Persistent State:** Zustand syncs the canvas to local storage, ensuring your strategic architectures survive page reloads.

---

## 🚀 Deployment (The Vercel Pipeline)

Designed to be pushed to GitHub and instantly imported into Vercel.

**Critical Deployment Step:** 
Ensure your Environment Variables are rigidly configured in the Vercel dashboard:
- `GEMINI_API_KEY`: Required for the agentic generative engine.
- `NEXT_PUBLIC_POSTHOG_KEY`: Required for telemetry capture.
- `NEXT_PUBLIC_POSTHOG_HOST`: Set according to your region (e.g., `https://us.i.posthog.com`).

Failing to inject these will instantly fail node generations in production.

---

*Engineered by Alankrit.*
