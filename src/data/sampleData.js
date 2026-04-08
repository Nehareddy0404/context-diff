// Context Diff — Sample Data
// Simulates 2+ months of personal AI context evolution across multiple branches

export const CATEGORIES = {
  PREFERENCES: 'preferences',
  PROJECTS: 'active_projects',
  GOALS: 'goals',
  BELIEFS: 'beliefs',
  TECH_STACK: 'tech_stack',
  COMMUNICATION: 'communication_style',
  PEOPLE: 'key_people',
  SCHEDULE: 'schedule',
};

export const CATEGORY_LABELS = {
  [CATEGORIES.PREFERENCES]: 'Preferences',
  [CATEGORIES.PROJECTS]: 'Active Projects',
  [CATEGORIES.GOALS]: 'Goals',
  [CATEGORIES.BELIEFS]: 'Beliefs & Values',
  [CATEGORIES.TECH_STACK]: 'Tech Stack',
  [CATEGORIES.COMMUNICATION]: 'Communication Style',
  [CATEGORIES.PEOPLE]: 'Key People',
  [CATEGORIES.SCHEDULE]: 'Schedule & Routines',
};

export const CATEGORY_ICONS = {
  [CATEGORIES.PREFERENCES]: '⚙️',
  [CATEGORIES.PROJECTS]: '🚀',
  [CATEGORIES.GOALS]: '🎯',
  [CATEGORIES.BELIEFS]: '💡',
  [CATEGORIES.TECH_STACK]: '🛠️',
  [CATEGORIES.COMMUNICATION]: '💬',
  [CATEGORIES.PEOPLE]: '👥',
  [CATEGORIES.SCHEDULE]: '📅',
};

// ─── Branch definitions ─────────────────────────────────────────────
export const branches = [
  {
    id: 'main',
    name: 'main',
    label: 'Personal',
    color: '#6C63FF',
    icon: '🏠',
    description: 'Your core personal context — who you are across all domains',
    createdAt: '2026-01-15T08:00:00Z',
    parentBranch: null,
    forkPoint: null,
  },
  {
    id: 'work-pacific',
    name: 'work-pacific',
    label: 'Work @ Pacific',
    color: '#00D4AA',
    icon: '💼',
    description: 'Work context for Pacific internship — projects, team, goals',
    createdAt: '2026-02-01T09:00:00Z',
    parentBranch: 'main',
    forkPoint: 'snap-main-03',
  },
];

