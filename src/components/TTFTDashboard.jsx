import { useState, useEffect, useRef } from 'react';
import { ttftBenchmarks } from '../data/sampleData';

export default function TTFTDashboard() {
  const [animated, setAnimated] = useState(false);
  const [hoveredBar, setHoveredBar] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Trigger bar animations after mount
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const maxTTFT = Math.max(...ttftBenchmarks.map(b => b.ttft));
  const bestTTFT = Math.min(...ttftBenchmarks.map(b => b.ttft));
  const coldTTFT = ttftBenchmarks[0].ttft;
  const improvement = ((coldTTFT - bestTTFT) / coldTTFT * 100).toFixed(0);

  return (
    <div className="ttft-dashboard view-enter" ref={containerRef}>
      {/* Hero Card */}
      <div className="ttft-hero">
        <div className="ttft-hero-content">
          <div className="ttft-hero-label">Maximum TTFT Reduction</div>
          <div className="ttft-hero-value">{improvement}%</div>
          <div className="ttft-hero-sub">
            From {(coldTTFT / 1000).toFixed(1)}s cold start → {(bestTTFT / 1000).toFixed(1)}s with cached branched context
          </div>
          <div className="ttft-hero-improvement">
            ⚡ {((coldTTFT - bestTTFT) / 1000).toFixed(1)}s faster response
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="ttft-comparison-grid">
        <div className="ttft-comparison-card">
          <div className="ttft-comparison-label">Cold Start</div>
          <div className="ttft-comparison-value" style={{ color: '#FF4757' }}>
            {(coldTTFT / 1000).toFixed(1)}s
          </div>
          <div className="ttft-comparison-sub">No personal context loaded</div>
        </div>
        <div className="ttft-comparison-card">
          <div className="ttft-comparison-label">With Context Diff</div>
          <div className="ttft-comparison-value" style={{ color: '#2ED573' }}>
            {(bestTTFT / 1000).toFixed(1)}s
          </div>
          <div className="ttft-comparison-sub">Cached + branched context</div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <span className="icon">📊</span>
            TTFT by Context Strategy
          </div>
        </div>
        <div className="ttft-bars">
          {ttftBenchmarks.map((benchmark, index) => (
            <div 
              key={index} 
              className="ttft-bar-item"
              onMouseEnter={() => setHoveredBar(index)}
              onMouseLeave={() => setHoveredBar(null)}
              style={{
                borderColor: hoveredBar === index ? benchmark.color + '66' : undefined,
              }}
            >
              <div className="ttft-bar-label">{benchmark.label}</div>
              <div className="ttft-bar-wrapper">
                <div
                  className="ttft-bar-fill"
                  style={{
                    width: animated ? `${(benchmark.ttft / maxTTFT) * 100}%` : '0%',
                    background: `linear-gradient(90deg, ${benchmark.color}CC, ${benchmark.color})`,
                    transitionDelay: `${index * 100}ms`,
                  }}
                >
                  {benchmark.ttft > 1000 && (
                    <span style={{ position: 'relative', zIndex: 1 }}>
                      {(benchmark.ttft / 1000).toFixed(1)}s
                    </span>
                  )}
                </div>
              </div>
              <div className="ttft-bar-value" style={{ color: benchmark.color }}>
                {benchmark.ttft}ms
              </div>
            </div>
          ))}
        </div>
        {hoveredBar !== null && (
          <div style={{ 
            marginTop: 12, 
            padding: '10px 16px', 
            background: 'var(--bg-deep)', 
            borderRadius: 'var(--radius-md)',
            fontSize: 12,
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            animation: 'fadeSlideIn 200ms ease both',
          }}>
            <span style={{ 
              width: 8, height: 8, borderRadius: '50%', 
              background: ttftBenchmarks[hoveredBar].color, flexShrink: 0 
            }} />
            {ttftBenchmarks[hoveredBar].description}
          </div>
        )}
      </div>

      {/* Explanation */}
      <div className="ttft-explanation">
        <h3>💡 Why Context Diff Reduces TTFT</h3>
        <p>
          <strong>Time to First Token (TTFT)</strong> measures how quickly an AI responds to your first message. 
          Without personal context, the AI starts cold — it doesn't know who you are, what you're working on, 
          or how you prefer to communicate.
        </p>
        <p>
          With <strong>Context Diff</strong>, your personal context is versioned and pre-loaded. The AI already knows:
        </p>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: 8, 
          margin: '12px 0',
        }}>
          {[
            { emoji: '⚙️', text: 'Your preferences & style' },
            { emoji: '🚀', text: 'Active projects & status' },
            { emoji: '🎯', text: 'Current goals & priorities' },
            { emoji: '🛠️', text: 'Your tech stack & tools' },
            { emoji: '💬', text: 'Communication preferences' },
            { emoji: '👥', text: 'Key people & relationships' },
          ].map(item => (
            <div key={item.text} style={{ 
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 12px', background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-sm)', fontSize: 12,
            }}>
              <span>{item.emoji}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
        <p>
          <strong>Branching</strong> further improves TTFT by loading only the relevant context for your current role. 
          Your <code>work</code> branch loads work context, your <code>startup</code> branch loads startup context — 
          no wasted tokens on irrelevant information.
        </p>
        <p>
          <strong>Caching</strong> eliminates re-processing by keeping your most recent context snapshot in a 
          ready-to-load format. Combined with branching, this achieves near-instant personalization.
        </p>
      </div>
    </div>
  );
}
