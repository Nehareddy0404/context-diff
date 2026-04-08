import { useState, useMemo } from 'react';
import { CATEGORY_LABELS, CATEGORY_ICONS } from '../data/sampleData';
import { formatTime, detectConflicts } from '../utils/diffEngine';

export default function BranchManager({ branches, snapshots, activeBranch, onSwitchBranch }) {
  const [conflictPair, setConflictPair] = useState(null); // { a: branchId, b: branchId }

  const branchData = useMemo(() => {
    return branches.map(branch => {
      const branchSnaps = snapshots.filter(s => s.branch === branch.id);
      const latestSnap = branchSnaps.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
      return {
        ...branch,
        snapshotCount: branchSnaps.length,
        latestSnapshot: latestSnap,
        snaps: branchSnaps.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)),
      };
    });
  }, [branches, snapshots]);

  // Auto-detect conflicts for any selected pair
  const conflictResult = useMemo(() => {
    if (!conflictPair) return null;
    return detectConflicts(snapshots, conflictPair.a, conflictPair.b);
  }, [conflictPair, snapshots]);

  // Generate conflict pairs from branch combinations
  const branchPairs = useMemo(() => {
    const pairs = [];
    for (let i = 0; i < branches.length; i++) {
      for (let j = i + 1; j < branches.length; j++) {
        pairs.push({ a: branches[i].id, b: branches[j].id });
      }
    }
    return pairs;
  }, [branches]);

  // Quick conflict summary for each pair
  const conflictSummary = useMemo(() => {
    return branchPairs.map(pair => {
      const result = detectConflicts(snapshots, pair.a, pair.b);
      return { ...pair, count: result.conflicts.length };
    });
  }, [branchPairs, snapshots]);

  const getBranch = (id) => branches.find(b => b.id === id);

  return (
    <div className="branch-manager view-enter">
      {/* Branch Graph */}
      <div className="branch-graph">
        <div className="branch-graph-title">Branch Graph</div>
        {branchData.map(branch => (
          <div key={branch.id} className="branch-lane">
            <div className="branch-lane-label" style={{ color: branch.color }}>
              <span>{branch.icon}</span>
              <span>{branch.name}</span>
              <span className="branch-lane-count">({branch.snapshotCount})</span>
            </div>
            <div className="branch-lane-line" style={{ background: branch.color }}>
              <div className="branch-lane-dots">
                {branch.snaps.map((snap) => (
                  <div
                    key={snap.id}
                    className="branch-lane-dot"
                    style={{ borderColor: branch.color, color: branch.color }}
                    title={`${snap.message}\n${formatTime(snap.timestamp)}`}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
        
        {/* Fork indicators */}
        <div style={{ 
          marginTop: 16, 
          paddingTop: 16, 
          borderTop: '1px solid var(--border-subtle)',
          fontSize: 11,
          color: 'var(--text-muted)',
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
        }}>
          {branchData.filter(b => b.parentBranch).map(branch => (
            <span key={branch.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ 
                width: 8, height: 8, borderRadius: '50%', 
                background: branch.color, display: 'inline-block' 
              }} />
              <span style={{ color: branch.color }}>{branch.name}</span>
              <span>forked from</span>
              <span style={{ 
                color: branchData.find(b => b.id === branch.parentBranch)?.color 
              }}>
                {branch.parentBranch}
              </span>
              <span>at {branch.forkPoint?.replace('snap-', '')}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Branch Cards */}
      <div className="branch-cards">
        {branchData.map(branch => (
          <div
            key={branch.id}
            className={`branch-card ${branch.id === activeBranch ? 'active' : ''}`}
            onClick={() => onSwitchBranch(branch.id)}
            style={{ '--branch-color': branch.color }}
          >
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 3,
              background: branch.color,
            }} />
            <div className="branch-card-name" style={{ color: branch.color }}>
              <span>{branch.icon}</span>
              {branch.label}
              {branch.id === activeBranch && (
                <span className="badge badge-neutral" style={{ fontSize: 10, marginLeft: 4 }}>
                  ACTIVE
                </span>
              )}
            </div>
            <div className="branch-card-desc">{branch.description}</div>
            <div className="branch-card-stats">
              <div className="branch-card-stat">
                📸 {branch.snapshotCount} snapshots
              </div>
              {branch.latestSnapshot && (
                <div className="branch-card-stat">
                  🕐 Last: {formatTime(branch.latestSnapshot.timestamp)}
                </div>
              )}
              {branch.parentBranch && (
                <div className="branch-card-stat">
                  🔀 from {branch.parentBranch}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Context Conflict Detection */}
      <div className="conflict-section">
        <div className="conflict-section-header">
          <h3>⚠️ Context Conflict Detection</h3>
          <p>Detect when branches have diverged with conflicting context values — like Git merge conflicts, but for who you are.</p>
        </div>

        {/* Conflict pair selector */}
        <div className="conflict-pairs">
          {conflictSummary.map(({ a, b, count }) => {
            const branchA = getBranch(a);
            const branchB = getBranch(b);
            const isActive = conflictPair?.a === a && conflictPair?.b === b;
            return (
              <button
                key={`${a}-${b}`}
                className={`conflict-pair-btn ${isActive ? 'active' : ''} ${count > 0 ? 'has-conflicts' : ''}`}
                onClick={() => setConflictPair(isActive ? null : { a, b })}
              >
                <span className="conflict-pair-branches">
                  <span style={{ color: branchA?.color }}>{branchA?.icon} {branchA?.label}</span>
                  <span className="conflict-vs">↔</span>
                  <span style={{ color: branchB?.color }}>{branchB?.icon} {branchB?.label}</span>
                </span>
                <span className={`conflict-count ${count > 0 ? 'conflict-count-warn' : 'conflict-count-ok'}`}>
                  {count > 0 ? `⚠ ${count} conflict${count !== 1 ? 's' : ''}` : '✓ No conflicts'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Conflict details */}
        {conflictResult && conflictPair && (
          <div className="conflict-results view-enter">
            {conflictResult.conflicts.length > 0 ? (
              <>
                <div className="conflict-results-title">
                  {conflictResult.conflicts.length} Conflict{conflictResult.conflicts.length !== 1 ? 's' : ''} Found
                </div>
                {conflictResult.conflicts.map((conflict, i) => (
                  <div key={i} className={`conflict-item conflict-severity-${conflict.severity}`} style={{ animationDelay: `${i * 50}ms` }}>
                    <div className="conflict-item-header">
                      <span className="conflict-category">
                        {CATEGORY_ICONS[conflict.category] || '📁'} {CATEGORY_LABELS[conflict.category] || conflict.category}
                      </span>
                      <span className="conflict-key">{conflict.key}</span>
                      <span className={`badge badge-${conflict.severity === 'high' ? 'del' : conflict.severity === 'medium' ? 'mod' : 'neutral'}`}>
                        {conflict.severity}
                      </span>
                    </div>
                    <div className="conflict-values">
                      <div className="conflict-value-row" style={{ color: getBranch(conflictPair.a)?.color }}>
                        <span className="conflict-branch-label">{getBranch(conflictPair.a)?.icon} {getBranch(conflictPair.a)?.label}:</span>
                        <span>{conflict.valueA}</span>
                      </div>
                      <div className="conflict-value-row" style={{ color: getBranch(conflictPair.b)?.color }}>
                        <span className="conflict-branch-label">{getBranch(conflictPair.b)?.icon} {getBranch(conflictPair.b)?.label}:</span>
                        <span>{conflict.valueB}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="conflict-none">
                <span>✅</span> No conflicts between these branches. All shared keys have identical values.
              </div>
            )}

            {/* Summary stats */}
            <div className="conflict-summary-bar">
              <span>✓ {conflictResult.resolved.length} shared</span>
              <span>⚠ {conflictResult.conflicts.length} conflicting</span>
              <span style={{ color: getBranch(conflictPair.a)?.color }}>
                {conflictResult.branchAOnly.length} only in {getBranch(conflictPair.a)?.label}
              </span>
              <span style={{ color: getBranch(conflictPair.b)?.color }}>
                {conflictResult.branchBOnly.length} only in {getBranch(conflictPair.b)?.label}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Info section */}
      <div className="ttft-explanation">
        <h3>🌿 How Context Branching Works</h3>
        <p>
          Just like Git branches, <strong>context branches</strong> let you maintain separate 
          versions of your personal AI context for different roles and domains.
        </p>
        <p>
          Your <code>main</code> branch holds your core identity. When you start a new domain 
          (like a job or a side project), you <strong>fork</strong> a new branch that inherits 
          your base context but evolves independently.
        </p>
        <p>
          This means your <strong>work AI</strong> knows your professional context without 
          leaking personal details, and your <strong>startup AI</strong> can explore ideas 
          without cluttering your day job context.
        </p>
      </div>
    </div>
  );
}
