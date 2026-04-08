// Context Diff — Diff Engine & Utilities
// Computes diffs, blame, conflicts, permissions, searches history, and simulates TTFT

/**
 * Compute a detailed diff between two context snapshots
 */
export function computeDiff(snapshotA, snapshotB) {
  const diff = {
    additions: [],
    deletions: [],
    modifications: [],
    unchanged: [],
  };

  const ctxA = snapshotA?.context || {};
  const ctxB = snapshotB?.context || {};
  const allCategories = new Set([...Object.keys(ctxA), ...Object.keys(ctxB)]);

  for (const category of allCategories) {
    const catA = ctxA[category] || {};
    const catB = ctxB[category] || {};
    const allKeys = new Set([...Object.keys(catA), ...Object.keys(catB)]);

    for (const key of allKeys) {
      const valA = catA[key];
      const valB = catB[key];

      if (valA === undefined && valB !== undefined) {
        diff.additions.push({ category, key, value: valB });
      } else if (valA !== undefined && valB === undefined) {
        diff.deletions.push({ category, key, value: valA });
      } else if (valA !== valB) {
        diff.modifications.push({ category, key, oldValue: valA, newValue: valB });
      } else {
        diff.unchanged.push({ category, key, value: valA });
      }
    }
  }

  return diff;
}

/**
 * Compute summary statistics for a diff
 */
export function computeStats(diff) {
  return {
    additions: diff.additions.length,
    deletions: diff.deletions.length,
    modifications: diff.modifications.length,
    unchanged: diff.unchanged.length,
    total: diff.additions.length + diff.deletions.length + diff.modifications.length,
    changeRate: diff.additions.length + diff.deletions.length + diff.modifications.length > 0
      ? ((diff.additions.length + diff.deletions.length + diff.modifications.length) /
        (diff.additions.length + diff.deletions.length + diff.modifications.length + diff.unchanged.length) * 100).toFixed(1)
      : 0,
  };
}

/**
 * Search across all snapshots for a query string
 */
export function searchHistory(query, snapshots, branchFilter = null) {
  const results = [];
  const q = query.toLowerCase();

  const filtered = branchFilter
    ? snapshots.filter(s => s.branch === branchFilter)
    : snapshots;

  for (const snapshot of filtered) {
    for (const [category, entries] of Object.entries(snapshot.context || {})) {
      for (const [key, value] of Object.entries(entries)) {
        if (
          key.toLowerCase().includes(q) ||
          value.toLowerCase().includes(q) ||
          snapshot.message.toLowerCase().includes(q)
        ) {
          results.push({
            snapshotId: snapshot.id,
            branch: snapshot.branch,
            timestamp: snapshot.timestamp,
            message: snapshot.message,
            category,
            key,
            value,
            matchType: key.toLowerCase().includes(q) ? 'key' : 
                       value.toLowerCase().includes(q) ? 'value' : 'message',
          });
        }
      }
    }
  }

  return results;
}

/**
 * Simulate TTFT calculation based on context configuration
 */
export function computeTTFT(contextTokens, isCached = false, isBranched = false) {
  // Base TTFT with no context (cold start)
  const baseTTFT = 2847;
  
  // Context reduces TTFT through pre-loaded understanding
  const contextReduction = Math.min(contextTokens / 4096, 1) * 0.65;
  
  // Branching reduces TTFT by loading only relevant context
  const branchReduction = isBranched ? 0.10 : 0;
  
  // Caching provides additional speedup
  const cacheReduction = isCached ? 0.15 : 0;
  
  const totalReduction = Math.min(contextReduction + branchReduction + cacheReduction, 0.87);
  
  return Math.round(baseTTFT * (1 - totalReduction));
}

/**
 * Get the context size (number of entries) for a snapshot
 */
export function getContextSize(snapshot) {
  let count = 0;
  for (const entries of Object.values(snapshot.context || {})) {
    count += Object.keys(entries).length;
  }
  return count;
}

