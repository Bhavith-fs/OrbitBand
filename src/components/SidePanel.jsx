import { getStatus, STATUS_META } from '../lib/status.js';

// SidePanel — shown when a body zone is clicked.
// What the system does · current status · plain-language explanation · one action.
export default function SidePanel({ zone, data, onClose }) {
  if (!zone) return null;
  const t = data.today;
  const bp = t.bloodPressure || { systolic: 118, diastolic: 76 };

  const readings = {
    heart: [
      ['Heart rate', `${t.heartRate} bpm`, getStatus('heartRate', t.heartRate)],
      ['Blood pressure', `${bp.systolic}/${bp.diastolic}`, worstOf(getStatus('systolic', bp.systolic), getStatus('diastolic', bp.diastolic))]
    ],
    bones: [['Workout today', `${t.workoutMinutes} min`, getStatus('workout', t.workoutMinutes)]],
    brain: [['Sleep last night', `${t.sleepHours} h`, getStatus('sleep', t.sleepHours)]],
    immune: [
      ['Body temperature', `${t.temperature} °C`, getStatus('temperature', t.temperature)],
      ['Radiation', t.radiationAlert ? 'Elevated today' : 'Normal', t.radiationAlert ? 'red' : 'green']
    ]
  }[zone];

  const worst = readings.reduce((w, r) => (STATUS_META[r[2]].color && rank(r[2]) > rank(w) ? r[2] : w), 'green');
  const meta = STATUS_META[worst];

  return (
    <aside className="side-panel" role="dialog" aria-label={`${zone} details`}>
      <button className="panel-close" onClick={onClose} aria-label="Close panel">×</button>
      <h3>{zoneName(zone)}</h3>
      <p className="panel-status">
        <span className="status-dot" style={{ background: meta.color }} />
        {meta.label} — {meta.text}
      </p>
      <ul className="panel-readings">
        {readings.map(([label, value, s]) => (
          <li key={label}>
            <span>{label}</span>
            <strong style={{ color: STATUS_META[s].color }}>{value}</strong>
            <em>{STATUS_META[s].label}</em>
          </li>
        ))}
      </ul>
      <p className="panel-explain">{zoneExplain(zone)}</p>
      <p className="panel-hazard"><strong>Space hazard:</strong> {zoneHazard(zone)}</p>
      <p className="panel-action"><strong>Suggested action:</strong> {zoneAction(zone)}</p>
    </aside>
  );
}

function rank(s) { return { green: 0, yellow: 1, red: 2 }[s]; }
function worstOf(a, b) { return rank(a) >= rank(b) ? a : b; }
function zoneName(z) { return { heart: 'Heart', bones: 'Bones & Muscle', brain: 'Brain', immune: 'Immune System' }[z]; }
function zoneExplain(z) {
  return {
    heart: 'Your heart and blood pressure are the earliest signals that something has changed — radiation, poor sleep and cabin air all show up here first.',
    bones: 'In microgravity your bones and muscles get almost no loading. Daily resistance exercise is what keeps them strong for the trip home.',
    brain: 'Sleep and mood are harder to protect far from Earth. Short sleep stretches make everything else — focus, mood, immunity — a little worse.',
    immune: 'Fever, temperature and radiation exposure surface here first. A small sustained rise is worth a closer look before it becomes a problem.'
  }[z];
}
function zoneHazard(z) {
  return {
    heart: 'Radiation and altered gravity both add load to the cardiovascular system.',
    bones: 'Altered gravity — the biggest long-term threat on a Mars mission.',
    brain: 'Isolation and the closed environment: no natural light, no fresh air, no quiet.',
    immune: 'Space radiation and shared cabin air.'
  }[z];
}
function zoneAction(z) {
  return {
    heart: 'Rest, hydrate, and flag it at the next scheduled check-in if it stays off.',
    bones: 'Fit in a resistance session today — even 15 minutes helps.',
    brain: 'Protect tonight\'s sleep and talk to a crewmate.',
    immune: 'Check cabin air and hygiene, then re-measure in an hour.'
  }[z];
}
