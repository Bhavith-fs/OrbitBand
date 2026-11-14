import { useState } from 'react';
import BodyFigure from './BodyFigure.jsx';
import SidePanel from './SidePanel.jsx';
import { readiness, driftNotes } from '../lib/status.js';

// BodyScreen — the body figure, readiness score, and personal baseline drift.
export default function BodyScreen({ data }) {
  const [selected, setSelected] = useState(null);
  const r = readiness(data);
  const drifts = driftNotes(data);

  return (
    <section className="screen body-screen">
      <header className="screen-head">
        <h2>Your body, tonight</h2>
        <p className="lede">Tap a zone to see what it means. Colours come from your band readings — green is fine, yellow is worth watching, red means follow the steps.</p>
      </header>

      <div className="body-layout">
        <div className="body-figure-wrap panel">
          <BodyFigure data={data} selected={selected} onSelect={setSelected} />
        </div>
        <div className="body-side">
          {selected
            ? <SidePanel zone={selected} data={data} onClose={() => setSelected(null)} />
            : <ReadinessCard score={r.score} reasons={r.reasons} drifts={drifts} />}
        </div>
      </div>

      {drifts.length > 0 && (
        <div className="drift-notes panel">
          <h3>Compared with your own normal</h3>
          <p className="lede">These are changes from your 14-day baseline — worth noting even when the number itself is still in range.</p>
          <ul>
            {drifts.map((d, i) => (
              <li key={i}><strong>{d.indicator}</strong> {d.text}.</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function ReadinessCard({ score, reasons, drifts }) {
  const tone = score >= 85 ? 'good' : score >= 65 ? 'fair' : 'low';
  return (
    <div className="panel readiness-card">
      <h3>Crew readiness</h3>
      <div className={`readiness-score tone-${tone}`}>
        <span className="score-num">{score}</span>
        <span className="score-label">/ 100</span>
      </div>
      <p className="lede">A simple score built from today's readings. It starts at 100 and loses points for anything outside the green band.</p>
      {reasons.length === 0 && drifts.length === 0
        ? <p className="reasons-empty">Nothing is pulling it down right now.</p>
        : <ul className="reasons">
            {reasons.map((r, i) => (
              <li key={i}>
                <span>{r.drift ? 'Baseline drift' : r.indicator}</span>
                <strong>{r.points} pts</strong>
              </li>
            ))}
          </ul>}
      <p className="fine-print">Demo scoring only — not a medical assessment.</p>
    </div>
  );
}
