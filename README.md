# OrbitBand

Health monitoring for astronauts on deep-space missions — a NASA Space Apps Challenge prototype. Built with React + Vite + Chart.js. No backend, no login, installable PWA that works offline (fitting, since you're halfway to Mars).

> Prototype for demonstration only. Not medical advice. All ranges are demo values.

## Run locally

```bash
cd orbitband
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## What's inside

- **OrbitSky** — canvas particle band (blue/ember dots, ~2600 desktop / ~1200 mobile, respects reduced motion)
- **Body figure** — clickable SVG zones (Heart, Bones/Muscle, Brain, Immune) coloured by `getStatus()`
- **Measurement guide** — how/why/what-to-do per indicator + live value tester
- **Emergency mode** — step-by-step collapse scenario, 110 bpm Web Audio metronome, 2-min rescuer swap timer, speech synthesis, flight-surgeon summary
- **Trend charts** — 7-day Chart.js lines with status-coloured points, persistent-concern alert, radiation projection
- **Mission control drawer** — demo scenarios (normal / poor sleep / radiation storm / cabin air) + live data drift
- **Readiness score** — explainable ("-12 sleep, -5 radiation") + 14-day personal baseline drift
- **PWA** — manifest + service worker via `vite-plugin-pwa`

## 2-minute demo script — "Day 180"

1. **(0:00)** Open the app. Hero: "Welcome aboard, astronaut." Point at the orbiting band — "this is the sky, halfway to Mars."
2. **(0:15)** Click **Begin** → body figure. Tap the **Heart** zone: green, heart rate 74. "Every zone colour comes from one rules engine."
3. **(0:30)** Open **Mission control** (bottom-right) → **Radiation storm**. Watch the Immune zone flip red and the readiness score drop with reasons listed.
4. **(0:45)** Go to **Trends** — radiation chart shows the spike; persistent-concern logic and the career-limit projection (~N days) are visible.
5. **(1:00)** Switch scenario to **Cabin air problem** → SpO2 drops to 91, temperature 37.8 — Brain and Immune zones go yellow/red. "Closed environment hazard — check cabin air first."
6. **(1:15)** Hit the red **EMERGENCY** button (top right, on every screen). Walk one step: "check responsiveness and breathing." Advance to the CPR step — metronome ticks at 110 bpm, swap timer counts down.
7. **(1:35)** Show **Contact flight surgeon** — generates a ready-to-send summary with vitals and steps completed, copy button works offline.
8. **(1:45)** Toggle **Night** mode and **Contrast**. Open **About** — NASA HRP five hazards + NASA-STD-3001 citations.
9. **(2:00)** Close: "Simulated band, real logic. Every screen reads the same data through the same rules — that's what makes it trustworthy at 20 minutes from Earth."

