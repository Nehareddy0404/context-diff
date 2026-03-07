# Community Guardian

**Name:** Neha Suram  
**Scenario:** 3 — Community Safety & Digital Wellness  
**Time:** ~5 hours  

---

## How to Run

You'll need Node 18+ and an OpenAI API key.

```bash
git clone <repo-url>
cd community-guardian
npm install

cp .env.example .env
# open .env and paste your OpenAI key

npm start
```

To run tests:
```bash
npm test -- --watchAll=false
```

---

## Tech Stack

| Layer | Tech | Why I chose it |
|-------|------|---------------|
| Frontend | React 19 (CRA) | Fast to prototype, familiar component model |
| AI | OpenAI GPT-3.5 Turbo | Cheap and fast enough for summarization and scam checks |
| Styling | Inline styles + JS tokens | No extra deps, easy to theme everything dark/cyber |
| Testing | Jest + RTL | Comes free with CRA |
| Data | JSON file | 25 hand-written Buffalo NY incident reports |

I went with a dark cybersecurity theme — JetBrains Mono font, matrix green + cyan palette, glassmorphism cards, and animated background elements (binary rain, hex grid, circuit traces). There's also an elderly-friendly toggle that bumps up font sizes.

---

## What It Does

### CRUD + Search
- **Create** — hit "+ Report" to file a new incident (pick type + location)
- **View** — dashboard shows filtered alerts, safety score, trend chart
- **Update** — edit any report inline from the Reports tab
- **Delete** — remove reports (asks for confirmation first)
- **Search** — filter reports by keyword, location, or type

### AI Features
The main AI feature is **noise-to-signal filtering** — GPT reads community reports and separates real threats from venting/off-topic posts. Each alert gets a severity level and actionable defense steps.

If the API key is missing or the call fails, everything falls back to rule-based keyword matching. The UI shows a badge so users know when AI wasn't used.

Other AI stuff:
- **Scam Scanner** — paste a sketchy text/email and get a verdict (SCAM / SUSPICIOUS / LEGIT) with red flags
- **Threat Forecast** — predicts threat trends for the next 7 days across all locations
- **AI Chat** — ask the chatbot questions about local safety (it has context about recent incidents)

All of these have rule-based fallbacks too.

### Standout Features
- **Threat Radar** — interactive SVG radar that plots every neighborhood as a node. High-risk areas pulse red, low-risk ones glow green. There's a rotating sweep line and connection lines back to the center hub. Honestly one of the coolest things I built here.
- **Safety Score** — animated gauge (0-100) per location, weighted by how recent and severe incidents are
- **7-Day Trend Chart** — bar chart comparing digital vs physical incidents day by day
- **Emergency Broadcast** — one-tap "I NEED HELP" or "I'M SAFE" buttons that send to all your Safe Circles at once
- **Elderly Mode** — toggle in the navbar that makes everything bigger and easier to read
- **Safe Circles** — create groups of trusted contacts and share status updates

---

## AI Disclosure

- **Did I use AI?** Yes, I used Claude to help with development
- **How I verified:** I tested everything manually in the browser and wrote unit tests. When the AI suggested something that didn't work or wasn't clean, I rewrote it
- **Something I rejected:** The AI initially put all helper functions inside the React component which would cause re-renders. I pulled them out into `helpers.js` instead

---

## Tradeoffs

### What I skipped
- Real encryption (Safe Circles just shows "encrypted" badges)
- Database / persistence (state resets on refresh)
- Login / auth system
- Actual geolocation (using dropdowns instead)

### What I'd add with more time
- PostgreSQL backend so data persists
- Real E2E encryption with Web Crypto API
- Push notifications for new alerts
- Geolocation API for auto-detecting your area
- Upvote system so the community can verify reports
- PWA support for offline use

### Known issues
- Data resets on refresh (no backend)
- AI features need a valid OpenAI key (fallbacks work fine without one)
- Encryption is simulated, not real

---

## Project Structure
```
community-guardian/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx              Main app component
│   ├── App.test.js          7 unit tests
│   ├── helpers.js           AI calls, fallbacks, scoring
│   ├── styles.js            Colors, themes, style tokens
│   ├── data/
│   │   └── sample_incidents.json   25 Buffalo NY reports
│   ├── index.js
│   └── index.css
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## How This Addresses the Success Metrics

| Metric | What I did |
|--------|-----------|
| Anxiety Reduction | Calm language, safety scores, action checklists — not trying to scare anyone |
| Contextual Relevance | Filter by location, severity-based alerts, weekly trends |
| Trust & Privacy | API keys in .env (gitignored), no real user data collected |
| AI Application | Summarization, scam detection, forecasting, chat — all with fallbacks |
