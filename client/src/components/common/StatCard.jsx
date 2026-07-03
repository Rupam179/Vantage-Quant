export default function StatCard({ label, value, sub, tone = 'dark', accent = 'marigold' }) {
  const accentClass = { marigold: 'text-marigold', teal: 'text-teal', profit: 'text-profit', loss: 'text-loss' }[accent];
  const wrapTone =
    tone === 'paper'
      ? 'bg-paper border-line-light text-ink'
      : 'bg-surface border-line-dark text-cream';
  const subTone = tone === 'paper' ? 'text-ink/60' : 'text-cream-dim';

  return (
    <div className={`rounded-md border p-5 ${wrapTone}`}>
      <p className={`text-xs uppercase tracking-[0.12em] font-mono ${subTone}`}>{label}</p>
      <p className={`mt-2 font-mono text-3xl font-semibold ${accentClass}`}>{value}</p>
      {sub && <p className={`mt-1 text-sm ${subTone}`}>{sub}</p>}
    </div>
  );
}