/**
 * Estimate token count for a context snapshot
 */
export function estimateTokens(snapshot) {
  let text = '';
  for (const [, entries] of Object.entries(snapshot.context || {})) {
    for (const [key, value] of Object.entries(entries)) {
      text += `${key}: ${value}\n`;
    }
  }
  // Rough estimate: ~4 chars per token
  return Math.round(text.length / 4);
}

/**
 * Format a timestamp into a human-readable string
 */
export function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTimeShort(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function formatTimeFull(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Get relative time string
 */
export function timeAgo(timestamp) {
  const now = new Date();
  const then = new Date(timestamp);
  const diff = now - then;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

/**
 * Group changes by category for display
 */
export function groupByCategory(items) {
  const groups = {};
  for (const item of items) {
    if (!groups[item.category]) {
      groups[item.category] = [];
    }
    groups[item.category].push(item);
  }
  return groups;
}

/**
 * Semantic Blame — trace the history of each context entry across snapshots.
 * For the latest snapshot on a branch, returns who/what changed each key and when.
 */
export function computeBlame(snapshots, branchId) {
  const branchSnaps = snapshots
    .filter(s => s.branch === branchId)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  if (branchSnaps.length === 0) return {};

  const blame = {}; // { category: { key: { value, changedIn, changedAt, previousValue, author, changeType } } }

  for (let i = 0; i < branchSnaps.length; i++) {
    const snap = branchSnaps[i];
    const prevSnap = i > 0 ? branchSnaps[i - 1] : null;

    for (const [category, entries] of Object.entries(snap.context || {})) {
      if (!blame[category]) blame[category] = {};

      for (const [key, value] of Object.entries(entries)) {
        const prevValue = prevSnap?.context?.[category]?.[key];

        if (prevValue === undefined) {
          // Key was added in this snapshot
          blame[category][key] = {
            value,
            changedIn: snap.id,
            changedAt: snap.timestamp,
            previousValue: null,
            author: snap.author || 'unknown',
            message: snap.message,
            changeType: i === 0 ? 'initial' : 'added',
          };
        } else if (prevValue !== value) {
          // Key was modified in this snapshot
          blame[category][key] = {
            value,
            changedIn: snap.id,
            changedAt: snap.timestamp,
            previousValue: prevValue,
            author: snap.author || 'unknown',
            message: snap.message,
            changeType: 'modified',
          };
        }
        // If value unchanged, keep the previous blame entry
      }
    }

    // Check for deletions (keys in prev but not in this)
    if (prevSnap) {
      for (const [category, entries] of Object.entries(prevSnap.context || {})) {
        for (const key of Object.keys(entries)) {
          if (!snap.context?.[category]?.[key]) {
            if (!blame[category]) blame[category] = {};
            blame[category][key] = {
              value: null,
              changedIn: snap.id,
              changedAt: snap.timestamp,
              previousValue: entries[key],
              author: snap.author || 'unknown',
              message: snap.message,
              changeType: 'deleted',
            };
          }
        }
      }
    }
  }

  return blame;
}

/**
 * Context Conflict Detection — find keys that diverged between two branches.
 * A conflict occurs when both branches have the same key but different values,
 * and one isn't a direct ancestor of the other's value.
 */
export function detectConflicts(snapshots, branchA, branchB) {
  // Get the latest snapshot from each branch
  const latestA = snapshots
    .filter(s => s.branch === branchA)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
  const latestB = snapshots
    .filter(s => s.branch === branchB)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

  if (!latestA || !latestB) return { conflicts: [], resolved: [], branchAOnly: [], branchBOnly: [] };

  const conflicts = [];
  const resolved = [];   // Same key, same value (no conflict)
  const branchAOnly = [];
  const branchBOnly = [];

  const ctxA = latestA.context || {};
  const ctxB = latestB.context || {};
  const allCategories = new Set([...Object.keys(ctxA), ...Object.keys(ctxB)]);

  for (const category of allCategories) {
    const catA = ctxA[category] || {};
    const catB = ctxB[category] || {};
    const allKeys = new Set([...Object.keys(catA), ...Object.keys(catB)]);

    for (const key of allKeys) {
      const valA = catA[key];
      const valB = catB[key];

      if (valA !== undefined && valB !== undefined) {
        if (valA !== valB) {
          conflicts.push({
            category,
            key,
            valueA: valA,
            valueB: valB,
            severity: categorizeSeverity(category, key),
          });
        } else {
          resolved.push({ category, key, value: valA });
        }
      } else if (valA !== undefined && valB === undefined) {
        branchAOnly.push({ category, key, value: valA });
      } else if (valA === undefined && valB !== undefined) {
        branchBOnly.push({ category, key, value: valB });
      }
    }
  }

  return { conflicts, resolved, branchAOnly, branchBOnly };
}

/**
 * Categorize the severity of a context conflict
 */
function categorizeSeverity(category, key) {
  // High severity: core identity conflicts
  if (category === 'beliefs' || category === 'goals') return 'high';
  // Medium severity: work-relevant conflicts
  if (category === 'tech_stack' || category === 'active_projects') return 'medium';
  // Low severity: preference differences (expected between branches)
  return 'low';
}

// ─── Permission Levels ──────────────────────────────────────────────

/**
 * Permission levels for context categories.
 * Controls visibility and editability across branches.
 */
export const PERMISSION_LEVELS = {
  PUBLIC: 'public',       // Visible to all branches, inherited on fork
  BRANCH_ONLY: 'branch',  // Visible only on this branch
  PRIVATE: 'private',     // Visible only to the user, never shared
  INHERITED: 'inherited', // Inherited from parent branch, read-only
};

export const PERMISSION_LABELS = {
  [PERMISSION_LEVELS.PUBLIC]: 'Shared',
  [PERMISSION_LEVELS.BRANCH_ONLY]: 'Branch Only',
  [PERMISSION_LEVELS.PRIVATE]: 'Private',
  [PERMISSION_LEVELS.INHERITED]: 'Inherited',
};

export const PERMISSION_ICONS = {
  [PERMISSION_LEVELS.PUBLIC]: '🌐',
  [PERMISSION_LEVELS.BRANCH_ONLY]: '🔒',
  [PERMISSION_LEVELS.PRIVATE]: '🔐',
  [PERMISSION_LEVELS.INHERITED]: '📥',
};

/**
 * Default permission mapping for categories.
 * In production this would be user-configurable per branch.
 */
export const DEFAULT_PERMISSIONS = {
  preferences: PERMISSION_LEVELS.PUBLIC,
  active_projects: PERMISSION_LEVELS.BRANCH_ONLY,
  goals: PERMISSION_LEVELS.BRANCH_ONLY,
  beliefs: PERMISSION_LEVELS.PRIVATE,
  tech_stack: PERMISSION_LEVELS.PUBLIC,
  communication_style: PERMISSION_LEVELS.PUBLIC,
  key_people: PERMISSION_LEVELS.BRANCH_ONLY,
  schedule: PERMISSION_LEVELS.BRANCH_ONLY,
};

/**
 * Get the effective permission for a category on a specific branch
 */
export function getCategoryPermission(category, branchId, branches) {
  const branch = branches.find(b => b.id === branchId);
  if (!branch) return DEFAULT_PERMISSIONS[category] || PERMISSION_LEVELS.PUBLIC;

  // If this is the main branch, everything is public or branch-only
  if (!branch.parentBranch) {
    return DEFAULT_PERMISSIONS[category] || PERMISSION_LEVELS.PUBLIC;
  }

  // For forked branches, some categories may be inherited
  const defaultPerm = DEFAULT_PERMISSIONS[category];
  if (defaultPerm === PERMISSION_LEVELS.PUBLIC) {
    return PERMISSION_LEVELS.INHERITED; // Inherited from parent
  }
  return defaultPerm;
}
