# Design Documentation — Context Diff

## 1. Project Overview

Context Diff is a version control system for personal AI context. The core insight: your AI assistant forgets you after every conversation. You re-explain your preferences, projects, and communication style hundreds of times. This is the TTFT (Time to First Token) problem at its root — not a model speed issue, but a **context loading** issue.

Context Diff solves this by treating personal context like source code. You can version it (snapshots), branch it (work vs. personal), diff it (what changed?), and search it (when did I start caring about X?).

The app is built with React 19 + Vite, uses a vanilla CSS design system with glassmorphism and animations, and ships with 9 hand-written context snapshots across 2 branches simulating 2 months of personal AI context evolution.

---

## 2. Target Audience

### AI Power Users
**Need:** Track how their preferences and context evolve across hundreds of AI conversations  
**Solution:** Timeline view shows chronological snapshot history. Diff View lets them compare any two points in time to see exactly what changed. Search lets them find when a specific topic first appeared.

### Knowledge Workers
**Need:** Separate AI context for work vs. personal vs. side projects  
**Solution:** Branch Manager maintains independent context tracks. Your work AI doesn't leak personal details, and your personal AI doesn't get cluttered with work jargon. Like Git branches but for who you are.

### AI Product Builders
**Need:** Understand the impact of context on response quality and TTFT  
**Solution:** TTFT Dashboard visualizes how different context strategies (none, basic, full, branched, cached) reduce time to first token. Makes the business case for context management tangible.

---

## 3. Architecture

```
┌────────────────────────────────────────────────────────────┐
│                     App.jsx (Layout)                       │
│  ┌──────────┐  ┌────────────────────────────────────────┐  │
│  │ Sidebar  │  │           Content Panel                │  │
│  │          │  │                                        │  │
│  │ • Views  │  │  Renders one of 6 views based on       │  │
│  │ • Branch │  │  activeView state                      │  │
│  │   select │  │                                        │  │
│  └──────────┘  └──────────┬─────────────────────────────┘  │
│                           │                                │
│  ┌────────────────────────▼────────────────────────────┐   │
│  │              6 View Components                      │   │
│  │                                                     │   │
│  │  Timeline │ DiffView │ BranchManager │ ContextEditor │  │
│  │  TTFTDashboard │ SearchPanel                        │   │
│  └────────────┬───────────────────────┬────────────────┘   │
│               │                       │                    │
│  ┌────────────▼────────────┐  ┌───────▼───────────────┐   │
│  │   utils/diffEngine.js   │  │  data/sampleData.js   │   │
│  │                         │  │                       │   │
│  │ • computeDiff()         │  │ • 2 branches          │   │
│  │ • computeStats()        │  │ • 9 snapshots         │   │
│  │ • searchHistory()       │  │ • 8 context categories│   │
│  │ • computeTTFT()         │  │ • TTFT benchmarks     │   │
│  │ • getContextSize()      │  │ • Category labels     │   │
│  │ • estimateTokens()      │  └───────────────────────┘   │
│  │ • formatTime/Full()     │                               │
│  │ • groupByCategory()     │                               │
│  └─────────────────────────┘                               │
└────────────────────────────────────────────────────────────┘
```

### Why this structure?

- **App.jsx (247 lines)** — Layout shell with sidebar and content panel. State management for active view, active branch, and snapshot selection (A/B for diffing). Small and focused.
- **6 Components** — Each view is a self-contained component. Timeline handles snapshot display, DiffView handles comparison rendering, etc. Clean separation of concerns.
- **diffEngine.js (206 lines)** — All computation extracted into pure functions. Diff algorithm, search, TTFT simulation, formatting. This is the testable core of the application.
- **sampleData.js** — Rich synthetic dataset. 9 snapshots with realistic context evolution, 2 branches with fork relationships, 8 context categories.
- **index.css (1554 lines)** — Complete design system. Design tokens, component styles, animations, responsive behavior. Everything uses CSS custom properties for consistency.

### State Management

```
App state:
  activeView     → which panel to render (timeline | diff | branches | context | ttft | search)
  activeBranch   → which branch is selected (main | work-pacific)
  selectedA      → snapshot ID for diff base
  selectedB      → snapshot ID for diff compare
```

