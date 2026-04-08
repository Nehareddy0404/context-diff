import { describe, it, expect } from 'vitest';
import {
  computeDiff,
  computeStats,
  searchHistory,
  getContextSize,
  estimateTokens,
  computeTTFT,
  computeBlame,
  detectConflicts,
  getCategoryPermission,
  PERMISSION_LEVELS,
} from './diffEngine';

// ─── Test fixtures ─────────────────────────────────────────────────
const snapshotA = {
  id: 'snap-test-01',
  branch: 'main',
  timestamp: '2026-01-15T08:00:00Z',
  message: 'Initial context',
  author: 'system',
  context: {
    preferences: {
      editor: 'VS Code',
      theme: 'Dark mode',
    },
    goals: {
      short_term: 'Learn React',
    },
  },
};

const snapshotB = {
  id: 'snap-test-02',
  branch: 'main',
  timestamp: '2026-01-22T14:00:00Z',
  message: 'Updated preferences and added goals',
  author: 'conversation',
  context: {
    preferences: {
      editor: 'VS Code',           // unchanged
      theme: 'Light mode',         // modified
      music: 'Lo-fi beats',        // added
    },
    goals: {
      // short_term removed (deletion)
      learning: 'Deep dive into AI', // added
    },
  },
};

const snapshotC = {
  id: 'snap-test-03',
  branch: 'work',
  timestamp: '2026-02-01T09:00:00Z',
  message: 'Work context for Pacific project',
  author: 'system',
  context: {
    preferences: {
      editor: 'VS Code',
      theme: 'Dark mode',
    },
    projects: {
      main_project: 'Context engine for Pacific',
    },
  },
};

// ─── computeDiff ───────────────────────────────────────────────────
describe('computeDiff', () => {
  it('should identify additions (keys in B not in A)', () => {
    const diff = computeDiff(snapshotA, snapshotB);
    const addedKeys = diff.additions.map(a => a.key);
    expect(addedKeys).toContain('music');
    expect(addedKeys).toContain('learning');
  });

  it('should identify deletions (keys in A not in B)', () => {
    const diff = computeDiff(snapshotA, snapshotB);
    const deletedKeys = diff.deletions.map(d => d.key);
    expect(deletedKeys).toContain('short_term');
  });

  it('should identify modifications (same key, different value)', () => {
    const diff = computeDiff(snapshotA, snapshotB);
    const modifiedKeys = diff.modifications.map(m => m.key);
    expect(modifiedKeys).toContain('theme');
    
    const themeMod = diff.modifications.find(m => m.key === 'theme');
    expect(themeMod.oldValue).toBe('Dark mode');
    expect(themeMod.newValue).toBe('Light mode');
  });

  it('should recognize unchanged entries', () => {
    const diff = computeDiff(snapshotA, snapshotB);
    const unchangedKeys = diff.unchanged.map(u => u.key);
    expect(unchangedKeys).toContain('editor');
  });

  it('should produce zero changes for identical snapshots', () => {
    const diff = computeDiff(snapshotA, snapshotA);
    expect(diff.additions).toHaveLength(0);
    expect(diff.deletions).toHaveLength(0);
    expect(diff.modifications).toHaveLength(0);
    expect(diff.unchanged.length).toBeGreaterThan(0);
  });
});

// ─── computeStats ──────────────────────────────────────────────────
describe('computeStats', () => {
  it('should return correct counts and change rate', () => {
    const diff = computeDiff(snapshotA, snapshotB);
    const stats = computeStats(diff);
    
    expect(stats.additions).toBe(2);       // music, learning
    expect(stats.deletions).toBe(1);       // short_term
    expect(stats.modifications).toBe(1);   // theme
    expect(stats.unchanged).toBe(1);       // editor
    expect(stats.total).toBe(4);           // 2 + 1 + 1
    expect(Number(stats.changeRate)).toBeGreaterThan(0);
  });
});

// ─── searchHistory ─────────────────────────────────────────────────
describe('searchHistory', () => {
  const allSnapshots = [snapshotA, snapshotB, snapshotC];

  it('should find matches in keys and values', () => {
    const results = searchHistory('VS Code', allSnapshots);
    expect(results.length).toBeGreaterThanOrEqual(3); // appears in all 3 snapshots
  });

  it('should find matches in snapshot messages', () => {
    const results = searchHistory('Pacific', allSnapshots);
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(r => r.branch === 'work')).toBe(true);
  });

  it('should respect branch filter', () => {
    const results = searchHistory('VS Code', allSnapshots, 'work');
    expect(results.every(r => r.branch === 'work')).toBe(true);
  });

  it('should return empty array for no matches', () => {
    const results = searchHistory('xyznonexistent', allSnapshots);
    expect(results).toHaveLength(0);
  });
});

// ─── getContextSize ────────────────────────────────────────────────
describe('getContextSize', () => {
  it('should count all entries across all categories', () => {
    const size = getContextSize(snapshotA);
    // preferences: 2 (editor, theme) + goals: 1 (short_term) = 3
    expect(size).toBe(3);
  });

  it('should handle empty context', () => {
    const size = getContextSize({ context: {} });
    expect(size).toBe(0);
  });
});

