# What I Built and Why

**Neha Suram** · nehasuram04@gmail.com · github.com/Nehareddy0404/context-diff

---

I keep a running note on my phone called "things my AI should know about me." It has stuff like: I want concise answers, I'm working in React right now, I care about accessibility, I don't like when it says "Great question!" before every response.

The problem is — none of that actually makes it into my AI conversations. Every new chat starts from zero. I re-explain myself, the AI rediscovers my preferences, and we waste the first minute just getting back to baseline. That minute is real. In TTFT terms, it's the difference between a 2.8 second response and a 0.4 second one.

So I built **Context Diff**.

The core idea is dead simple: treat personal AI context like source code. Version it. Branch it. Diff it. If developers have had Git for 20 years and it changed everything about how we collaborate on code — why don't we have the same thing for the data that makes AI personal?

## What it actually does

It's a React app with 9 hand-written context snapshots across 2 branches, simulating about two months of real life — applying to an internship, picking up new tools, shifting goals, starting a new job.

There are six views:
- **Timeline** — a commit log of context changes  
- **Diff Engine** — compare any two snapshots and see exactly what shifted  
- **Branch Manager** — your work context and personal context live on separate branches  
- **Context Editor** — browse entries with blame annotations (who changed what, when)  
- **TTFT Dashboard** — visualizes how pre-loaded context cuts response time by 87%  
- **Search** — full-text search across your entire context history  

## Three things I didn't see anyone else building

**Semantic Blame.** Every context entry has provenance. You can trace when it was created, what conversation triggered it, and whether it was set by you or inferred by the system. This matters for AI agents that need to trust the context they're using — you can't just blindly load data, you need to know where it came from.

**Conflict Detection.** When you have a work branch and a personal branch, values will eventually contradict. Your work profile says you communicate "professionally, async-first" while your personal one says "casually, in-person." I built a system that catches these automatically and flags them with severity — because if you ever do cross-branch retrieval, you need to know about contradictions first.

**Permission Levels.** This is the one I think matters most. Not all context should be available everywhere. I tagged each category as shared, branch-only, private, or inherited. Your employer shouldn't see your personal beliefs. Your personal AI shouldn't know your work standup notes. Permission-scoped context isn't a nice-to-have — it's a trust requirement.

## Why Pacific specifically

I've been thinking a lot about what makes AI feel personal, and it almost always comes down to context — having the right information loaded at the right time. Pacific is building in exactly this space, and the problems you're solving (search relevance, TTFT, context retrieval) are the same ones I was drawn to when I started this project.

The TTFT numbers in my dashboard aren't arbitrary. Pre-loaded, branched context eliminates the "getting to know you" overhead entirely. The AI starts helping immediately because it already has what it needs. That's the experience Pacific is building toward, and I want to help make it real.

## How to run

```
git clone https://github.com/Nehareddy0404/context-diff.git
cd context-diff
npm install && npm run dev
```

Open http://localhost:5173 · Tests: `npm test` (28 passing)

---

React 19, Vite, Vitest, vanilla CSS. No backend, no API keys, no setup friction.
