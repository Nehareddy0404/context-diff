# Design Documentation — Community Guardian

## Overview

Community Guardian is a neighborhood safety platform that uses AI to cut through noisy community reports and surface what actually matters. Instead of doom-scrolling through social media posts about local crime, users get a clean dashboard with verified alerts, safety scores, and actionable steps.

The idea came from the problem statement: people are overwhelmed by scattered safety info across news and social media. This app brings it all into one calm, organized place.

---

## Target Audience

I designed for three specific user groups:

1. **Neighborhood groups** — people who want to know what's happening locally without the toxicity of social media. The dashboard with noise filtering and trend charts serves them.

2. **Remote workers** — concerned about digital threats and home network security. The scam scanner and digital threat alerts are built for them.

3. **Elderly users** — need simple, non-scary alerts. The elderly-friendly mode (bigger fonts, cleaner layout) and calm language throughout the app address this.

---

## Technical Stack Decisions

### React 19 (To create React App)
I went with CRA because it's the fastest way to get a working React app with zero config. For a timed challenge, spending time on build tooling didn't make sense. React's component model also made it easy to break the UI into tabs and reusable pieces.

### OpenAI GPT-3.5 Turbo
Chose 3.5 over 4 because it's cheaper and faster — for summarization and scam detection, the quality difference isn't worth the extra latency and cost. Every AI feature has a rule-based fallback so the app works fine without an API key.

### Inline Styles + JS Design Tokens
Instead of CSS frameworks, I used a `styles.js` file with color tokens and reusable style objects. This kept everything in one language (JS) and made the cybersecurity theming consistent. No Tailwind, no CSS modules — just objects.

### Jest + React Testing Library
Comes built into CRA. I wrote 7 tests covering the critical logic: noise filtering, scam detection patterns, and safety score calculation.

### Synthetic JSON Data
25 hand-written incident reports set in Buffalo, NY neighborhoods. Each has a type (digital/physical), location, date, and realistic description. Some are intentionally "noisy" (off-topic posts) to test the filtering.

---

## Architecture

```
User Interface (App.jsx)
    │
    ├── Design System (styles.js)
    │     Colors, glassmorphism, typography tokens
    │
    ├── Business Logic (helpers.js)
    │     ├── AI calls (OpenAI API)
    │     ├── Rule-based fallbacks
    │     ├── Safety score calculation
    │     ├── Trend data aggregation
    │     └── Threat forecasting
    │
    └── Data Layer (sample_incidents.json)
          25 synthetic Buffalo NY reports
```

Everything runs client-side. There's no backend — state lives in React's `useState` and resets on refresh. This was a deliberate tradeoff to focus on the AI features and UI within the time limit.

---

## Design Choices