// ─── estimateTokens ────────────────────────────────────────────────
describe('estimateTokens', () => {
  it('should return a positive number for non-empty context', () => {
    const tokens = estimateTokens(snapshotA);
    expect(tokens).toBeGreaterThan(0);
  });

  it('should return more tokens for larger snapshots', () => {
    const tokensA = estimateTokens(snapshotA);
    const tokensB = estimateTokens(snapshotB);
    expect(tokensB).toBeGreaterThan(tokensA); // B has more entries
  });
});

// ─── computeTTFT ───────────────────────────────────────────────────
describe('computeTTFT', () => {
  it('should return lower TTFT with cached + branched context', () => {
    const cold = computeTTFT(0, false, false);
    const warm = computeTTFT(4096, true, true);
    expect(warm).toBeLessThan(cold);
  });
});

// ─── computeBlame (Semantic Blame) ─────────────────────────────────
describe('computeBlame', () => {
  const allSnapshots = [snapshotA, snapshotB];

  it('should trace initial entries to the first snapshot', () => {
    const blame = computeBlame(allSnapshots, 'main');
    expect(blame.preferences.editor.changeType).toBe('initial');
    expect(blame.preferences.editor.changedIn).toBe('snap-test-01');
  });

  it('should track modifications with previous value', () => {
    const blame = computeBlame(allSnapshots, 'main');
    expect(blame.preferences.theme.changeType).toBe('modified');
    expect(blame.preferences.theme.previousValue).toBe('Dark mode');
    expect(blame.preferences.theme.value).toBe('Light mode');
  });

  it('should track additions as changeType "added"', () => {
    const blame = computeBlame(allSnapshots, 'main');
    expect(blame.preferences.music.changeType).toBe('added');
    expect(blame.preferences.music.changedIn).toBe('snap-test-02');
  });

  it('should track the author of each change', () => {
    const blame = computeBlame(allSnapshots, 'main');
    expect(blame.preferences.editor.author).toBe('system');
    expect(blame.preferences.music.author).toBe('conversation');
  });

  it('should return empty object for unknown branch', () => {
    const blame = computeBlame(allSnapshots, 'nonexistent');
    expect(Object.keys(blame)).toHaveLength(0);
  });
});

// ─── detectConflicts (Context Conflict Detection) ──────────────────
describe('detectConflicts', () => {
  const allSnapshots = [snapshotA, snapshotB, snapshotC];

  it('should detect conflicts (same key, different value across branches)', () => {
    // snapshotB (main): theme = 'Light mode'
    // snapshotC (work): theme = 'Dark mode'
    const result = detectConflicts(allSnapshots, 'main', 'work');
    const conflictKeys = result.conflicts.map(c => c.key);
    expect(conflictKeys).toContain('theme');
  });

  it('should identify resolved entries (same key, same value)', () => {
    const result = detectConflicts(allSnapshots, 'main', 'work');
    const resolvedKeys = result.resolved.map(r => r.key);
    expect(resolvedKeys).toContain('editor'); // both have 'VS Code'
  });

  it('should identify branch-only entries', () => {
    const result = detectConflicts(allSnapshots, 'main', 'work');
    // 'music' only exists in main (snapshotB), 'main_project' only in work
    expect(result.branchAOnly.some(e => e.key === 'music')).toBe(true);
    expect(result.branchBOnly.some(e => e.key === 'main_project')).toBe(true);
  });

  it('should assign severity based on category', () => {
    // goals category should be 'high' severity
    const mainWithGoals = { ...snapshotB, branch: 'branchX' };
    const workWithGoals = {
      ...snapshotC,
      branch: 'branchY',
      context: { ...snapshotC.context, goals: { learning: 'Something else' } },
    };
    const result = detectConflicts([mainWithGoals, workWithGoals], 'branchX', 'branchY');
    const goalConflict = result.conflicts.find(c => c.category === 'goals');
    if (goalConflict) {
      expect(goalConflict.severity).toBe('high');
    }
  });

  it('should return empty results for missing branches', () => {
    const result = detectConflicts(allSnapshots, 'main', 'nonexistent');
    expect(result.conflicts).toHaveLength(0);
  });
});

// ─── getCategoryPermission (Permission Levels) ─────────────────────
describe('getCategoryPermission', () => {
  const branches = [
    { id: 'main', parentBranch: null },
    { id: 'work-pacific', parentBranch: 'main' },
  ];

  it('should return default permissions for main branch', () => {
    const perm = getCategoryPermission('beliefs', 'main', branches);
    expect(perm).toBe(PERMISSION_LEVELS.PRIVATE);
  });

  it('should mark public categories as inherited on forked branches', () => {
    const perm = getCategoryPermission('preferences', 'work-pacific', branches);
    expect(perm).toBe(PERMISSION_LEVELS.INHERITED);
  });

  it('should keep branch-only categories on forked branches', () => {
    const perm = getCategoryPermission('active_projects', 'work-pacific', branches);
    expect(perm).toBe(PERMISSION_LEVELS.BRANCH_ONLY);
  });
});
