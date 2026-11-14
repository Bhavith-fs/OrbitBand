// Static roadmap + about pages.

export function Roadmap() {
  const items = [
    { title: 'Camera exercise coach', body: 'Pose tracking counts reps and checks form during resistance sessions — the single biggest countermeasure for bone and muscle loss.' },
    { title: 'Gamification', body: 'Points and streaks for workouts, sleep consistency and measurement habits. Small rewards, crew-friendly competition.' },
    { title: 'Measurement reminders', body: 'Gentle prompts for blood pressure, blood sugar and temperature at the right times of day.' },
    { title: 'Environment switch', body: 'The same rules adapt to spacecraft, space station or Moon base — different hazards, different baselines.' },
    { title: 'Daily mood check-in', body: 'A 10-second mood log feeds the Brain zone alongside sleep, so isolation drift is caught early.' }
  ];
  return (
    <section className="screen">
      <header className="screen-head">
        <h2>Where this goes next</h2>
        <p className="lede">OrbitBand starts as a monitor. These are the features that turn it into a crewmate.</p>
      </header>
      <div className="roadmap-list">
        {items.map((it, i) => (
          <article key={i} className="panel roadmap-item">
            <span className="roadmap-num">{i + 1}</span>
            <div><h3>{it.title}</h3><p>{it.body}</p></div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function About() {
  return (
    <section className="screen">
      <header className="screen-head">
        <h2>About OrbitBand</h2>
        <p className="lede">Built for the NASA Space Apps Challenge: health monitoring software for astronauts on space missions.</p>
      </header>
      <div className="panel about-body">
        <h3>What is real and what is simulated</h3>
        <p><strong>Simulated:</strong> wrist-band readings (heart rate, SpO2, temperature, sleep, radiation dose, workout) and the 7-day history. In a real version the band would feed the same data structure.</p>
        <p><strong>Real working logic:</strong> the status rules, body-zone rollups, readiness score, baseline drift detection, measurement guide, emergency steps, trend charts and persistent-concern alerts.</p>
        <h3>Sources</h3>
        <ul>
          <li><strong>NASA Human Research Program</strong> — the five spaceflight hazards: radiation, isolation/confinement, distance from Earth, altered gravity, and hostile/closed environments. OrbitBand's body zones map to these hazards.</li>
          <li><strong>NASA-STD-3001</strong> — NASA's standard for spaceflight human-system standards, including medical care and human health performance.</li>
        </ul>
        <p className="fine-print">All ranges shown are demo values only and are not medical advice. This is a prototype for demonstration.</p>
      </div>
    </section>
  );
}