No external state management needed. React's `useState` + `useMemo` + `useCallback` handles everything cleanly for this scope.

---

## 4. Design Choices

### The Git Metaphor
The entire UI is built around the metaphor of Git — a tool developers already understand deeply. This makes the concept of "versioned personal AI context" instantly graspable:
- **Snapshots** = commits (a point-in-time capture of your context)
- **Branches** = separate context tracks (work, personal, side project)
- **Diff** = comparing two snapshots to see what changed
- **Timeline** = commit log (chronological history)

This isn't just aesthetic — it creates a shared vocabulary. When a user sees "branch" they immediately understand isolation and forking. When they see "diff" they expect red/green additions and deletions.

### Dark Mode Design System
The app uses a 7-layer depth system for backgrounds:

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-deepest` | `#08080C` | Page background, body |
| `--bg-deep` | `#0D0F14` | Sidebar, header, status bar |
| `--bg-base` | `#12141A` | Main content area |
| `--bg-raised` | `#1A1C24` | Cards, panels, form inputs |
| `--bg-elevated` | `#22242E` | Hover states on raised elements |
| `--bg-surface` | `#2A2D38` | Scrollbar thumb, badges |
| `--bg-hover` | `#32353F` | Scrollbar thumb hover |

This layering creates natural visual hierarchy without borders. Elements "float" at different depths, guided by glassmorphism (`backdrop-filter: blur(16px)`) and subtle borders (`rgba(255, 255, 255, 0.06)`).

### Typography
- **Inter** (sans-serif) — UI text, labels, descriptions. Clean and highly readable at small sizes.
- **JetBrains Mono** (monospace) — Snapshot IDs, context keys, code references, TTFT values. Reinforces the developer-tool aesthetic.

