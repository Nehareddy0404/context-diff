import { useState, useMemo, useCallback } from 'react';
import { CATEGORY_LABELS, branches as allBranches } from '../data/sampleData';
import { searchHistory, formatTime } from '../utils/diffEngine';

const SUGGESTIONS = [
  'Pacific',
  'TTFT',
  'React',
  'half marathon',
  'context',
  'Priya',
  'embeddings',
  'startup',
  'dark mode',
  'caching',
];

export default function SearchPanel({ snapshots }) {
  const [query, setQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchHistory(query, snapshots, branchFilter);
  }, [query, snapshots, branchFilter]);

  const highlightMatch = useCallback((text, q) => {
    if (!q.trim()) return text;
    const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="search-result-match">{part}</span>
      ) : (
        part
      )
    );
  }, []);

  const branchColor = (branchId) => {
    const branch = allBranches.find(b => b.id === branchId);
    return branch?.color || '#6C63FF';
  };

  const branchLabel = (branchId) => {
    const branch = allBranches.find(b => b.id === branchId);
    return branch?.label || branchId;
  };

  return (
    <div className="search-panel view-enter">
      {/* Search Input */}
      <div className="search-header">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            type="text"
            placeholder="Search across all context history... (e.g., 'When did I start using Vite?')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>

        {/* Filters */}
        <div className="search-filters">
          <button
            className={`search-filter-chip ${branchFilter === null ? 'active' : ''}`}
            onClick={() => setBranchFilter(null)}
          >
            All branches
          </button>
          {allBranches.map(branch => (
            <button
              key={branch.id}
              className={`search-filter-chip ${branchFilter === branch.id ? 'active' : ''}`}
              onClick={() => setBranchFilter(branchFilter === branch.id ? null : branch.id)}
              style={{
                borderColor: branchFilter === branch.id ? branch.color : undefined,
                color: branchFilter === branch.id ? branch.color : undefined,
                background: branchFilter === branch.id ? branch.color + '15' : undefined,
              }}
            >
              {branch.icon} {branch.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {query.trim() ? (
        <>
          <div className="search-results-count">
            {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
            {branchFilter && ` on ${branchLabel(branchFilter)}`}
          </div>
          <div className="search-results">
            {results.map((result, index) => (
              <div 
                key={`${result.snapshotId}-${result.category}-${result.key}-${index}`} 
                className="search-result-item"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="search-result-header">
                  <span className="search-result-branch" style={{ color: branchColor(result.branch) }}>
                    <span style={{ 
                      width: 6, height: 6, borderRadius: '50%',
                      background: branchColor(result.branch), display: 'inline-block',
                    }} />
                    {branchLabel(result.branch)}
                  </span>
                  <span className="search-result-time">
                    {formatTime(result.timestamp)}
                  </span>
                </div>
                <div className="search-result-content">
                  <span className="badge badge-neutral" style={{ marginRight: 8, fontSize: 10 }}>
                    {CATEGORY_LABELS[result.category] || result.category}
                  </span>
                  <span className="search-result-key">
                    {highlightMatch(result.key, query)}
                  </span>
                  {': '}
                  <span className="search-result-value">
                    {highlightMatch(result.value, query)}
                  </span>
                </div>
                <div className="search-result-snapshot">
                  💬 "{result.message}" — {result.snapshotId.replace('snap-', '')}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="search-empty">
          <div className="icon">🔎</div>
          <h3>Search Your Context History</h3>
          <p>
            Find when a preference changed, track how your goals evolved, 
            or discover when you first mentioned a topic.
          </p>
          <div className="search-suggestions">
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                className="search-suggestion"
                onClick={() => setQuery(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
