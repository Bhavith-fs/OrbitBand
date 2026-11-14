import { useState } from 'react';
import { getStatus, STATUS_META } from '../lib/status.js';

// MeasurementGuide — how/why/what-to-do for each indicator, plus a live
// "type a value, see its colour" tester that uses the same getStatus() rules.

const GUIDE = [
  {
    key: 'heartRate', label: 'Heart rate', unit: 'bpm', placeholder: 'e.g. 88',
    how: 'Rest for five minutes, then count your pulse at your wrist for 30 seconds and double it. The band does this automatically.',
    why: 'Heart rate rises with poor sleep, fever, cabin air problems and stress. It is often the first sign that something has changed.',
    abnormal: 'If it stays high at rest, sit down, breathe slowly for a few minutes, and re-check. If it stays outside the green band, tell the flight surgeon.',
    bands: 'Green 60–100 · Yellow 50–59 or 101–120 · Red below 50 or above 120'
  },
  {
    key: 'bloodPressure', label: 'Blood pressure', unit: 'mmHg', placeholder: 'e.g. 132/86',
    how: 'Sit quietly for five minutes, cuff on bare skin at heart level. Enter as systolic/diastolic, e.g. 118/76.',
    why: 'Blood pressure drifts in microgravity. A rising trend is an early warning for cardiovascular strain.',
    abnormal: 'Rest ten minutes and re-measure. If it stays high, avoid heavy exercise and flag it at check-in.',
    bands: 'Green ~90–120 / 60–80 · Yellow near the edges · Red well outside'
  },
  {
    key: 'bloodSugar', label: 'Blood sugar', unit: 'mg/dL', placeholder: 'e.g. 112',
    how: 'Finger-prick test with the glucometer in the medical locker, usually before meals.',
    why: 'Diet, stress and disrupted sleep all move blood sugar. Spaceflight can change how the body handles it.',
    abnormal: 'If low, eat a fast sugar (glucose tablets) and re-test in 15 minutes. If high, note what you ate and tell the flight surgeon.',
    bands: 'Green 70–99 · Yellow 100–125 · Red above 125 or below 70'
  },
  {
    key: 'temperature', label: 'Body temperature', unit: '°C', placeholder: 'e.g. 37.8',
    how: 'Temporal (forehead) thermometer, or the band\'s skin sensor. Take it at the same time each day.',
    why: 'A small sustained rise can be the earliest sign of infection or cabin air problems — before you feel ill.',
    abnormal: 'Re-measure in an hour. Check cabin air and hygiene. If it keeps climbing, follow the steps on the Immune zone.',
    bands: 'Green 36.1–37.2 · Yellow 37.3–38.0 · Red above 38.0 or below 35.5'
  },
  {
    key: 'sleep', label: 'Sleep hours', unit: 'h', placeholder: 'e.g. 5.5',
    how: 'Log hours from lights-out to waking. The band estimates this from movement and heart rate.',
    why: 'Sleep is the crew\'s main recovery tool. Short sleep compounds — mood, focus and immunity all drift down together.',
    abnormal: 'Protect the next sleep period. If short sleep repeats for days, talk to a crewmate or the flight surgeon.',
    bands: 'Green 7+ · Yellow 5–6.9 · Red below 5'
  },
  {
    key: 'spo2', label: 'Blood oxygen', unit: '%', placeholder: 'e.g. 91',
    how: 'Clip-on pulse oximeter on a fingertip, or the band\'s optical sensor. Keep the hand still for 30 seconds.',
    why: 'Oxygen saturation drops fast if cabin air has a problem — it is your direct window into the air you breathe.',
    abnormal: 'Move to fresher air if available, loosen tight clothing, and re-check. Below 90 is a real concern — follow emergency steps if you feel unwell.',
    bands: 'Green 95+ · Yellow 90–94 · Red below 90'
  }
];

export default function MeasurementGuide() {
  const [test, setTest] = useState({ key: 'heartRate', value: '' });

  function parseTest() {
    const raw = test.value.trim();
    if (!raw) return null;
    if (test.key === 'bloodPressure') {
      const m = raw.match(/(\d+)\s*\/\s*(\d+)/);
      if (!m) return { error: 'Enter as systolic/diastolic, e.g. 118/76' };
      return { systolic: +m[1], diastolic: +m[2] };
    }
    const n = parseFloat(raw);
    return Number.isNaN(n) ? { error: 'Enter a number' } : { value: n };
  }

  const parsed = parseTest();
  let testStatus = null, testAdvice = '';
  if (parsed && !parsed.error) {
    if (test.key === 'bloodPressure') {
      const s = getStatus('systolic', parsed.systolic);
      const d = getStatus('diastolic', parsed.diastolic);
      testStatus = s === 'red' || d === 'red' ? 'red' : s === 'yellow' || d === 'yellow' ? 'yellow' : 'green';
    } else {
      testStatus = getStatus(test.key, parsed.value);
    }
    testAdvice = {
      green: 'This reads as OK. Keep doing what you\'re doing.',
      yellow: 'This is worth watching. Rest, hydrate, and re-check in a few hours.',
      red: 'Possible concern — follow the steps for this indicator and tell the flight surgeon.'
    }[testStatus];
  }

  return (
    <section className="screen">
      <header className="screen-head">
        <h2>Measurement guide</h2>
        <p className="lede">How to take each reading, why it matters out here, and what to do if it looks off. Ranges are demo values — not medical advice.</p>
      </header>

      <div className="guide-list">
        {GUIDE.map(g => (
          <article key={g.key} className="panel guide-item">
            <h3>{g.label} <span className="unit">({g.unit})</span></h3>
            <dl>
              <dt>How</dt><dd>{g.how}</dd>
              <dt>Why it matters</dt><dd>{g.why}</dd>
              <dt>If abnormal</dt><dd>{g.abnormal}</dd>
              <dt>Ranges</dt><dd className="bands">{g.bands}</dd>
            </dl>
          </article>
        ))}
      </div>

      <div className="panel tester">
        <h3>Try a reading</h3>
        <p className="lede">Type a value and see its colour instantly — same rules the band uses.</p>
        <div className="tester-row">
          <label htmlFor="tester-key">Indicator</label>
          <select id="tester-key" value={test.key} onChange={e => setTest({ key: e.target.value, value: '' })}>
            {GUIDE.map(g => <option key={g.key} value={g.key}>{g.label}</option>)}
          </select>
          <label htmlFor="tester-val">Value</label>
          <input id="tester-val" inputMode="decimal" placeholder={GUIDE.find(g => g.key === test.key).placeholder}
                 value={test.value} onChange={e => setTest({ ...test, value: e.target.value })} />
        </div>
        {parsed?.error && <p className="tester-error">{parsed.error}</p>}
        {testStatus && (
          <p className="tester-result">
            <span className="status-dot" style={{ background: STATUS_META[testStatus].color }} />
            <strong style={{ color: STATUS_META[testStatus].color }}>{STATUS_META[testStatus].label}</strong>
            {' — '}{testAdvice}
          </p>
        )}
      </div>
    </section>
  );
}