### Color Semantics
Colors carry meaning:
- **Purple (#6C63FF)** — primary brand, main branch, active states
- **Teal (#00D4AA)** — work context, compare (B) selection
- **Pink (#FF6B9D)** — tertiary accent, base (A) selection
- **Green (#2ED573)** — additions in diff
- **Red (#FF4757)** — deletions in diff
- **Orange (#FFA502)** — modifications in diff

Branch colors are consistent everywhere: sidebar chips, timeline nodes, branch graph, search results, status bar. A user always knows which branch they're looking at by color alone.

### Animation Strategy
Animations serve function, not decoration:
- **`fadeSlideIn`** — staggered entrance (50ms delay per item) draws attention to new content
- **`diffLineIn`** — sliding diff lines give a sense of "revealing" changes
- **TTFT bars** — animated `width` transition (1.2s) with staggered delays creates a "race" effect that makes performance differences visceral
- **Spring easing** — interactive elements (timeline nodes, branch dots) use `cubic-bezier(0.34, 1.56, 0.64, 1)` for a satisfying overshoot effect on hover/click
- **Status bar pulse** — subtle breathing animation on the green dot signals "system active"

---

## 5. Feature Deep Dives

### Diff Engine (`diffEngine.js`)

The core algorithm for computing diffs between context snapshots:

```
For each category in both snapshots:
  For each key in the union of both category's keys:
    if key exists only in B → ADDITION
    if key exists only in A → DELETION
    if key exists in both but values differ → MODIFICATION
    if values are identical → UNCHANGED
```

This produces four arrays: `additions`, `deletions`, `modifications`, `unchanged`. Each item carries the category, key, and value(s) — enabling grouped display in the Diff View.

**Stats computation** calculates:
- Count of each change type
- Total changes
- **Change rate** = total changes / (total changes + unchanged) × 100

This gives a single percentage that captures "how much did the context evolve between these two points?"

### TTFT Model

The TTFT Dashboard visualizes simulated benchmarks:

| Strategy | TTFT (ms) | Reduction |
|----------|-----------|-----------|
| Cold Start (no context) | 2847 | baseline |
| Basic Profile (512 tokens) | 2105 | 26% |
| Recent Context (2048 tokens) | 1450 | 49% |
| Full Personal Context (4096 tokens) | 890 | 69% |
| Branched Context (Work) | 720 | 75% |
| Cached + Branched | 380 | **87%** |

The model: `TTFT = baseTTFT × (1 - reduction)` where reduction is the sum of:
- **Context factor** = `min(tokens / 4096, 1) × 0.65` — more context = less wasted prompt tokens for re-discovery
- **Branch factor** = `0.10` — loading only relevant context eliminates noise
- **Cache factor** = `0.15` — pre-processed context skips tokenization overhead

These numbers are simulated but grounded in real patterns: the more the AI already knows about you, the less time it spends on "getting to know you" before producing useful output.

### Search Algorithm

Full-text search across all snapshots:

```
For each snapshot (optionally filtered by branch):
  For each category → for each key-value pair:
    If query matches key OR value OR snapshot message:
      Add to results with metadata (branch, timestamp, matchType)
```

Results include `matchType` ('key', 'value', or 'message') so the UI can highlight the specific match location. The `highlightMatch` function in the SearchPanel component uses regex splitting to wrap matched substrings in highlight spans.

### Branch Visualization

The Branch Manager renders two complementary views:

1. **Branch Graph** — Horizontal lane diagram showing each branch as a colored line with dots for each snapshot. Fork labels show where branches diverged.

2. **Branch Cards** — Grid of glassmorphism cards with branch-colored top borders. Each shows snapshot count, last activity date, and fork origin. Active branch gets a glow shadow and "ACTIVE" badge.

---

## 6. Data Design

### 9 Synthetic Snapshots, 2 Branches

The data tells a story: a developer named Neha over ~2 months (January 15 – March 15, 2026).

**Main Branch (5 snapshots)**: Core personal evolution
- `snap-main-01`: Initial context — preferences, first project, basic goals
- `snap-main-02`: Added key people (Prof. Chen, study group) and schedule
- `snap-main-03`: Applied to Pacific — new project (context-diff) appears
- `snap-main-04`: Evolving beliefs about AI personalization
- `snap-main-05`: Refined communication style, career direction crystallizing

**Work @ Pacific Branch (4 snapshots)**: Professional context fork
- `snap-work-01`: Forked from main — work preferences, team, projects
- `snap-work-02`: Onboarding complete — started on context retrieval API
- `snap-work-03`: Shipped API v1 — 40% TTFT improvement
- `snap-work-04`: Context caching, permission-aware retrieval

### 8 Context Categories
Each snapshot contains key-value pairs organized into:

| Category | Icon | What it tracks |
|----------|------|----------------|
| Preferences | ⚙️ | Editor, theme, coding style, music |
| Active Projects | 🚀 | What you're building and their status |
| Goals | 🎯 | Short-term, learning, career, fitness |
| Beliefs & Values | 💡 | Philosophy about AI, building, startups |
| Tech Stack | 🛠️ | Languages, frameworks, tools, interests |
| Communication Style | 💬 | How you prefer AI to respond |
| Key People | 👥 | Mentors, colleagues, collaborators |
| Schedule & Routines | 📅 | Work hours, deadlines, recurring events |

### Why This Data Works
- **Realistic evolution** — preferences refine, projects advance, beliefs deepen naturally
- **Branch differentiation** — work context is professional, personal context is holistic
- **Interesting diffs** — comparing main-01 to main-05 shows meaningful growth (14 entries → 32 entries, 6 categories → 8 categories)
- **Searchable content** — terms like "Pacific", "TTFT", "React", "Priya" appear in specific snapshots, making search feel real

---

## 7. Testing Strategy

7 unit tests in `diffEngine.test.js`:

| Test | Type | What it verifies |
|------|------|-----------------|
| `computeDiff` finds additions | Happy path | Keys in B not in A are additions |
| `computeDiff` finds deletions | Happy path | Keys in A not in B are deletions |
| `computeDiff` finds modifications | Happy path | Changed values detected with old + new |
| `computeDiff` handles identical snapshots | Edge case | No changes when snapshots are the same |
| `searchHistory` finds matches | Happy path | Query matches in keys, values, messages |
| `searchHistory` respects branch filter | Edge case | Only returns results from specified branch |
| `getContextSize` counts entries | Happy path | Correct total across all categories |

**Why I focused on `diffEngine.js`:** This is the pure-logic core. If `computeDiff` is wrong, the entire diff view shows incorrect data. If `searchHistory` is broken, search results are misleading. These functions are pure (no side effects, no React), making them ideal unit test targets.

---

## 8. Design System Deep Dive

### CSS Custom Properties (Design Tokens)

The entire visual system is driven by ~40 CSS custom properties:

- **7 background layers** — create depth without borders
- **3 accent colors** — with `33` (20%) alpha variants for subtle highlights
- **6 diff colors** — add/delete/modify with line and background variants
- **4 text levels** — primary, secondary, tertiary, muted
- **3 border levels** — subtle, default, strong
- **4 shadows** — sm, md, lg, glow
- **2 glass tokens** — background opacity + blur amount
- **2 font stacks** — sans-serif and monospace
- **4 radius sizes** — sm to xl
- **3 transitions** — fast (150ms), normal (250ms), slow (400ms)

Changing a single variable updates the entire app consistently. This is how themes are meant to work.

### Component Styling Patterns

Every interactive element follows the same pattern:
1. Default state uses `--bg-raised` background + `--glass-border` border
2. Hover state uses `--bg-elevated` background + `--border-default` border
3. Active state uses accent color with dim (`33`) background + accent border
4. Transitions use `var(--duration-fast)` + `var(--ease-out)`

This consistency makes the app feel cohesive and predictable.

---

## 9. Tradeoffs & Decisions

### Vite over Create React App
The old Pulse Guard project used CRA. I switched to Vite for Context Diff because:
- 10x faster dev server startup
- Native ESM (no bundling during dev)
- Better build performance
- More modern ecosystem (Vitest, etc.)

### Vanilla CSS over Tailwind
Full control over the design system. Tailwind utilities are great for rapid prototyping, but for a deeply themed app with complex animations and glassmorphism, vanilla CSS with custom properties gives more precise control.

### Client-side only (no backend)
Data resets on refresh. This was intentional: the focus is on the **diff engine, visualization, and UX** — not CRUD persistence. A backend would add complexity without demonstrating the core concept better.

### Read-only Context Editor
The Context Editor shows current state but doesn't allow inline editing. With more time, I'd add editing + auto-snapshot creation. For now, the data evolution is pre-built into the sample data to demonstrate the concept.

### Simulated TTFT benchmarks
The TTFT numbers are modeled, not measured from real API calls. The value is in the **visualization and the concept** — showing that context management strategy directly impacts response latency.

---

## 10. Responsible AI

### Why Context Versioning Matters Ethically
Personal AI context contains sensitive information: your beliefs, relationships, career goals, health concerns. Managing this data responsibly requires:

- **Transparency** — Users should see exactly what context their AI has. Context Diff's Context Editor makes this visible and inspectable.
- **Control** — Users should be able to branch, modify, and delete context. The branching model prevents unwanted context leakage (work AI doesn't see personal therapy notes).
- **Auditability** — The Timeline and Diff View create an audit trail. Users can see when and how their context changed.
- **Privacy by design** — Branch isolation means you can share a work branch with a colleague without exposing your personal context.

### Data Privacy in This Demo
- All data is synthetic (no real personal information)
- No external API calls (pure frontend)
- No analytics or tracking
- No cookies or local storage persisting user data

---

## 11. What I'd Build Next

With more time, these are ordered by impact:

1. **Real AI integration** — Import conversation context from ChatGPT/Claude, auto-detect context changes
2. **Inline editing** — Edit context values directly, auto-create snapshots on save
3. **Branch merging** — Merge work learnings back into personal context, with conflict resolution
4. **Export/import** — Portable JSON format for moving context between AI providers
5. **Backend + auth** — PostgreSQL persistence, user accounts, encrypted storage
6. **Real TTFT measurement** — Instrument actual API calls to validate the benchmarks
7. **Collaborative context** — Share branch read-only with teammates or mentors