### Cybersecurity Theme
Dark background with matrix green (#00ff88) and cyan (#00e5ff) accents. JetBrains Mono monospace font gives it a "terminal" feel. The background has animated elements — binary rain, hex grid pattern, floating security icons, and circuit board traces — to reinforce the security theme without being distracting.

### Glassmorphism Cards
Each section uses semi-transparent cards with subtle borders and backdrop blur. This creates visual depth and keeps the dark theme from feeling flat.

### Calm Tone
The app deliberately avoids alarming language. Safety scores are encouraging ("Your area is relatively safe"), action steps are empowering, and severity colors are muted rather than screaming red.

### Elderly-Friendly Mode
A toggle in the navbar that increases font sizes across the entire app. This directly serves the elderly user persona from the problem statement.

---

## AI Integration

### 1. Noise-to-Signal Filtering (Summarize + Categorize)
The core feature. GPT reads all community reports for a location and:
- Filters out venting, off-topic posts, and noise
- Assigns severity (high/medium/low) to real threats
- Generates 1-sentence summaries
- Creates actionable defense checklists

**Fallback:** Keyword matching against noise words (lol, pizza, omg) and action words (phishing, breach, scam). Assigns severity based on regex patterns.

### 2. Scam Scanner (Extract)
Users paste suspicious texts/emails. GPT analyzes them and returns:
- Verdict: SCAM / SUSPICIOUS / LEGITIMATE
- Confidence level
- Red flags found
- What to do next

**Fallback:** Checks for urgency words, financial bait terms, and phishing indicators. Counts flags to determine verdict.

### 3. Threat Forecast (Forecast)
Analyzes incident patterns across all locations and predicts:
- Risk level per neighborhood for next 7 days
- Overall trend (increasing/stable/decreasing)
- Top risk area and emerging threats
- AI insight (surprising pattern noticed)

**Fallback:** Statistical analysis of incident counts, type ratios, and keyword presence to generate predictions.

### 4. AI Chat Assistant
Context-aware chatbot that knows about recent local incidents. Users can ask questions like "is it safe to walk downtown?" and get informed answers.

---

## Key Features Deep Dive

### Threat Radar
Interactive SVG visualization that plots all neighborhoods on a radar display. Each node is:
- Sized by incident count
- Colored by risk level (green/amber/red)
- Animated with pulse rings for high-risk areas
- Connected to a center hub with lines

A sweep line rotates continuously like a real radar. This was my standout feature — it gives an immediate visual overview of the entire city's threat landscape.

### Safety Score
Formula: starts at 95, penalizes based on:
- Number of incidents at that location
- How recent they are (last 7 days weighted more)
- Severity (breach = 12pts, phishing = 8pts, minor = 5pts)

Displayed as an animated SVG arc gauge.

### Emergency Broadcast
One-tap buttons ("I NEED HELP" / "I'M SAFE") that instantly send to ALL Safe Circles. No typing required — critical for actual emergencies.

### Safe Circles
Trusted contact groups with status updates. Messages show an "encrypted" badge. In a production version, I'd use the Web Crypto API for real E2E encryption.

---

## Testing Strategy

7 unit tests covering:
- `ruleBasedFilter` — keeps real alerts, removes noise, assigns correct severity
- `ruleBasedScamCheck` — catches obvious scam patterns, passes clean messages
- `calcSafetyScore` — high score for safe areas, lower score for incident-heavy areas

All tests passed. I focused testing on the logic layer (helpers.js) since that's where bugs would cause the most damage.

## Tradeoffs & Decisions

### Client-side only (no backend)
I skipped building a backend entirely. Data lives in React state and resets on refresh. This let me spend all my time on the AI features and UI instead of wiring up Express + Postgres. For a demo, it works — but production would obviously need persistence.

### GPT-3.5 instead of GPT-4
GPT-4 would give better analysis, but 3.5 is 10x cheaper and responds faster. For summarizing community reports and checking scam texts, the quality gap isn't big enough to justify the cost and latency.

### No real encryption
Safe Circles shows "encrypted" badges but it's not actually encrypted. Real E2E encryption with Web Crypto API would take significant time to implement properly. I flagged this clearly in the UI rather than pretending it's secure.

### No authentication
There's no login system. Every user sees the same data. I prioritized the AI and visualization features over auth since the demo is single-user anyway.

### Inline styles instead of CSS framework
Tailwind or styled-components would scale better, but inline styles with a shared token file were faster to set up and kept theming dead simple for a single-component app.

### Rule-based fallbacks over graceful degradation
Instead of just showing "AI unavailable" errors, I built full rule-based alternatives for every AI feature. This means the app is fully functional even without an API key — judges can test everything immediately.

### Dropdown locations instead of geolocation
Real GPS-based location detection would be better UX, but the Geolocation API needs HTTPS and user permissions which add friction in a demo. Dropdowns are instant and reliable.

---

## What I'd Do Differently With More Time

- Add a PostgreSQL backend for data persistence
- Implement real E2E encryption with Web Crypto API
- Add push notifications for new alerts in your area
- Use the Geolocation API for automatic location detection
- Build a community upvote system so users can verify reports
- Make it a PWA for offline access
- Add an admin moderation dashboard
