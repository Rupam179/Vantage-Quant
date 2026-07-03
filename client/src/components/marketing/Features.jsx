import { ShieldCheck, Eye, Cpu, LineChart } from 'lucide-react';
import Container from '../common/Container';

const FEATURES = [
  {
    icon: Eye,
    title: 'Fully disclosed logic',
    body: 'Every signal comes from a published EMA crossover + RSI filter — the same rules you can read in our strategy explainer, not a proprietary box you have to trust blindly.',
  },
  {
    icon: Cpu,
    title: 'Runs in your own account',
    body: 'Orders execute through your Zerodha Kite or Upstox login. We never hold your funds or your portfolio — the platform only places trades you have authorized.',
  },
  {
    icon: LineChart,
    title: 'Backtest before you risk a rupee',
    body: 'Pull historical performance for NIFTY, BANKNIFTY, and large-cap names, tune the parameters, and see the equity curve before connecting live capital.',
  },
  {
    icon: ShieldCheck,
    title: 'Risk sized on every trade',
    body: 'Position size is derived from ATR-based stop distance and a fixed risk percentage of capital — not a flat lot size that ignores volatility.',
  },
];

export default function Features() {
  return (
    <section className="border-b border-line-dark bg-bg py-24">
      <Container>
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal">Why systematic</p>
          <h2 className="mt-3 font-display text-3xl font-medium text-cream md:text-4xl">
            Discretion is where most retail edges leak out.
          </h2>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-md border border-line-dark bg-line-dark md:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-surface p-8">
              <Icon className="h-6 w-6 text-marigold" aria-hidden="true" />
              <h3 className="mt-4 font-display text-xl font-medium text-cream">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream-dim">{body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
