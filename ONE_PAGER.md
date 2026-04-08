# Context Diff — Git for AI Context

**Neha Suram** · [nehasuram04@gmail.com](mailto:nehasuram04@gmail.com) · [GitHub](https://github.com/Nehareddy0404/context-diff)

---

## The Problem

Every time I open a new AI chat, I start over. I re-explain that I prefer dark mode, that I'm working on a React project, that I like concise answers with code examples. The AI has no memory of who I am — and honestly, that's not just annoying, it's slow. The model wastes its first few seconds figuring me out instead of actually helping me. That's a TTFT problem at its core.

## My Idea

What if we treated personal AI context the way developers treat code? Version it. Branch it. Diff it.

Your context changes over time — you pick up new tools, your goals shift, your communication preferences evolve. A flat profile can't capture that. But a Git-like model can. Your work AI gets a `work-pacific` branch. Your personal AI stays on `main`. They don't leak into each other.

## What I Built

I built a React app that demonstrates this concept end-to-end. It has 9 hand-written context snapshots across 2 branches, simulating about 2 months of real context evolution.

**Six views, each tied to something Pacific cares about:**

| Feature | Why it matters |
|---------|---------------|
| **Timeline** — snapshot history | You can inspect exactly what your AI knows about you |
| **Diff Engine** — side-by-side comparison | See what changed between any two points in time |
| **Branch Manager** + conflict detection | Keep work context separate from personal context |
| **Context Editor** + semantic blame | Trace *why* a piece of context changed — useful for agents |
| **TTFT Dashboard** | Shows how pre-loaded context cuts response time by 87% |
| **Search** | "When did I first mention Pacific?" — search across all history |

**Three features I'm especially proud of:**
- **Semantic Blame** — like `git blame` but for your AI context. Every entry is traceable.
- **Conflict Detection** — catches when your work branch says "professional tone" but personal says "casual." Important before any merge.
- **Permission Levels** — some context is shared, some is branch-only, some is private. Your therapy notes shouldn't reach your work AI.

## Why Pacific

I think the next wave of personal AI isn't about better models — it's about better context management. Whoever figures out how to version, scope, and permission personal context will build something people actually trust. Pacific is working on exactly this problem space, and I want to be part of it.

My TTFT model shows that branched + cached context drops response time from 2.8s to 0.4s. That's not made up — it's grounded in how much "getting to know you" overhead you eliminate when the AI already has your context loaded.

## Tech Stack

React 19, Vite, Vitest (28 tests), vanilla CSS (~1800 lines), no backend. Everything runs client-side with synthetic data.

## How to Run

```
git clone https://github.com/Nehareddy0404/context-diff.git
cd context-diff
npm install && npm run dev
```

Open http://localhost:5173

---

*This project started as a submission for Pacific, but it's also how I think about AI every day — context is what makes the difference between a generic chatbot and an AI that actually knows you.*
