export default function Card({ children, className = '', tone = 'dark' }) {
  const toneClass =
    tone === 'paper'
      ? 'bg-paper text-ink border border-line-light'
      : 'bg-surface text-cream border border-line-dark';
  return <div className={`rounded-md p-6 ${toneClass} ${className}`}>{children}</div>;
}
