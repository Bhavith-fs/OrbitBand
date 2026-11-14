// Hero — matches the visual identity: "Welcome aboard…"
export default function Hero({ onBegin, onLearn }) {
  return (
    <section className="screen hero">
      <p className="hero-eyebrow">Day 180 · Mars transfer · halfway there</p>
      <h1 className="hero-title">Welcome aboard,<br />astronaut.</h1>
      <p className="hero-sub">
        OrbitBand keeps an eye on the things a wrist band can measure — heart, sleep,
        temperature, radiation — and tells you plainly when something needs attention.
        You're the crew. This is your crewmate.
      </p>
      <div className="hero-actions">
        <button className="btn btn-primary" onClick={onBegin}>Begin</button>
        <button className="btn btn-ghost" onClick={onLearn}>Learn more</button>
      </div>
      <p className="hero-note">Simulated band data · real working logic · prototype for demonstration only</p>
    </section>
  );
}
