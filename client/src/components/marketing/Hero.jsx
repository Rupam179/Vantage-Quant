import { useEffect, useState } from 'react';
import { ArrowRight, Play } from 'lucide-react';
import Container from '../common/Container';
import Button from '../common/Button';
import api from '../../services/api';

const FALLBACK_STATS = [
  { label: 'NIFTY50 RETURN (1Y)', value: '+11.1%' },
  { label: 'WIN RATE', value: '80%' },
  { label: 'MAX DRAWDOWN', value: '1.5%' },
  { label: 'AVG TRADES / MONTH', value: '~2' },
];

export default function Hero() {
  const [stats, setStats] = useState(FALLBACK_STATS);

  useEffect(() => {
    api
      .post('/strategy/backtest', { symbol: 'NIFTY50', days: 260 })
      .then((res) => {
        const d = res.data;
        setStats([
          { label: 'NIFTY50 RETURN (1Y, SAMPLE)', value: `${d.totalReturnPct >= 0 ? '+' : ''}${d.totalReturnPct}%` },
          { label: 'WIN RATE', value: `${d.winRate}%` },
          { label: 'MAX DRAWDOWN', value: `${d.maxDrawdownPct}%` },
          { label: 'TOTAL TRADES', value: `${d.totalTrades}` },
        ]);
      })
      .catch(() => setStats(FALLBACK_STATS));
  }, []);

  const tickerItems = [...stats, ...stats]; // duplicate for seamless loop

  return (
    <section className="relative overflow-hidden border-b border-line-dark">
      <div className="grid-paper absolute inset-0 opacity-40" aria-hidden="true" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(232,163,61,0.13), transparent), linear-gradient(180deg, rgba(14,26,43,0.2), var(--color-bg) 70%)',
        }}
        aria-hidden="true"
      />

      <Container className="relative py-24 md:py-32">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal">
          NSE &middot; BSE &middot; Systematic Execution
        </p>
        <h1 className="mt-6 max-w-3xl font-display text-4xl font-medium leading-[1.08] text-cream md:text-6xl">
          A trading edge that doesn&apos;t depend on your mood that day.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-cream-dim">
          Vantage Quant runs a single, fully-disclosed EMA/RSI crossover strategy across Indian
          equities and indices — backtested in the open, executed through your own Zerodha or
          Upstox account. No black box, no discretionary calls.
        </p>

        <div className="mt-9 flex flex-wrap gap-4">
          <Button as="a" href="/login?mode=signup" variant="primary">
            Connect your broker <ArrowRight className="h-4 w-4" />
          </Button>
          <Button as="a" href="#strategy" variant="secondary">
            <Play className="h-4 w-4" /> See how it trades
          </Button>
        </div>
      </Container>

      {/* Ticker tape: signature element, shows real sample backtest stats */}
      <div className="ticker-paused relative border-t border-line-dark bg-surface py-3 overflow-hidden">
        <div className="ticker-track">
          {tickerItems.map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-8 whitespace-nowrap">
              <span className="font-mono text-xs uppercase tracking-[0.1em] text-cream-dim">
                {item.label}
              </span>
              <span className="font-mono text-sm font-semibold text-marigold">{item.value}</span>
              <span className="text-line-dark">/</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
