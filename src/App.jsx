import { useState, useMemo, useCallback, useEffect } from 'react';
import { branches, snapshots } from './data/sampleData';
import { getContextSize, estimateTokens } from './utils/diffEngine';
import Timeline from './components/Timeline';
import DiffView from './components/DiffView';
import BranchManager from './components/BranchManager';
import ContextEditor from './components/ContextEditor';
import TTFTDashboard from './components/TTFTDashboard';
import SearchPanel from './components/SearchPanel';
import './index.css';

const VIEWS = {
  TIMELINE: 'timeline',
  DIFF: 'diff',
  BRANCHES: 'branches',
  CONTEXT: 'context',
  TTFT: 'ttft',
  SEARCH: 'search',
};

const NAV_ITEMS = [
  { id: VIEWS.TIMELINE, icon: '📜', label: 'Timeline', description: 'Commit-log history' },
  { id: VIEWS.DIFF, icon: '📊', label: 'Diff View', description: 'Compare snapshots' },
  { id: VIEWS.BRANCHES, icon: '🌿', label: 'Branches', description: 'Branch manager' },
  { id: VIEWS.CONTEXT, icon: '📋', label: 'Context', description: 'Current state' },
  { id: VIEWS.TTFT, icon: '⚡', label: 'TTFT', description: 'Performance' },
  { id: VIEWS.SEARCH, icon: '🔍', label: 'Search', description: 'Find in history' },
];

const VIEW_TITLES = {
  [VIEWS.TIMELINE]: { icon: '📜', text: 'Timeline' },
  [VIEWS.DIFF]: { icon: '📊', text: 'Diff View' },
  [VIEWS.BRANCHES]: { icon: '🌿', text: 'Branches' },
  [VIEWS.CONTEXT]: { icon: '📋', text: 'Current Context' },
  [VIEWS.TTFT]: { icon: '⚡', text: 'TTFT Dashboard' },
  [VIEWS.SEARCH]: { icon: '🔍', text: 'Search History' },
};

export default function App() {
  const [activeView, setActiveView] = useState(VIEWS.TIMELINE);
  const [activeBranch, setActiveBranch] = useState('main');
  const [selectedA, setSelectedA] = useState(null);
  const [selectedB, setSelectedB] = useState(null);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('context-diff-theme') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('context-diff-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(t => t === 'dark' ? 'light' : 'dark');
  }, []);

  const activeBranchData = useMemo(
    () => branches.find(b => b.id === activeBranch),
    [activeBranch]
  );

  const latestSnapshot = useMemo(() => {
    const branchSnaps = snapshots
      .filter(s => s.branch === activeBranch)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return branchSnaps[0];
  }, [activeBranch]);

  const handleSelectSnapshot = useCallback((id) => {
    if (selectedA === id) {
      setSelectedA(null);
      return;
    }
    if (selectedB === id) {
      setSelectedB(null);
      return;
    }

    if (!selectedA) {
      setSelectedA(id);
    } else if (!selectedB) {
      setSelectedB(id);
      // Auto-switch to diff view when both are selected
      setActiveView(VIEWS.DIFF);
    } else {
      // Both selected, replace A and clear B
      setSelectedA(id);
      setSelectedB(null);
    }
  }, [selectedA, selectedB]);

  const handleSwitchBranch = useCallback((branchId) => {
    setActiveBranch(branchId);
    setSelectedA(null);
    setSelectedB(null);
  }, []);

  const renderView = () => {
    switch (activeView) {
      case VIEWS.TIMELINE:
        return (
          <Timeline
            snapshots={snapshots}
            activeBranch={activeBranch}
            selectedA={selectedA}
            selectedB={selectedB}
            onSelectSnapshot={handleSelectSnapshot}
          />
        );
      case VIEWS.DIFF:
        return (
          <DiffView
            snapshots={snapshots}
            selectedA={selectedA}
            selectedB={selectedB}
          />
        );
      case VIEWS.BRANCHES:
        return (
          <BranchManager
            branches={branches}
            snapshots={snapshots}
            activeBranch={activeBranch}
            onSwitchBranch={handleSwitchBranch}
          />
        );
      case VIEWS.CONTEXT:
        return (
          <ContextEditor
            snapshots={snapshots}
            activeBranch={activeBranch}
          />
        );
      case VIEWS.TTFT:
        return <TTFTDashboard />;
      case VIEWS.SEARCH:
        return <SearchPanel snapshots={snapshots} />;
      default:
        return null;
    }
  };

  const viewTitle = VIEW_TITLES[activeView];

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1>Context Diff</h1>
          <div className="subtitle">Git for AI Context</div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Views</div>
          {NAV_ITEMS.map(item => (
            <div
              key={item.id}
              className={`nav-item ${activeView === item.id ? 'active' : ''}`}
              onClick={() => setActiveView(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </div>
          ))}
        </nav>

        {/* Branch Selector */}
        <div className="sidebar-branch-section">
          <div className="nav-section-label">Branches</div>
          <div className="branch-selector-compact">
            {branches.map(branch => (
              <div
                key={branch.id}
                className={`branch-chip ${activeBranch === branch.id ? 'active' : ''}`}
                onClick={() => handleSwitchBranch(branch.id)}
              >
                <span className="branch-dot" style={{ background: branch.color }} />
                <span className="branch-chip-label">{branch.label}</span>
                <span className="branch-chip-icon">{branch.icon}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="content-header">
          <h2>
            <span>{viewTitle.icon}</span>
            {viewTitle.text}
            {activeView !== VIEWS.TTFT && activeView !== VIEWS.SEARCH && (
              <span style={{ 
                fontSize: 12, 
                fontWeight: 400, 
                color: activeBranchData?.color,
                marginLeft: 4,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: activeBranchData?.color,
                }} />
                {activeBranchData?.name}
              </span>
            )}
          </h2>
          <div className="header-actions">
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            {selectedA && selectedB && (
              <button 
                className="btn btn-sm"
                onClick={() => { setSelectedA(null); setSelectedB(null); }}
              >
                Clear Selection
              </button>
            )}
            {activeView === VIEWS.TIMELINE && selectedA && !selectedB && (
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                Select another snapshot to compare
              </span>
            )}
          </div>
        </header>

        <div className="content-body">
          {renderView()}
        </div>

        {/* Status Bar */}
        <div className="status-bar">
          <div className="status-bar-item">
            <div className="status-bar-dot" />
            Context Active
          </div>
          <div className="status-bar-item">
            🌿 {activeBranchData?.name}
          </div>
          {latestSnapshot && (
            <>
              <div className="status-bar-item">
                📦 {getContextSize(latestSnapshot)} entries
              </div>
              <div className="status-bar-item">
                🔤 ~{estimateTokens(latestSnapshot)} tokens
              </div>
            </>
          )}
          <div className="status-bar-item" style={{ marginLeft: 'auto' }}>
            {snapshots.length} total snapshots across {branches.length} branches
          </div>
        </div>
      </main>
    </div>
  );
}
