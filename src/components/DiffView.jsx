import { useState, useMemo } from 'react';
import { CATEGORY_LABELS, CATEGORY_ICONS } from '../data/sampleData';
import { computeDiff, computeStats, groupByCategory, formatTimeFull } from '../utils/diffEngine';

export default function DiffView({ snapshots, selectedA, selectedB }) {
  const [viewMode, setViewMode] = useState('unified'); // 'unified' or 'split'

  const snapshotA = useMemo(
    () => snapshots.find(s => s.id === selectedA),
    [snapshots, selectedA]
  );
  const snapshotB = useMemo(
    () => snapshots.find(s => s.id === selectedB),
    [snapshots, selectedB]
  );

  const diff = useMemo(() => {
    if (!snapshotA || !snapshotB) return null;
    return computeDiff(snapshotA, snapshotB);
  }, [snapshotA, snapshotB]);

  const stats = useMemo(() => {
    if (!diff) return null;
    return computeStats(diff);
  }, [diff]);

  if (!snapshotA || !snapshotB) {
    return (
      <div className="diff-empty-state">
        <div className="big-icon">📊</div>
        <h3>Select Two Snapshots to Compare</h3>
        <p>
          Go to the Timeline view and click two snapshots to see how your 
          context changed between them. Like <code>git diff</code>, but for your personal AI context.
        </p>
      </div>
    );
  }

  if (!diff) return null;

  // Group all changes by category
  const additionsByCategory = groupByCategory(diff.additions);
  const deletionsByCategory = groupByCategory(diff.deletions);
  const modificationsByCategory = groupByCategory(diff.modifications);

  // Get all categories that have changes
  const changedCategories = new Set([
    ...Object.keys(additionsByCategory),
    ...Object.keys(deletionsByCategory),
    ...Object.keys(modificationsByCategory),
  ]);

  return (
    <div className="diff-container view-enter">
      {/* Header */}
      <div className="diff-header">
        <div className="diff-snapshots">
          <div className="diff-snapshot-ref" style={{ color: '#FF6B9D' }}>
            <span>◆</span> {snapshotA.id.replace('snap-', '')}
            <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: 11 }}>
              {formatTimeFull(snapshotA.timestamp)}
            </span>
          </div>
          <span className="diff-arrow">→</span>
          <div className="diff-snapshot-ref" style={{ color: '#00D4AA' }}>
            <span>◆</span> {snapshotB.id.replace('snap-', '')}
            <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: 11 }}>
              {formatTimeFull(snapshotB.timestamp)}
            </span>
          </div>
        </div>
        <div className="header-actions">
          <button 
            className={`btn btn-sm ${viewMode === 'unified' ? 'btn-primary' : ''}`}
            onClick={() => setViewMode('unified')}
          >
            Unified
          </button>
          <button 
            className={`btn btn-sm ${viewMode === 'split' ? 'btn-primary' : ''}`}
            onClick={() => setViewMode('split')}
          >
            Split
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="diff-stats-bar">
        <div className="diff-stat additions">
          <span>+{stats.additions}</span>
          <span style={{ fontSize: 11, fontWeight: 400 }}>additions</span>
        </div>
        <div className="diff-stat deletions">
          <span>−{stats.deletions}</span>
          <span style={{ fontSize: 11, fontWeight: 400 }}>deletions</span>
        </div>
        <div className="diff-stat modifications">
          <span>~{stats.modifications}</span>
          <span style={{ fontSize: 11, fontWeight: 400 }}>modifications</span>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-tertiary)' }}>
          {stats.changeRate}% changed
        </div>
      </div>

      {/* Diff Content */}
      {changedCategories.size === 0 ? (
        <div className="diff-empty-state">
          <div className="big-icon">✨</div>
          <h3>No Changes</h3>
          <p>These two snapshots are identical.</p>
        </div>
      ) : (
        Array.from(changedCategories).sort().map(category => (
          <div key={category} className="diff-category">
            <div className="diff-category-header">
              <span className="diff-category-icon">
                {CATEGORY_ICONS[category] || '📁'}
              </span>
              <span>{CATEGORY_LABELS[category] || category}</span>
              <span style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                {additionsByCategory[category]?.length > 0 && (
                  <span className="badge badge-add">+{additionsByCategory[category].length}</span>
                )}
                {deletionsByCategory[category]?.length > 0 && (
                  <span className="badge badge-del">-{deletionsByCategory[category].length}</span>
                )}
                {modificationsByCategory[category]?.length > 0 && (
                  <span className="badge badge-mod">~{modificationsByCategory[category].length}</span>
                )}
              </span>
            </div>
            <div className="diff-lines">
              {/* Deletions */}
              {(deletionsByCategory[category] || []).map((item, i) => (
                <div key={`del-${i}`} className="diff-line deletion" style={{ animationDelay: `${i * 30}ms` }}>
                  <span className="diff-line-prefix del">−</span>
                  <span className="diff-line-key">{item.key}:</span>
                  <span className="diff-line-value" style={{ color: 'var(--diff-del)' }}>{item.value}</span>
                </div>
              ))}
              {/* Additions */}
              {(additionsByCategory[category] || []).map((item, i) => (
                <div key={`add-${i}`} className="diff-line addition" style={{ animationDelay: `${i * 30}ms` }}>
                  <span className="diff-line-prefix add">+</span>
                  <span className="diff-line-key">{item.key}:</span>
                  <span className="diff-line-value" style={{ color: 'var(--diff-add)' }}>{item.value}</span>
                </div>
              ))}
              {/* Modifications */}
              {viewMode === 'unified' ? (
                (modificationsByCategory[category] || []).map((item, i) => (
                  <div key={`mod-${i}`}>
                    <div className="diff-line deletion" style={{ animationDelay: `${i * 30}ms` }}>
                      <span className="diff-line-prefix del">−</span>
                      <span className="diff-line-key">{item.key}:</span>
                      <span className="diff-line-value" style={{ color: 'var(--diff-del)' }}>{item.oldValue}</span>
                    </div>
                    <div className="diff-line addition" style={{ animationDelay: `${i * 30 + 15}ms` }}>
                      <span className="diff-line-prefix add">+</span>
                      <span className="diff-line-key">{item.key}:</span>
                      <span className="diff-line-value" style={{ color: 'var(--diff-add)' }}>{item.newValue}</span>
                    </div>
                  </div>
                ))
              ) : (
                (modificationsByCategory[category] || []).map((item, i) => (
                  <div key={`mod-${i}`} className="diff-line modification" style={{ animationDelay: `${i * 30}ms` }}>
                    <span className="diff-line-prefix mod">~</span>
                    <span className="diff-line-key">{item.key}:</span>
                    <span className="diff-line-old-value">{item.oldValue}</span>
                    <span className="diff-line-new-value">→ {item.newValue}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