// ─── Snapshots ───────────────────────────────────────────────────────
export const snapshots = [
  // ── main branch ──
  {
    id: 'snap-main-01',
    branch: 'main',
    timestamp: '2026-01-15T08:00:00Z',
    message: 'Initial context — first conversation',
    author: 'system',
    context: {
      [CATEGORIES.PREFERENCES]: {
        'editor': 'VS Code with Vim keybindings',
        'theme': 'Dark mode always',
        'language': 'English, conversational tone',
        'code_style': 'Prefer functional programming patterns',
      },
      [CATEGORIES.PROJECTS]: {
        'pulse-guard': 'Community moderation platform built with React',
      },
      [CATEGORIES.GOALS]: {
        'short_term': 'Land a great software engineering internship',
        'learning': 'Get deeper into AI/ML fundamentals',
      },
      [CATEGORIES.BELIEFS]: {
        'ai_philosophy': 'AI should augment humans, not replace them',
        'building': 'Ship fast, iterate faster',
      },
      [CATEGORIES.TECH_STACK]: {
        'frontend': 'React, JavaScript',
        'backend': 'Node.js, Express',
        'database': 'MongoDB',
      },
      [CATEGORIES.COMMUNICATION]: {
        'style': 'Direct and concise',
        'detail_level': 'Show me the code, explain the why',
      },
    },
  },
  {
    id: 'snap-main-02',
    branch: 'main',
    timestamp: '2026-01-22T14:30:00Z',
    message: 'Added key people and schedule context',
    author: 'conversation',
    context: {
      [CATEGORIES.PREFERENCES]: {
        'editor': 'VS Code with Vim keybindings',
        'theme': 'Dark mode always',
        'language': 'English, conversational tone',
        'code_style': 'Prefer functional programming patterns',
        'music_while_coding': 'Lo-fi beats or silence',
      },
      [CATEGORIES.PROJECTS]: {
        'pulse-guard': 'Community moderation platform built with React',
      },
      [CATEGORIES.GOALS]: {
        'short_term': 'Land a great software engineering internship',
        'learning': 'Get deeper into AI/ML fundamentals',
        'fitness': 'Run a half marathon by summer',
      },
      [CATEGORIES.BELIEFS]: {
        'ai_philosophy': 'AI should augment humans, not replace them',
        'building': 'Ship fast, iterate faster',
      },
      [CATEGORIES.TECH_STACK]: {
        'frontend': 'React, JavaScript',
        'backend': 'Node.js, Express',
        'database': 'MongoDB',
        'interested_in': 'Rust, WebAssembly',
      },
      [CATEGORIES.COMMUNICATION]: {
        'style': 'Direct and concise',
        'detail_level': 'Show me the code, explain the why',
      },
      [CATEGORIES.PEOPLE]: {
        'mentor': 'Prof. Sarah Chen — AI/ML research advisor',
        'study_group': 'Alex, Jordan, Priya — weekly algo sessions',
      },
      [CATEGORIES.SCHEDULE]: {
        'peak_hours': 'Most productive 9 PM – 1 AM',
        'classes': 'MWF mornings, T/Th afternoons',
      },
    },
  },
  {
    id: 'snap-main-03',
    branch: 'main',
    timestamp: '2026-01-30T10:15:00Z',
    message: 'Updated goals — applied to Pacific',
    author: 'conversation',
    context: {
      [CATEGORIES.PREFERENCES]: {
        'editor': 'VS Code with Vim keybindings',
        'theme': 'Dark mode always',
        'language': 'English, conversational tone',
        'code_style': 'Prefer functional programming patterns',
        'music_while_coding': 'Lo-fi beats or silence',
      },
      [CATEGORIES.PROJECTS]: {
        'pulse-guard': 'Community moderation platform built with React — adding dark mode',
        'context-diff': 'NEW: Git-like version control for AI context (Pacific submission)',
      },
      [CATEGORIES.GOALS]: {
        'short_term': 'Build something amazing for Pacific internship application',
        'learning': 'Deep dive into context management and retrieval systems',
        'fitness': 'Run a half marathon by summer',
      },
      [CATEGORIES.BELIEFS]: {
        'ai_philosophy': 'AI should augment humans, not replace them',
        'building': 'Ship fast, iterate faster',
        'context': 'Personal AI needs versioned context — like Git for your brain',
      },
      [CATEGORIES.TECH_STACK]: {
        'frontend': 'React, JavaScript, Vite',
        'backend': 'Node.js, Express',
        'database': 'MongoDB',
        'interested_in': 'Rust, WebAssembly',
        'ai_tools': 'Exploring embeddings, vector search',
      },
      [CATEGORIES.COMMUNICATION]: {
        'style': 'Direct and concise',
        'detail_level': 'Show me the code, explain the why',
      },
      [CATEGORIES.PEOPLE]: {
        'mentor': 'Prof. Sarah Chen — AI/ML research advisor',
        'study_group': 'Alex, Jordan, Priya — weekly algo sessions',
        'pacific_contact': 'Annika — recruiter, builders@pacific.app',
      },
      [CATEGORIES.SCHEDULE]: {
        'peak_hours': 'Most productive 9 PM – 1 AM',
        'classes': 'MWF mornings, T/Th afternoons',
        'deadline': 'Pacific submission due April 8',
      },
    },
  },
  {
    id: 'snap-main-04',
    branch: 'main',
    timestamp: '2026-02-08T16:45:00Z',
    message: 'Evolving beliefs about AI personalization',
    author: 'conversation',
    context: {
      [CATEGORIES.PREFERENCES]: {
        'editor': 'VS Code with Vim keybindings',
        'theme': 'Dark mode always',
        'language': 'English, conversational tone',
        'code_style': 'Prefer functional programming, but pragmatic about OOP when needed',
        'music_while_coding': 'Lo-fi beats or silence',
      },
      [CATEGORIES.PROJECTS]: {
        'pulse-guard': 'Community moderation platform — shipped dark mode, working on deploy',
        'context-diff': 'Git for AI context — building diff engine and branch visualization',
      },
      [CATEGORIES.GOALS]: {
        'short_term': 'Build something amazing for Pacific internship application',
        'learning': 'Deep dive into context management, TTFT optimization, retrieval',
        'fitness': 'Run a half marathon by summer — signed up for May race',
      },
      [CATEGORIES.BELIEFS]: {
        'ai_philosophy': 'AI should augment humans, not replace them',
        'building': 'Ship fast, iterate faster, but don\'t ship broken',
        'context': 'Context is the moat — whoever manages personal context best wins',
        'personalization': 'Every AI interaction should feel like talking to someone who really knows you',
      },
      [CATEGORIES.TECH_STACK]: {
        'frontend': 'React, JavaScript, Vite, CSS animations',
        'backend': 'Node.js, Express',
        'database': 'MongoDB, exploring vector databases',
        'interested_in': 'Rust, WebAssembly',
        'ai_tools': 'Embeddings, vector search, prompt engineering',
      },
      [CATEGORIES.COMMUNICATION]: {
        'style': 'Direct and concise',
        'detail_level': 'Show me the code, explain the why',
        'feedback': 'Prefer honest critique over praise',
      },
      [CATEGORIES.PEOPLE]: {
        'mentor': 'Prof. Sarah Chen — AI/ML research advisor',
        'study_group': 'Alex, Jordan, Priya — weekly algo sessions',
        'pacific_contact': 'Annika — recruiter, builders@pacific.app',
      },
      [CATEGORIES.SCHEDULE]: {
        'peak_hours': 'Most productive 9 PM – 1 AM',
        'classes': 'MWF mornings, T/Th afternoons',
        'deadline': 'Pacific submission due April 8',
        'half_marathon': 'May 17 — Bay Area Half Marathon',
      },
    },
  },
  {
    id: 'snap-main-05',
    branch: 'main',
    timestamp: '2026-02-20T09:00:00Z',
    message: 'Refined communication preferences from chat feedback',
    author: 'conversation',
    context: {
      [CATEGORIES.PREFERENCES]: {
        'editor': 'VS Code with Vim keybindings',
        'theme': 'Dark mode always',
        'language': 'English, conversational tone',
        'code_style': 'Prefer functional programming, but pragmatic about OOP when needed',
        'music_while_coding': 'Lo-fi beats or silence',
        'response_format': 'Bullet points for lists, code blocks with comments',
      },
      [CATEGORIES.PROJECTS]: {
        'pulse-guard': 'Community moderation platform — deployed to GitHub Pages',
        'context-diff': 'Git for AI context — core engine done, building UI',
      },
      [CATEGORIES.GOALS]: {
        'short_term': 'Polish Context Diff for Pacific submission',
        'learning': 'Deep dive into context management, TTFT optimization, retrieval',
        'fitness': 'Run a half marathon by summer — signed up for May race',
        'career': 'Explore personal AI as a career direction',
      },
      [CATEGORIES.BELIEFS]: {
        'ai_philosophy': 'AI should augment humans, not replace them',
        'building': 'Ship fast, iterate faster, but don\'t ship broken',
        'context': 'Context is the moat — whoever manages personal context best wins',
        'personalization': 'Every AI interaction should feel like talking to someone who really knows you',
      },
      [CATEGORIES.TECH_STACK]: {
        'frontend': 'React, JavaScript, Vite, CSS animations',
        'backend': 'Node.js, Express',
        'database': 'MongoDB, exploring vector databases',
        'interested_in': 'Rust, WebAssembly, edge computing',
        'ai_tools': 'Embeddings, vector search, prompt engineering, RAG pipelines',
      },
      [CATEGORIES.COMMUNICATION]: {
        'style': 'Direct and concise — skip the preamble',
        'detail_level': 'Show me the code, explain the why',
        'feedback': 'Prefer honest critique over praise',
        'examples': 'Always include concrete examples',
      },
      [CATEGORIES.PEOPLE]: {
        'mentor': 'Prof. Sarah Chen — AI/ML research advisor',
        'study_group': 'Alex, Jordan, Priya — weekly algo sessions',
        'pacific_contact': 'Annika — recruiter, builders@pacific.app',
      },
      [CATEGORIES.SCHEDULE]: {
        'peak_hours': 'Most productive 9 PM – 1 AM',
        'classes': 'MWF mornings, T/Th afternoons',
        'deadline': 'Pacific submission due April 8',
        'half_marathon': 'May 17 — Bay Area Half Marathon',
      },
    },
  },

  // ── work-pacific branch ──
  {
    id: 'snap-work-01',
    branch: 'work-pacific',
    timestamp: '2026-02-01T09:00:00Z',
    message: 'Branched from main — entering work mode for Pacific',
    author: 'system',
    context: {
      [CATEGORIES.PREFERENCES]: {
        'editor': 'VS Code with Vim keybindings',
        'theme': 'Dark mode always',
        'language': 'English, professional but warm tone',
        'code_style': 'Follow team conventions, prefer readability',
        'meetings': 'Camera on, take notes in markdown',
      },
      [CATEGORIES.PROJECTS]: {
        'context-engine': 'Core context management system — designing API surface',
        'search-relevance': 'Improving search result ranking for personal data',
      },
      [CATEGORIES.GOALS]: {
        'q1_goal': 'Ship v1 context retrieval API',
        'learning': 'Understand Pacific\'s search infrastructure deeply',
        'team': 'Build strong relationships with the team',
      },
      [CATEGORIES.BELIEFS]: {
        'product_vision': 'Personal AI needs to feel instant — TTFT is everything',
        'search': 'Search quality = trust. Bad results erode user confidence fast',
      },
      [CATEGORIES.TECH_STACK]: {
        'primary': 'TypeScript, React, Node.js',
        'infra': 'Kubernetes, PostgreSQL, Redis',
        'ai': 'OpenAI API, custom embeddings pipeline',
        'search': 'Elasticsearch, vector search layer',
      },
      [CATEGORIES.COMMUNICATION]: {
        'style': 'Professional, proactive, async-first',
        'updates': 'Daily standup notes in Slack, weekly written updates',
        'code_review': 'Thorough reviewer — focus on correctness and readability',
      },
      [CATEGORIES.PEOPLE]: {
        'manager': 'Dylan — eng lead, loves systems thinking',
        'team': 'Kai (search), Mira (infra), Leo (frontend)',
        'pacific_founders': 'Annika, team leads',
      },
      [CATEGORIES.SCHEDULE]: {
        'work_hours': '9 AM – 5 PM PT, flex for deep work blocks',
        'standup': '9:30 AM daily',
        'one_on_ones': 'Thursdays with Dylan',
      },
    },
  },
  {
    id: 'snap-work-02',
    branch: 'work-pacific',
    timestamp: '2026-02-10T11:00:00Z',
    message: 'Onboarding complete — started on context retrieval API',
    author: 'conversation',
    context: {
      [CATEGORIES.PREFERENCES]: {
        'editor': 'VS Code with Vim keybindings',
        'theme': 'Dark mode always',
        'language': 'English, professional but warm tone',
        'code_style': 'Follow team conventions, prefer readability',
        'meetings': 'Camera on, take notes in markdown',
      },
      [CATEGORIES.PROJECTS]: {
        'context-engine': 'Context retrieval API — designed schema, implementing endpoints',
        'search-relevance': 'Pairing with Kai on re-ranking algorithm',
        'onboarding': 'Completed — documented gaps in dev setup docs',
      },
      [CATEGORIES.GOALS]: {
        'q1_goal': 'Ship v1 context retrieval API by end of Feb',
        'learning': 'Master the embeddings pipeline, understand latency bottlenecks',
        'team': 'Build strong relationships — lunch with a different person each week',
      },
      [CATEGORIES.BELIEFS]: {
        'product_vision': 'Personal AI needs to feel instant — TTFT is everything',
        'search': 'Search quality = trust. Bad results erode user confidence fast',
        'startup_culture': 'Move fast but communicate even faster',
      },
      [CATEGORIES.TECH_STACK]: {
        'primary': 'TypeScript, React, Node.js',
        'infra': 'Kubernetes, PostgreSQL, Redis',
        'ai': 'OpenAI API, custom embeddings pipeline, HNSW indexing',
        'search': 'Elasticsearch, vector search layer, hybrid search',
      },
      [CATEGORIES.COMMUNICATION]: {
        'style': 'Professional, proactive, async-first',
        'updates': 'Daily standup notes in Slack, weekly written updates',
        'code_review': 'Thorough reviewer — focus on correctness and readability',
        'asks': 'Not afraid to ask questions — better to ask than assume',
      },
      [CATEGORIES.PEOPLE]: {
        'manager': 'Dylan — eng lead, loves systems thinking',
        'team': 'Kai (search), Mira (infra), Leo (frontend)',
        'pacific_founders': 'Annika, team leads',
        'lunch_buddies': 'Had great convos with Kai about search at scale',
      },
      [CATEGORIES.SCHEDULE]: {
        'work_hours': '9 AM – 5 PM PT, flex for deep work blocks',
        'standup': '9:30 AM daily',
        'one_on_ones': 'Thursdays with Dylan',
        'focus_blocks': 'Tues/Wed afternoons — no meetings',
      },
    },
  },
  {
    id: 'snap-work-03',
    branch: 'work-pacific',
    timestamp: '2026-02-24T15:30:00Z',
    message: 'Shipped context retrieval API v1 — TTFT improved 40%',
    author: 'conversation',
    context: {
      [CATEGORIES.PREFERENCES]: {
        'editor': 'VS Code with Vim keybindings',
        'theme': 'Dark mode always',
        'language': 'English, professional but warm tone',
        'code_style': 'Follow team conventions, prefer readability',
        'meetings': 'Camera on, take notes in markdown',
        'debugging': 'Printf debugging for quick checks, debugger for complex issues',
      },
      [CATEGORIES.PROJECTS]: {
        'context-engine': 'Context retrieval API v1 SHIPPED — 40% TTFT improvement',
        'search-relevance': 'Re-ranking algorithm showing 25% relevance improvement',
        'context-caching': 'NEW: Exploring context caching strategies for repeat queries',
      },
      [CATEGORIES.GOALS]: {
        'q1_goal': '✅ Shipped v1 context retrieval API',
        'next': 'Optimize cache hit rates, reduce p99 latency',
        'learning': 'Study caching strategies — LRU vs LFU vs semantic similarity caching',
        'team': 'Start mentoring the new intern joining in March',
      },
      [CATEGORIES.BELIEFS]: {
        'product_vision': 'Personal AI needs to feel instant — TTFT is everything',
        'search': 'Hybrid search (keyword + vector) beats pure vector search',
        'startup_culture': 'Move fast but communicate even faster',
        'caching': 'The best request is the one you never make',
      },
      [CATEGORIES.TECH_STACK]: {
        'primary': 'TypeScript, React, Node.js',
        'infra': 'Kubernetes, PostgreSQL, Redis, CDN edge caching',
        'ai': 'OpenAI API, custom embeddings pipeline, HNSW indexing',
        'search': 'Elasticsearch, vector search, hybrid re-ranking',
        'observability': 'Grafana, Prometheus, custom TTFT dashboards',
      },
      [CATEGORIES.COMMUNICATION]: {
        'style': 'Professional, proactive, async-first',
        'updates': 'Daily standup notes in Slack, weekly written updates',
        'code_review': 'Thorough reviewer — focus on correctness and readability',
        'asks': 'Not afraid to ask questions — better to ask than assume',
        'demos': 'Love doing live demos — energy is contagious',
      },
      [CATEGORIES.PEOPLE]: {
        'manager': 'Dylan — eng lead, loves systems thinking',
        'team': 'Kai (search), Mira (infra), Leo (frontend)',
        'pacific_founders': 'Annika, team leads',
        'mentee': 'Preparing onboarding docs for March intern',
      },
      [CATEGORIES.SCHEDULE]: {
        'work_hours': '9 AM – 5 PM PT, flex for deep work blocks',
        'standup': '9:30 AM daily',
        'one_on_ones': 'Thursdays with Dylan',
        'focus_blocks': 'Tues/Wed afternoons — no meetings',
        'demo_day': 'Fridays 4 PM — team demo + retro',
      },
    },
  },
  {
    id: 'snap-work-04',
    branch: 'work-pacific',
    timestamp: '2026-03-15T10:00:00Z',
    message: 'Context caching shipped — exploring permission-aware retrieval',
    author: 'conversation',
    context: {
      [CATEGORIES.PREFERENCES]: {
        'editor': 'VS Code with Vim keybindings',
        'theme': 'Dark mode always',
        'language': 'English, professional but warm tone',
        'code_style': 'Follow team conventions, prefer readability',
        'meetings': 'Camera on, take notes in markdown',
        'debugging': 'Printf debugging for quick checks, debugger for complex issues',
      },
      [CATEGORIES.PROJECTS]: {
        'context-engine': 'Context retrieval API v2 — now with semantic caching',
        'search-relevance': 'Re-ranking shipped to prod, monitoring metrics',
        'context-caching': 'Semantic similarity caching — 60% cache hit rate',
        'permissions': 'NEW: Permission-aware context retrieval — scoping results by access level',
      },
      [CATEGORIES.GOALS]: {
        'q2_goal': 'Ship permission-aware context retrieval',
        'next': 'Build context branching into the product (inspired by Context Diff!)',
        'learning': 'Deep dive into access control models — RBAC vs ABAC',
        'impact': 'Drive TTFT below 500ms for 95% of queries',
      },
      [CATEGORIES.BELIEFS]: {
        'product_vision': 'Personal AI needs to feel instant — TTFT is everything',
        'search': 'Hybrid search (keyword + vector) beats pure vector search',
        'startup_culture': 'Move fast but communicate even faster',
        'caching': 'The best request is the one you never make',
        'permissions': 'Context without permissions is a liability, not a feature',
      },
      [CATEGORIES.TECH_STACK]: {
        'primary': 'TypeScript, React, Node.js',
        'infra': 'Kubernetes, PostgreSQL, Redis, CDN edge caching',
        'ai': 'OpenAI API, custom embeddings pipeline, HNSW, fine-tuned models',
        'search': 'Elasticsearch, vector search, hybrid re-ranking, semantic cache',
        'observability': 'Grafana, Prometheus, custom TTFT dashboards',
        'auth': 'JWT, RBAC policy engine',
      },
      [CATEGORIES.COMMUNICATION]: {
        'style': 'Professional, proactive, async-first',
        'updates': 'Daily standup notes in Slack, weekly written updates, monthly deep-dives',
        'code_review': 'Thorough reviewer — focus on correctness and readability',
        'demos': 'Love doing live demos — energy is contagious',
        'writing': 'Started writing internal tech blog posts',
      },
      [CATEGORIES.PEOPLE]: {
        'manager': 'Dylan — eng lead, loves systems thinking',
        'team': 'Kai (search), Mira (infra), Leo (frontend), Jamie (new intern)',
        'pacific_founders': 'Annika, team leads',
        'mentee': 'Jamie — onboarded, working on UI components',
      },
      [CATEGORIES.SCHEDULE]: {
        'work_hours': '9 AM – 5 PM PT, flex for deep work blocks',
        'standup': '9:30 AM daily',
        'one_on_ones': 'Thursdays with Dylan, Fridays with Jamie',
        'focus_blocks': 'Tues/Wed afternoons — no meetings',
        'demo_day': 'Fridays 4 PM — team demo + retro',
      },
    },
  },

];

