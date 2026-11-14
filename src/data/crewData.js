// ─────────────────────────────────────────────────────────────────────────────
// crewData — the single data file. In a real version the wrist band feeds this
// exact structure. Everything on every screen reads from here.
//
// Shape: { today: {...}, last7Days: [...], baseline: {...14-day averages} }
// ─────────────────────────────────────────────────────────────────────────────

function day(i, overrides = {}) {
  // i = days ago (0 = today). Deterministic-ish jitter so charts look alive.
  const base = {
    heartRate: 72 + Math.round(Math.sin(i * 1.7) * 4),
    spo2: 97 + Math.round(Math.sin(i * 0.9) * 1),
    temperature: +(36.7 + Math.sin(i * 1.3) * 0.15).toFixed(1),
    sleepHours: +(7.2 + Math.sin(i * 0.6) * 0.8).toFixed(1),
    radiationDose: +(12 + i * 0.4 + Math.sin(i) * 1.5).toFixed(1), // mSv cumulative-ish daily
    workoutMinutes: 45 + Math.round(Math.sin(i * 2.1) * 15),
    bloodSugar: 92 + Math.round(Math.sin(i * 1.1) * 8),
    mood: 'steady'
  };
  return { ...base, ...overrides };
}

export const SCENARIOS = {
  normal: {
    label: 'Normal day',
    today: { heartRate: 74, spo2: 98, temperature: 36.8, sleepHours: 7.6, radiationDose: 14.2, workoutMinutes: 50, bloodSugar: 95, mood: 'steady', radiationAlert: false, bloodPressure: { systolic: 118, diastolic: 76 } }
  },
  poorSleep: {
    label: 'Poor sleep week',
    today: { heartRate: 88, spo2: 96, temperature: 36.9, sleepHours: 4.6, radiationDose: 15.0, workoutMinutes: 18, bloodSugar: 108, mood: 'low', radiationAlert: false, bloodPressure: { systolic: 126, diastolic: 82 } },
    last7Days: [
      day(6, { sleepHours: 5.4, heartRate: 82 }), day(5, { sleepHours: 4.9, heartRate: 85 }),
      day(4, { sleepHours: 5.1, heartRate: 84 }), day(3, { sleepHours: 4.4, heartRate: 89 }),
      day(2, { sleepHours: 5.0, heartRate: 86 }), day(1, { sleepHours: 4.8, heartRate: 87 }),
      day(0, { sleepHours: 4.6, heartRate: 88 })
    ]
  },
  radiationStorm: {
    label: 'Radiation storm',
    today: { heartRate: 79, spo2: 97, temperature: 37.0, sleepHours: 7.0, radiationDose: 62.5, workoutMinutes: 40, bloodSugar: 99, mood: 'alert', radiationAlert: true, bloodPressure: { systolic: 122, diastolic: 79 } },
    last7Days: [
      day(6, { radiationDose: 14 }), day(5, { radiationDose: 15 }), day(4, { radiationDose: 16 }),
      day(3, { radiationDose: 18 }), day(2, { radiationDose: 24 }), day(1, { radiationDose: 41 }),
      day(0, { radiationDose: 62.5, radiationAlert: true })
    ]
  },
  cabinAir: {
    label: 'Cabin air problem',
    today: { heartRate: 96, spo2: 91, temperature: 37.8, sleepHours: 6.2, radiationDose: 15.5, workoutMinutes: 25, bloodSugar: 112, mood: 'irritated', radiationAlert: false, bloodPressure: { systolic: 132, diastolic: 86 } },
    last7Days: [
      day(6, { spo2: 97, temperature: 36.8 }), day(5, { spo2: 95, temperature: 37.0 }),
      day(4, { spo2: 93, temperature: 37.3 }), day(3, { spo2: 92, temperature: 37.5 }),
      day(2, { spo2: 91, temperature: 37.6 }), day(1, { spo2: 91, temperature: 37.7 }),
      day(0, { spo2: 91, temperature: 37.8, heartRate: 96 })
    ]
  }
};

export function buildCrewData(scenarioKey = 'normal') {
  const s = SCENARIOS[scenarioKey] || SCENARIOS.normal;
  const last7 = s.last7Days || [6, 5, 4, 3, 2, 1, 0].map(i => day(i));
  // Ensure today's entry in last7Days mirrors `today` for chart consistency.
  last7[6] = { ...last7[6], ...s.today };
  // 14-day baseline = average of last7Days plus a quiet synthetic first week.
  const firstWeek = [13, 12, 11, 10, 9, 8, 7].map(i => day(i));
  const all = [...firstWeek, ...last7];
  const avg = (k) => +(all.reduce((a, d) => a + (d[k] ?? 0), 0) / all.length).toFixed(1);
  const baseline = {
    heartRate: avg('heartRate'),
    spo2: avg('spo2'),
    temperature: avg('temperature'),
    sleepHours: avg('sleepHours'),
    workoutMinutes: avg('workoutMinutes'),
    radiationDose: avg('radiationDose')
  };
  return { today: { ...s.today }, last7Days: last7, baseline, scenario: scenarioKey };
}

// Career radiation limit for projection math (demo value, mSv).
export const RADIATION_CAREER_LIMIT = 600;
