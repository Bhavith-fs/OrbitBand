import { useEffect, useRef, useState } from 'react';
import OrbitSky from './components/OrbitSky.jsx';
import Hero from './components/Hero.jsx';
import BodyScreen from './components/BodyScreen.jsx';
import MeasurementGuide from './components/MeasurementGuide.jsx';
import EmergencyMode from './components/EmergencyMode.jsx';
import TrendCharts from './components/TrendCharts.jsx';
import MissionControl from './components/MissionControl.jsx';
import { Roadmap, About } from './components/StaticPages.jsx';
import { buildCrewData } from './data/crewData.js';

// App — DATA -> RULES -> SCREENS -> ACTIONS AND ALERTS
// crewData lives here; every screen reads from it. getStatus() lives in lib/status.js.

const NAV = [
  { id: 'body', label: 'Body' },
  { id: 'guide', label: 'Measurements' },
  { id: 'charts', label: 'Trends' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'about', label: 'About' }
];

export default function App() {
  const [view, setView] = useState('home');
  const [aboutOpen, setAboutOpen] = useState(false);
  const [emergency, setEmergency] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [nightMode, setNightMode] = useState(false);
  const [mcOpen, setMcOpen] = useState(false);
  const [scenario, setScenario] = useState('normal');
  const [data, setData] = useState(() => buildCrewData('normal'));
  const [missionTime, setMissionTime] = useState(Date.now());
  const [delay, setDelay] = useState(20); // minutes each way, drifts slowly
  const driftTimer = useRef(null);

  // Mission clock + slow comms-delay drift
  useEffect(() => {
    const clock = setInterval(() => setMissionTime(Date.now()), 1000);
    return () => clearInterval(clock);
  }, []);
  useEffect(() => {
    const d = setInterval(() => setDelay(v => Math.min(24, Math.max(16, v + (Math.random() - 0.5) * 0.6))), 8000);
    return () => clearInterval(d);
  }, []);

  // Live band drift — small random walk every few seconds
  useEffect(() => {
    driftTimer.current = setInterval(() => {
      setData(prev => {
        const t = { ...prev.today };
        const jitter = (v, amt) => +(v + (Math.random() - 0.5) * amt).toFixed(1);
        t.heartRate = Math.round(jitter(t.heartRate, 4));
        t.spo2 = Math.min(99, Math.max(88, jitter(t.spo2, 1)));
        t.temperature = Math.min(38.5, Math.max(35.8, jitter(t.temperature, 0.2)));
        t.workoutMinutes = Math.max(0, Math.round(jitter(t.workoutMinutes, 6)));
        t.radiationDose = +(t.radiationDose + Math.random() * 0.3).toFixed(1);
        // keep last7Days today-entry in sync so charts move too
        const last7 = [...prev.last7Days];
        last7[6] = { ...last7[6], ...t };
        return { ...prev, today: t, last7Days: last7 };
      });
    }, 4000);
    return () => clearInterval(driftTimer.current);
  }, []);

  function applyScenario(key) {
    setScenario(key);
    setData(buildCrewData(key));
  }
  function reset() { applyScenario('normal'); }

  const missionDay = 180 + Math.floor((missionTime - missionTime) / 86400000); // fixed Day 180 setting
  const clock = new Date(missionTime).toUTCString().slice(17, 25) + ' UTC';

  const themeClass = [
    highContrast ? 'hc' : '',
    nightMode ? 'night' : '',
    emergency ? 'emergency-dim' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={`app ${themeClass}`}>
      <OrbitSky dimmed={emergency} slowed={emergency} />

      <header className="topbar">
        <button className="brand" onClick={() => { setView('home'); setAboutOpen(false); }}>
          Orbit<span>Band</span>
        </button>
        <nav className="topnav" aria-label="Main">
          {NAV.map(n => (
            <button key={n.id}
              className={view === n.id && !aboutOpen ? 'nav-active' : ''}
              onClick={() => { setView(n.id); setAboutOpen(false); }}>
              {n.label}
            </button>
          ))}
        </nav>
        <div className="topbar-right">
          <span className="mission-clock" title="Mission clock">{clock}</span>
          <span className="comms-delay" title="One-way communication delay to Earth">Δ {delay.toFixed(0)} min</span>
          <button className="toggle" onClick={() => setHighContrast(h => !h)} aria-pressed={highContrast}>Contrast</button>
          <button className="toggle" onClick={() => setNightMode(n => !n)} aria-pressed={nightMode}>Night</button>
          <button className="btn btn-emergency" onClick={() => setEmergency(true)}>EMERGENCY</button>
        </div>
      </header>

      <main className="page">
        {view === 'home' && !aboutOpen && (
          <Hero onBegin={() => setView('body')}
                onLearn={() => setAboutOpen(true)} />
        )}
        {aboutOpen && <About />}
        {view === 'body' && <BodyScreen data={data} />}
        {view === 'guide' && <MeasurementGuide />}
        {view === 'charts' && <TrendCharts data={data} />}
        {view === 'roadmap' && <Roadmap />}
      </main>

      <footer className="footer">
        <p>Prototype for demonstration only. Not medical advice.</p>
        <p className="fine-print">Band readings and radiation are simulated; rules, screens, emergency steps and charts are real working logic.</p>
      </footer>

      <MissionControl open={mcOpen} onToggle={() => setMcOpen(o => !o)}
                      scenario={scenario} onScenario={applyScenario} onReset={reset} />

      {emergency && <EmergencyMode data={data} onExit={() => setEmergency(false)} />}
    </div>
  );
}
