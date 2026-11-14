import { useEffect, useRef } from 'react';

// OrbitSky — the canvas particle band from the visual identity.
// Blue and ember dots orbit steadily and slowly around a central point.
// Fixed behind every page. Respects prefers-reduced-motion and emergency dimming.
// Particle count: ~2600 desktop, ~1200 mobile.
export default function OrbitSky({ dimmed = false, slowed = false }) {
  const canvasRef = useRef(null);
  const dimmedRef = useRef(dimmed);
  const slowedRef = useRef(slowed);
  dimmedRef.current = dimmed;
  slowedRef.current = slowed;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 720px)').matches;
    const COUNT = reduced ? 300 : isMobile ? 1600 : 3200;

    let w, h, cx, cy, particles = [];
    let raf;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = w / 2; cy = h * 0.42;
      const maxR = Math.min(w, h) * 0.75;
      particles = Array.from({ length: COUNT }, () => {
        // Elliptical orbits tilted like a band across the sky
        const r = 40 + Math.random() * maxR;
        const tilt = -0.35 + Math.random() * 0.5;
        const speed = (0.0003 + Math.random() * 0.0004) * (Math.random() < 0.5 ? 1 : -1);
        const ember = Math.random() < 0.22;
        return {
          r, tilt, speed,
          angle: Math.random() * Math.PI * 2,
          size: ember ? 1 + Math.random() * 1.6 : 0.6 + Math.random() * 1.4,
          ember,
          alpha: 0.25 + Math.random() * 0.55,
          wobble: Math.random() * Math.PI * 2
        };
      });
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const dim = dimmedRef.current ? 0.25 : 1;
      const timeScale = slowedRef.current ? 0.15 : 0.6;
      for (const p of particles) {
        p.angle += p.speed * timeScale;
        const x = cx + Math.cos(p.angle) * p.r;
        const y = cy + Math.sin(p.angle) * p.r * Math.sin(p.tilt) + Math.sin(p.angle * 2 + p.wobble) * 6;
        ctx.globalAlpha = p.alpha * dim;
        ctx.fillStyle = p.ember ? '#ff6b3d' : '#4b9bff';
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!reduced) raf = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} className="orbit-sky" aria-hidden="true" />;
}
