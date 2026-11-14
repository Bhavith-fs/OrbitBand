import { useEffect, useRef, useState } from 'react';
import { getStatus, STATUS_META, worstStatus } from '../lib/status.js';

// BodyFigure — clickable SVG zones: Heart, Bones/Muscle, Brain, Immune.
// Zone colour = worst colour of its indicators via getStatus().
// Space-hazard mapping is explained in each zone's side panel.

const ZONES = {
  heart: {
    name: 'Heart',
    does: 'Pumps blood and oxygen to every crew member. In microgravity it works a little differently — heart rate and blood pressure are the earliest signals something has changed.',
    hazards: 'Space radiation and altered gravity both stress the cardiovascular system.',
    action: 'If readings stay off, rest, hydrate, and tell the flight surgeon at the next scheduled check-in.'
  },
  bones: {
    name: 'Bones & Muscle',
    does: 'Without gravity loading them, bones and muscles slowly weaken. Daily resistance exercise is the main countermeasure.',
    hazards: 'Altered gravity — the biggest long-term threat to crew health on a Mars mission.',
    action: 'Keep up resistance exercise. If workout minutes drop, schedule a session before the day ends.'
  },
  brain: {
    name: 'Brain',
    does: 'Sleep, mood and focus. Isolation and a fixed sleep schedule matter more than people expect, especially far from Earth.',
    hazards: 'Isolation and the closed environment — no natural light, no fresh air, no quiet.',
    action: 'Protect sleep hours. If sleep stays short, talk to a crewmate — connection helps.'
  },
  immune: {
    name: 'Immune System',
    does: 'Fever, temperature and radiation exposure all show up here first. A small rise can be the earliest warning.',
    hazards: 'Space radiation and the closed cabin environment (air quality, shared surfaces).',
    action: 'If temperature climbs, check cabin air and hygiene first, then re-measure in an hour.'
  }
};

// Anatomically correct front-view figure. Zones are <path> hotspots.
const FIGURE = {
  brain: 'M200 52 c-22 0 -38 14 -38 32 c0 8 4 16 10 20 c-6 6 -10 14 -8 24 c2 12 12 20 26 22 c5 1 10 2 12 5 c2 -3 7 -4 12 -5 c14 -2 24 -10 26 -22 c2 -10 -2 -18 -8 -24 c6 -4 10 -12 10 -20 c0 -18 -16 -32 -38 -32 z',
  heart: 'M200 150 c-12 -16 -34 -12 -38 6 c-2 14 8 24 18 32 c3 3 6 6 8 10 c2 -4 5 -7 8 -10 c10 -8 20 -18 18 -32 c-4 -18 -26 -22 -38 -6 z',
  immune: 'M200 180 c-26 0 -46 20 -46 44 c0 36 26 70 46 86 c20 -16 46 -50 46 -86 c0 -24 -20 -44 -46 -44 z',
  bones: 'M200 80 L200 320 M170 100 L230 100 M174 200 L226 200 M178 270 L222 270 M162 80 L238 80 M160 320 L240 320'
};

export default function BodyFigure({ data, selected, onSelect }) {
  const areas = areaStatusSafe(data);
  const [pulse, setPulse] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    // Gentle heartbeat pulse on the heart zone — calm, not alarming.
    timer.current = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 350);
    }, 1100);
    return () => clearInterval(timer.current);
  }, []);

  function areaStatusSafe(d) {
    const t = d.today;
    const bp = t.bloodPressure || { systolic: 118, diastolic: 76 };
    return {
      heart: worstStatus(getStatus('heartRate', t.heartRate), getStatus('systolic', bp.systolic), getStatus('diastolic', bp.diastolic)),
      bones: getStatus('workout', t.workoutMinutes),
      brain: getStatus('sleep', t.sleepHours),
      immune: worstStatus(getStatus('temperature', t.temperature), t.radiationAlert ? 'red' : 'green')
    };
  }

  return (
    <svg viewBox="0 0 400 420" className="body-figure" role="group" aria-label="Interactive body map">
      <defs>
        <radialGradient id="zoneGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* soft body silhouette */}
      <g className="body-silhouette" fill="none" stroke="#93a1b8" strokeWidth="2" opacity="0.5">
        <circle cx="200" cy="52" r="26" />
        <path d="M200 78 L200 320 M170 100 L230 100 M162 80 L238 80 M160 320 L240 320 M174 200 L226 200 M178 270 L222 270" strokeLinecap="round" />
        <path d="M170 100 L150 150 M230 100 L250 150 M174 200 L150 240 M226 200 L250 240" strokeLinecap="round" />
      </g>

      {Object.entries(ZONES).map(([key, z]) => {
        const status = areas[key];
        const color = STATUS_META[status].color;
        const isSel = selected === key;
        return (
          <g key={key}
             className={`zone zone-${key} ${isSel ? 'zone-selected' : ''} ${key === 'heart' && pulse ? 'zone-pulse' : ''}`}
             style={{ color }}
             onClick={() => onSelect(key)}
             role="button"
             tabIndex={0}
             aria-label={`${z.name}: ${STATUS_META[status].label}`}
             onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(key)}>
            <path d={FIGURE[key]} fill="url(#zoneGlow)" stroke={color} strokeWidth={isSel ? 3 : 1.6}
                  fillOpacity={isSel ? 0.5 : 0.28}
                  style={{ transition: 'stroke 0.6s ease, fill-opacity 0.6s ease' }}
                  className={key === 'bones' ? 'zone-stroke-only' : ''} />
            <text x="200"
                  y={key === 'brain' ? 96 : key === 'heart' ? 190 : key === 'immune' ? 250 : 340}
                  textAnchor="middle" className="zone-label"
                  fill={isSel ? color : '#93a1b8'}>{z.name}</text>
          </g>
        );
      })}
    </svg>
  );
}