// ─── TTFT Benchmark Data ─────────────────────────────────────────────
export const ttftBenchmarks = [
  {
    label: 'Cold Start (No Context)',
    contextSize: 0,
    ttft: 2847,
    tokens: 0,
    color: '#FF4757',
    description: 'AI has no knowledge of user — starts from scratch every time',
  },
  {
    label: 'Basic Profile',
    contextSize: 512,
    ttft: 2105,
    tokens: 512,
    color: '#FF6B9D',
    description: 'Name, role, and basic preferences loaded',
  },
  {
    label: 'Recent Context',
    contextSize: 2048,
    ttft: 1450,
    tokens: 2048,
    color: '#FFA502',
    description: 'Last 5 conversations + active projects',
  },
  {
    label: 'Full Personal Context',
    contextSize: 4096,
    ttft: 890,
    tokens: 4096,
    color: '#2ED573',
    description: 'Complete personal context from latest snapshot',
  },
  {
    label: 'Branched Context (Work)',
    contextSize: 4096,
    ttft: 720,
    tokens: 4096,
    color: '#00D4AA',
    description: 'Role-specific context — only work-relevant data loaded',
  },
  {
    label: 'Cached + Branched',
    contextSize: 4096,
    ttft: 380,
    tokens: 4096,
    color: '#6C63FF',
    description: 'Pre-cached branched context — near-instant personalization',
  },
];
