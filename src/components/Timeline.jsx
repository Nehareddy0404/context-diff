import { useMemo } from 'react';
import { branches as allBranches } from '../data/sampleData';
import { formatTime, getContextSize } from '../utils/diffEngine';

export default function Timeline({ snapshots, activeBranch, selectedA, selectedB, onSelectSnapshot }) {
  const branchColor = useMemo(() => {
    const branch = allBranches.find(b => b.id === activeBranch);
    return branch?.color || '#6C63FF';
  }, [activeBranch]);

  const branchSnapshots = useMemo(
    () => snapshots
      .filter(s => s.branch === activeBranch)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
    [snapshots, activeBranch]
  );

  const handleClick = (snapshotId) => {
    onSelectSnapshot(snapshotId);
  };

  return (
    <div className="view-enter">
      <div className="timeline-select-hint">
        💡 Click snapshots to select them for diffing. 
        <span className="key">1st click</span> = base, 
        <span className="key">2nd click</span> = compare
      </div>

      <div className="timeline">
        {branchSnapshots.map((snapshot, index) => {
          const isSelectedA = snapshot.id === selectedA;
          const isSelectedB = snapshot.id === selectedB;
          const contextSize = getContextSize(snapshot);
          
          return (
            <div key={snapshot.id} className="timeline-item">
              <div 
                className={`timeline-node ${isSelectedA || isSelectedB ? 'selected' : ''}`}
                style={{ 
                  borderColor: isSelectedA ? '#FF6B9D' : isSelectedB ? '#00D4AA' : branchColor,
                  color: isSelectedA ? '#FF6B9D' : isSelectedB ? '#00D4AA' : branchColor,
                }}
                onClick={() => handleClick(snapshot.id)}
              >
                <div className="timeline-node-inner" />
              </div>
              <div 
                className={`timeline-card ${isSelectedA ? 'selected' : ''} ${isSelectedB ? 'selected-b' : ''}`}
                onClick={() => handleClick(snapshot.id)}
              >
                <div className="timeline-message">{snapshot.message}</div>
                <div className="timeline-meta">
                  <span className="timeline-meta-item">
                    📅 {formatTime(snapshot.timestamp)}
                  </span>
                  <span className="timeline-meta-item">
                    📦 {contextSize} entries
                  </span>
                  <span className="timeline-meta-item" style={{ fontFamily: 'var(--font-mono)', fontSize: 10 }}>
                    {snapshot.id.replace('snap-', '')}
                  </span>
                  {isSelectedA && (
                    <span className="badge" style={{ background: '#FF6B9D22', color: '#FF6B9D' }}>
                      base (A)
                    </span>
                  )}
                  {isSelectedB && (
                    <span className="badge" style={{ background: '#00D4AA22', color: '#00D4AA' }}>
                      compare (B)
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {branchSnapshots.length === 0 && (
        <div className="diff-empty-state">
          <div className="big-icon">📭</div>
          <h3>No snapshots on this branch</h3>
          <p>Switch to a branch with context snapshots to view the timeline.</p>
        </div>
      )}
    </div>
  );
}
