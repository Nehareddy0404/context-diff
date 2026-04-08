import { useState, useMemo } from 'react';
import { CATEGORY_LABELS, CATEGORY_ICONS, branches as allBranches } from '../data/sampleData';
import { 
  formatTimeFull, formatTimeShort, getContextSize, estimateTokens, computeBlame,
  getCategoryPermission, PERMISSION_LABELS, PERMISSION_ICONS, PERMISSION_LEVELS,
  DEFAULT_PERMISSIONS,
} from '../utils/diffEngine';

export default function ContextEditor({ snapshots, activeBranch }) {
  const [expandedCategories, setExpandedCategories] = useState(new Set(['preferences', 'active_projects', 'goals']));
  const [showBlame, setShowBlame] = useState(false);

  const latestSnapshot = useMemo(() => {
    const branchSnaps = snapshots
      .filter(s => s.branch === activeBranch)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return branchSnaps[0];
  }, [snapshots, activeBranch]);

  const branch = useMemo(
    () => allBranches.find(b => b.id === activeBranch),
    [activeBranch]
  );

  const blame = useMemo(
    () => computeBlame(snapshots, activeBranch),
    [snapshots, activeBranch]
  );

  const toggleCategory = (cat) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  if (!latestSnapshot) {
    return (
      <div className="diff-empty-state">
        <div className="big-icon">📭</div>
        <h3>No context on this branch</h3>
        <p>This branch has no snapshots yet.</p>
      </div>
    );
  }

  const categories = Object.entries(latestSnapshot.context || {});
  const totalEntries = getContextSize(latestSnapshot);
  const totalTokens = estimateTokens(latestSnapshot);

  return (
    <div className="context-editor view-enter">
      {/* Snapshot info */}
      <div className="context-snapshot-info">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: branch?.color }}>{branch?.icon}</span>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{branch?.label}</span>
        </div>
        <span>•</span>
        <span>Latest: <span className="snapshot-id">{latestSnapshot.id.replace('snap-', '')}</span></span>
        <span>•</span>
        <span>📦 {totalEntries} entries</span>
        <span>•</span>
        <span>🔤 ~{totalTokens} tokens</span>
        <span>•</span>
        <span>📅 {formatTimeFull(latestSnapshot.timestamp)}</span>
      </div>

      <div style={{ fontSize: 13, color: 'var(--text-secondary)', padding: '4px 0 8px', fontStyle: 'italic' }}>
        "{latestSnapshot.message}"
      </div>

      {/* Toggle bar: Blame + Legend */}
      <div className="context-toggle-bar">
        <button
          className={`btn btn-sm ${showBlame ? 'btn-primary' : ''}`}
          onClick={() => setShowBlame(!showBlame)}
        >
          🔍 {showBlame ? 'Hide' : 'Show'} Semantic Blame
        </button>
        <div className="permission-legend">
          {Object.entries(PERMISSION_LEVELS).map(([, level]) => (
            <span key={level} className={`permission-tag permission-${level}`}>
              {PERMISSION_ICONS[level]} {PERMISSION_LABELS[level]}
            </span>
          ))}
        </div>
      </div>

      {/* Categories */}
      {categories.map(([category, entries], idx) => {
        const isExpanded = expandedCategories.has(category);
        const entryList = Object.entries(entries);
        const permission = getCategoryPermission(category, activeBranch, allBranches);
        const defaultPerm = DEFAULT_PERMISSIONS[category] || PERMISSION_LEVELS.PUBLIC;
        
        return (
          <div 
            key={category} 
            className="context-category-section"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className="context-category-title" onClick={() => toggleCategory(category)}>
              <span className="icon">{CATEGORY_ICONS[category] || '📁'}</span>
              <span>{CATEGORY_LABELS[category] || category}</span>
              <span className={`permission-tag permission-${branch?.parentBranch ? permission : defaultPerm}`}>
                {PERMISSION_ICONS[branch?.parentBranch ? permission : defaultPerm]}{' '}
                {PERMISSION_LABELS[branch?.parentBranch ? permission : defaultPerm]}
              </span>
              <span className="count">{entryList.length} entries</span>
              <span className={`chevron ${isExpanded ? 'open' : ''}`}>▸</span>
            </div>
            {isExpanded && (
              <div className="context-entries">
                {entryList.map(([key, value]) => {
                  const blameEntry = blame[category]?.[key];
                  return (
                    <div key={key} className="context-entry">
                      <span className="context-entry-key">{key}</span>
                      <div className="context-entry-content">
                        <span className="context-entry-value">{value}</span>
                        {showBlame && blameEntry && (
                          <div className="blame-info">
                            <span className={`blame-change-type blame-${blameEntry.changeType}`}>
                              {blameEntry.changeType === 'initial' ? '○' :
                               blameEntry.changeType === 'added' ? '+' :
                               blameEntry.changeType === 'modified' ? '~' : '−'}
                            </span>
                            <span className="blame-snapshot">
                              {blameEntry.changedIn.replace('snap-', '')}
                            </span>
                            <span className="blame-time">
                              {formatTimeShort(blameEntry.changedAt)}
                            </span>
                            <span className="blame-author">
                              via {blameEntry.author}
                            </span>
                            {blameEntry.previousValue && (
                              <span className="blame-previous">
                                was: "{blameEntry.previousValue}"
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
