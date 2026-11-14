import { SCENARIOS } from '../data/crewData.js';

// MissionControl — demo drawer, closed by default.
// Scenario buttons rewrite crewData; every screen reacts instantly.
export default function MissionControl({ open, onToggle, scenario, onScenario, onReset }) {
  return (
    <>
      <button className="mc-fab" onClick={onToggle} aria-expanded={open} aria-label="Mission control demo panel">
        Mission control
      </button>
      {open && (
        <aside className="mc-drawer panel" role="dialog" aria-label="Mission control demo controls">
          <div className="mc-head">
            <h3>Mission control</h3>
            <button className="panel-close" onClick={onToggle} aria-label="Close">×</button>
          </div>
          <p className="lede">Demo scenarios — each one rewrites the simulated band data. Watch the body figure, charts, score and alerts react.</p>
          <div className="mc-scenarios">
            {Object.entries(SCENARIOS).map(([key, s]) => (
              <button key={key}
                className={`btn ${scenario === key ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => onScenario(key)}>
                {s.label}
              </button>
            ))}
          </div>
          <button className="btn btn-ghost" onClick={onReset}>Reset</button>
          <p className="fine-print">Band readings and radiation are simulated. The rules, screens, emergency steps and charts are real working logic.</p>
        </aside>
      )}
    </>
  );
}
