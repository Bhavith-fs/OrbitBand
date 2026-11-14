import { useEffect, useRef, useState } from 'react';
import { getStatus, STATUS_META } from '../lib/status.js';

// EmergencyMode — works instantly, independent of crewData and getStatus rules.
// One step per screen. Includes a 110 bpm Web Audio metronome + 2-minute
// rescuer-swap timer on the CPR step, optional speech, and a flight-surgeon
// summary generator with copy button.

const STEPS = [
  { title: 'Check responsiveness and breathing', body: 'Tap the person\'s shoulders and shout. Look at the chest — is it rising? If they respond and breathe normally, keep them comfortable and monitor. If there is no response or no normal breathing, go to the next step immediately.' },
  { title: 'Call for crew help', body: 'Shout "EMERGENCY" down the corridor or hit the crew alert. Send one person to fetch the medical kit and defibrillator. Do not leave the casualty alone.' },
  { title: 'Keep them calm and lying down', body: 'Help them lie flat on their back on a firm surface. Loosen tight clothing around the neck and chest. Reassure them — a calm patient uses less oxygen.' },
  { title: 'Check for a pulse', body: 'Feel for a pulse at the neck (carotid) for no more than 10 seconds. If you are unsure, treat it as no pulse and start CPR.' },
  { title: 'Start CPR', body: 'Push hard and fast in the centre of the chest — about 5–6 cm deep, at 100–120 compressions per minute. Use the metronome below to keep the beat. Give 30 compressions, then 2 rescue breaths if trained and it is safe to do so.', cpr: true },
  { title: 'Use the defibrillator if available', body: 'As soon as the AED/defibrillator arrives, power it on and follow its voice prompts. It will only shock if a shockable rhythm is detected. Resume CPR immediately after any shock.' },
  { title: 'Monitor vitals', body: 'Once help arrives, keep checking responsiveness, breathing and pulse every few minutes. Note the time symptoms started — the flight surgeon will ask.' }
];

const FIXED_NOTE = 'Earth contact may be delayed up to about 20 minutes each way near Mars. Follow these steps first, then message the flight surgeon on Earth.';

export default function EmergencyMode({ data, onExit }) {
  const [step, setStep] = useState(0);
  const [muted, setMuted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [swapLeft, setSwapLeft] = useState(120);
  const audioRef = useRef(null);
  const swapTimer = useRef(null);
  const current = STEPS[step];

  // Speech synthesis per step
  useEffect(() => {
    if (!muted && 'speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(`${current.title}. ${current.body}`);
      u.rate = 0.95;
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    }
    return () => { if ('speechSynthesis' in window) speechSynthesis.cancel(); };
  }, [step, muted, current]);

  // 2-minute rescuer-swap timer on the CPR step
  useEffect(() => {
    if (current.cpr) {
      setSwapLeft(120);
      swapTimer.current = setInterval(() => setSwapLeft(s => (s > 0 ? s - 1 : 0)), 1000);
      return () => clearInterval(swapTimer.current);
    }
  }, [current.cpr]);

  // 110 bpm metronome via Web Audio — only runs while CPR step is active
  useEffect(() => {
    if (!current.cpr || muted) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctx = new Ctx();
    audioRef.current = ctx;
    let beat = 0;
    const interval = setInterval(() => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = beat % 2 === 0 ? 880 : 660; // accent every other beat
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain).connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.13);
      beat++;
    }, 60000 / 110);
    return () => { clearInterval(interval); ctx.close(); };
  }, [current.cpr, muted]);

  function surgeonSummary() {
    const t = data?.today || {};
    const bp = t.bloodPressure || {};
    const lines = [
      'ORBITBAND — EMERGENCY SUMMARY (demo)',
      `Time: ${new Date().toISOString()}`,
      'Scenario: crewmate collapsed with chest pain',
      `Latest vitals — HR ${t.heartRate ?? '—'} bpm · SpO2 ${t.spo2 ?? '—'}% · Temp ${t.temperature ?? '—'}°C · BP ${bp.systolic ?? '—'}/${bp.diastolic ?? '—'} · Sleep ${t.sleepHours ?? '—'}h`,
      `Steps completed: ${step + 1} of ${STEPS.length} — through "${current.title}"`,
      'Note: Earth delay up to ~20 min each way near Mars. Steps followed first.'
    ];
    return lines.join('\n');
  }

  async function copySummary() {
    try { await navigator.clipboard.writeText(surgeonSummary()); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { setCopied(false); }
  }

  const mm = String(Math.floor(swapLeft / 60)).padStart(2, '0');
  const ss = String(swapLeft % 60).padStart(2, '0');

  return (
    <div className="emergency-overlay" role="alertdialog" aria-label="Emergency mode">
      <div className="emergency-card panel">
        <div className="emergency-head">
          <span className="emergency-badge">EMERGENCY</span>
          <button className="btn btn-ghost" onClick={() => setMuted(m => !m)}>{muted ? 'Voice off' : 'Voice on'}</button>
          <button className="btn btn-ghost" onClick={onExit}>Exit</button>
        </div>
        <p className="emergency-note">{FIXED_NOTE}</p>

        <div className="step-progress">Step {step + 1} of {STEPS.length}</div>
        <h2 className="step-title">{current.title}</h2>
        <p className="step-body">{current.body}</p>

        {current.cpr && (
          <div className="cpr-tools">
            <div className="metronome" aria-label="CPR metronome at 110 beats per minute">
              {[...Array(4)].map((_, i) => <span key={i} className="beat-dot" />)}
              <p>110 bpm — push on each beat</p>
            </div>
            <div className="swap-timer">
              <span className="swap-time">{mm}:{ss}</span>
              <span>until rescuer swap</span>
            </div>
          </div>
        )}

        <div className="step-nav">
          <button className="btn btn-primary btn-big" disabled={step === 0} onClick={() => setStep(s => s - 1)}>Back</button>
          {step < STEPS.length - 1
            ? <button className="btn btn-primary btn-big" onClick={() => setStep(s => s + 1)}>Next</button>
            : <button className="btn btn-primary btn-big" onClick={() => setStep(0)}>Restart steps</button>}
        </div>

        <div className="surgeon-box">
          <h3>Contact flight surgeon</h3>
          <p className="lede">Generates a ready-to-send summary with the time, scenario, latest vitals and steps completed.</p>
          <pre className="surgeon-msg">{surgeonSummary()}</pre>
          <button className="btn btn-ghost" onClick={copySummary}>{copied ? 'Copied!' : 'Copy message'}</button>
        </div>
      </div>
    </div>
  );
}
