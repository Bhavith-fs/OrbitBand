import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler } from 'chart.js';
import { getStatus, STATUS_META } from '../lib/status.js';
import { RADIATION_CAREER_LIMIT } from '../data/crewData.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

// TrendCharts — 7-day line charts. Each point is coloured by getStatus(),
// green/yellow/red zones are shaded, and persistent red (2+ days) triggers
// the flight-surgeon alert.

const CHARTS = [
  { key: 'heartRate', label: 'Heart rate', unit: 'bpm', indicator: 'heartRate', color: '#4b9bff' },
  { key: 'sleepHours', label: 'Sleep', unit: 'h', indicator: 'sleep', color: '#9b7bff' },
  { key: 'radiationDose', label: 'Radiation dose', unit: 'mSv', indicator: 'radiation', color: '#ff6b3d', cumulative: true },
  { key: 'workoutMinutes', label: 'Workout', unit: 'min', indicator: 'workout', color: '#3ddc84' }
];

const ZONE_COLORS = {
  green: 'rgba(61,220,132,0.07)',
  yellow: 'rgba(245,197,66,0.07)',
  red: 'rgba(255,93,93,0.09)'
};

function persistentRed(days, key, indicator) {
  // red for 2+ consecutive days (counting back from today)
  let run = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    const v = days[i][key];
    const s = indicator === 'radiation' ? (v > 40 ? 'red' : v > 20 ? 'yellow' : 'green') : getStatus(indicator, v);
    if (s === 'red') run++; else break;
  }
  return run >= 2;
}

export default function TrendCharts({ data }) {
  const days = data.last7Days;
  const labels = days.map((_, i) => `D-${6 - i}`);

  const alerts = CHARTS.filter(c => persistentRed(days, c.key, c.indicator));

  // Radiation projection: cumulative dose vs career limit
  const rad = useMemo(() => {
    const total = days.reduce((a, d) => a + (d.radiationDose || 0), 0);
    const perDay = total / days.length;
    const remaining = Math.max(0, RADIATION_CAREER_LIMIT - total);
    const daysLeft = perDay > 0 ? Math.round(remaining / perDay) : Infinity;
    return { total, perDay, daysLeft };
  }, [days]);

  return (
    <section className="screen">
      <header className="screen-head">
        <h2>Trends — last 7 days</h2>
        <p className="lede">Each dot is coloured by the same rules the band uses. Shaded bands show the green, watch and concern zones.</p>
      </header>

      {alerts.length > 0 && (
        <div className="panel persistent-alert">
          <strong>Persistent concern:</strong> {alerts.map(a => a.label).join(', ')} has been in the red zone for 2+ days.
          {' '}Recommend contacting the flight surgeon.
        </div>
      )}

      <div className="charts-grid">
        {CHARTS.map(c => (
          <ChartCard key={c.key} cfg={c} days={days} labels={labels} />
        ))}
      </div>

      <div className="panel radiation-projection">
        <h3>Radiation outlook</h3>
        <p>
          Simulated dose over the last 7 days: <strong>{rad.total.toFixed(0)} mSv</strong>.
          {' '}At this rate (~{rad.perDay.toFixed(1)} mSv/day), the demo career limit of {RADIATION_CAREER_LIMIT} mSv
          {' '}is reached in ~{rad.daysLeft === Infinity ? '—' : rad.daysLeft} days.
        </p>
        <p className="fine-print">Projection is a straight-line estimate from simulated data — not a real dosimetry reading.</p>
      </div>
    </section>
  );
}

function ChartCard({ cfg, days, labels }) {
  const values = days.map(d => d[cfg.key]);
  const pointColors = values.map(v =>
    cfg.indicator === 'radiation'
      ? (v > 40 ? STATUS_META.red.color : v > 20 ? STATUS_META.yellow.color : STATUS_META.green.color)
      : STATUS_META[getStatus(cfg.indicator, v)].color
  );

  // Shade zones as background segments is complex; instead we draw threshold
  // reference lines and colour the points — the legend explains the bands.
  const data = {
    labels,
    datasets: [{
      label: cfg.label,
      data: values,
      borderColor: cfg.color,
      backgroundColor: 'transparent',
      pointBackgroundColor: pointColors,
      pointBorderColor: '#05070d',
      pointRadius: 6,
      pointHoverRadius: 8,
      borderWidth: 2,
      tension: 0.3,
      fill: false
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const v = ctx.parsed.y;
            const s = cfg.indicator === 'radiation'
              ? (v > 40 ? 'red' : v > 20 ? 'yellow' : 'green')
              : getStatus(cfg.indicator, v);
            return `${v} ${cfg.unit} — ${STATUS_META[s].label}`;
          }
        }
      }
    },
    scales: {
      x: { ticks: { color: '#93a1b8' }, grid: { color: 'rgba(147,161,184,0.08)' } },
      y: { ticks: { color: '#93a1b8' }, grid: { color: 'rgba(147,161,184,0.08)' } }
    }
  };

  return (
    <div className="panel chart-card">
      <h3>{cfg.label} <span className="unit">({cfg.unit})</span></h3>
      <div className="chart-wrap"><Line data={data} options={options} /></div>
      <div className="chart-legend">
        <span><i style={{ background: STATUS_META.green.color }} /> OK</span>
        <span><i style={{ background: STATUS_META.yellow.color }} /> Watch</span>
        <span><i style={{ background: STATUS_META.red.color }} /> Concern</span>
      </div>
    </div>
  );
}
