// ─────────────────────────────────────────────────────────────────────────────
// OrbitBand rules engine.
// DATA -> RULES -> SCREENS -> ACTIONS AND ALERTS
//
// getStatus() is the single source of truth for every colour on every screen.
// It takes an indicator key and a numeric value and returns "green" | "yellow"
// | "red". Ranges below are DEMO values only — not medical advice.
// ─────────────────────────────────────────────────────────────────────────────

export const STATUS_META = {
  green:  { label: 'OK',       color: '#3ddc84', text: 'Within expected range' },
  yellow: { label: 'Watch',    color: '#f5c542', text: 'Worth keeping an eye on' },
  red:    { label: 'Concern',  color: '#ff5d5d', text: 'Possible concern — follow the steps' }
};

// Worst-of helper: red > yellow > green
const RANK = { green: 0, yellow: 1, red: 2 };
export function worstStatus(...statuses) {
  return statuses.reduce((worst, s) => (RANK[s] > RANK[worst] ? s : worst), 'green');
}

// Demo ranges. Boundary values are inclusive on the green side.
export function getStatus(indicator, value) {
  if (value == null || Number.isNaN(value)) return 'yellow';
  switch (indicator) {
    case 'heartRate':        // bpm
      if (value >= 60 && value <= 100) return 'green';
      if ((value >= 50 && value < 60) || (value > 100 && value <= 120)) return 'yellow';
      return 'red';
    case 'spo2':              // %
      if (value >= 95) return 'green';
      if (value >= 90) return 'yellow';
      return 'red';
    case 'temperature':       // °C
      if (value >= 36.1 && value <= 37.2) return 'green';
      if ((value > 37.2 && value <= 38.0) || (value >= 35.5 && value < 36.1)) return 'yellow';
      return 'red';
    case 'sleep':             // hours
      if (value >= 7) return 'green';
      if (value >= 5) return 'yellow';
      return 'red';
    case 'bloodSugar':        // mg/dL
      if (value >= 70 && value <= 99) return 'green';
      if ((value > 99 && value <= 125) || value === 69) return 'yellow';
      return 'red';
    case 'systolic':          // mmHg — demo band
      if (value >= 90 && value <= 120) return 'green';
      if ((value >= 80 && value < 90) || (value > 120 && value <= 140)) return 'yellow';
      return 'red';
    case 'diastolic':         // mmHg — demo band
      if (value >= 60 && value <= 80) return 'green';
      if ((value >= 50 && value < 60) || (value > 80 && value <= 90)) return 'yellow';
      return 'red';
    case 'radiation':         // cumulative mSv vs career limit handled separately
      return 'green'; // dose itself is cumulative; charts handle thresholds
    case 'workout':           // minutes today
      if (value >= 30) return 'green';
      if (value >= 15) return 'yellow';
      return 'red';
    default:
      return 'yellow';
  }
}

// Body-area rollup. Each area = worst colour of its indicators.
// heart: heartRate + blood pressure · bones: workout · brain: sleep (+mood)
// immune: temperature + radiation exposure flag
export function areaStatus(data) {
  const t = data.today;
  const bp = t.bloodPressure || { systolic: 118, diastolic: 76 };
  return {
    heart:  worstStatus(getStatus('heartRate', t.heartRate), getStatus('systolic', bp.systolic), getStatus('diastolic', bp.diastolic)),
    bones:  getStatus('workout', t.workoutMinutes),
    brain:  getStatus('sleep', t.sleepHours),
    immune: worstStatus(getStatus('temperature', t.temperature), t.radiationAlert ? 'red' : 'green')
  };
}

// Personal baseline drift: compare today vs the astronaut's own 14-day average.
// Flags drift even when the absolute value is still green.
export function driftNotes(data) {
  const notes = [];
  const avg = data.baseline || {};
  const t = data.today;
  const pct = (a, b) => (b === 0 ? 0 : Math.round(((a - b) / b) * 100));

  if (avg.heartRate && t.heartRate) {
    const d = pct(t.heartRate, avg.heartRate);
    if (Math.abs(d) >= 10) notes.push({ indicator: 'Resting heart rate', drift: d, text: `is ${Math.abs(d)}% ${d > 0 ? 'above' : 'below'} your normal` });
  }
  if (avg.sleepHours && t.sleepHours) {
    const d = pct(t.sleepHours, avg.sleepHours);
    if (Math.abs(d) >= 15) notes.push({ indicator: 'Sleep', drift: d, text: `is ${Math.abs(d)}% ${d > 0 ? 'above' : 'below'} your normal` });
  }
  if (avg.temperature && t.temperature) {
    const diff = +(t.temperature - avg.temperature).toFixed(1);
    if (Math.abs(diff) >= 0.4) notes.push({ indicator: 'Body temperature', drift: diff, text: `is ${diff > 0 ? '+' : ''}${diff}°C from your normal` });
  }
  if (avg.workoutMinutes && t.workoutMinutes != null) {
    const d = pct(t.workoutMinutes, avg.workoutMinutes);
    if (d <= -30) notes.push({ indicator: 'Workout time', drift: d, text: `is ${Math.abs(d)}% below your normal` });
  }
  return notes;
}

// Crew readiness score — deliberately simple and EXPLAINABLE.
// Start at 100, subtract fixed weights per non-green indicator.
// Returns { score, reasons[] } so the UI can show what moved it.
const PENALTIES = {
  heartRate: { yellow: 4, red: 12 },
  systolic:  { yellow: 4, red: 12 },
  diastolic: { yellow: 3, red: 10 },
  spo2:      { yellow: 8, red: 20 },
  temperature:{ yellow: 6, red: 15 },
  sleep:     { yellow: 5, red: 12 },
  bloodSugar:{ yellow: 5, red: 12 },
  workout:   { yellow: 4, red: 8 },
  radiation: { yellow: 0, red: 10 } // red only when radiationAlert flag set
};

export function readiness(data) {
  const t = data.today;
  const bp = t.bloodPressure || { systolic: 118, diastolic: 76 };
  const checks = [
    ['heartRate', t.heartRate], ['systolic', bp.systolic], ['diastolic', bp.diastolic],
    ['spo2', t.spo2], ['temperature', t.temperature], ['sleep', t.sleepHours],
    ['bloodSugar', t.bloodSugar ?? null], ['workout', t.workoutMinutes]
  ];
  let score = 100;
  const reasons = [];
  for (const [key, value] of checks) {
    if (value == null) continue;
    const s = getStatus(key, value);
    if (s !== 'green') {
      const p = PENALTIES[key][s];
      score -= p;
      reasons.push({ indicator: key, status: s, points: -p });
    }
  }
  if (t.radiationAlert) { score -= PENALTIES.radiation.red; reasons.push({ indicator: 'radiation', status: 'red', points: -10 }); }
  // Baseline drift adds a small penalty so the score reflects personal change too.
  for (const n of driftNotes(data)) {
    score -= 3;
    reasons.push({ indicator: n.indicator.toLowerCase(), status: 'yellow', points: -3, drift: true });
  }
  score = Math.max(0, Math.min(100, score));
  return { score, reasons };
}
