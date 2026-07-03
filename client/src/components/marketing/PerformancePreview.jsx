import { useEffect, useRef, useState } from 'react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import Container from '../common/Container';
import StatCard from '../common/StatCard';
import api from '../../services/api';

const SYMBOLS = ['NIFTY50', 'BANKNIFTY', 'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK'];

export default function PerformancePreview() {
  const [symbol, setSymbol] = useState('NIFTY50');
  const [result, setResult] = useState(null);
  const pendingRef = useRef(0);
  const loading = result === null;

  useEffect(() => {
    const id = ++pendingRef.current;
    api
      .post('/strategy/backtest', { symbol, days: 260 })
      .then((res) => { if (id === pendingRef.current) setResult(res.data); })
      .catch(() => { if (id === pendingRef.current) setResult(null); });
  }, [symbol]);

  return (
    <section id="performance" className="border-b border-line-dark bg-bg py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal">Sample backtest</p>
            <h2 className="mt-3 font-display text-3xl font-medium text-cream md:text-4xl">
              See the strategy on a year of data.
            </h2>
            <p className="mt-3 text-sm text-cream-dim">
              Generated sample data for demonstration — connect a broker to run this on real NSE
              history. Past performance never guarantees future results.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {SYMBOLS.map((s) => (
              <button
                key={s}
                onClick={() => setSymbol(s)}
                className={`rounded-sm border px-3 py-1.5 font-mono text-xs transition-colors ${
                  symbol === s
                    ? 'border-marigold bg-marigold/10 text-marigold'
                    : 'border-line-dark text-cream-dim hover:border-cream-dim'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-md border border-line-dark bg-surface p-4 md:p-6">
            <div className="h-72 w-full">
              {result && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={result.equityCurve}>
                    <CartesianGrid stroke="#2A3C53" strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: '#B9C3D1' }}
                      tickFormatter={(d) => d.slice(5)}
                      minTickGap={40}
                      stroke="#2A3C53"
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: '#B9C3D1' }}
                      width={60}
                      domain={['auto', 'auto']}
                      stroke="#2A3C53"
                    />
                    <Tooltip
                      contentStyle={{ background: '#142539', border: '1px solid #2A3C53', fontSize: 12 }}
                      labelStyle={{ color: '#EDE7D9' }}
                    />
                    <Line type="monotone" dataKey="equity" stroke="#E8A33D" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
              {loading && <p className="text-sm text-cream-dim">Loading backtest…</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <StatCard
              label="Total Return"
              value={result ? `${result.totalReturnPct}%` : '—'}
              accent={result && result.totalReturnPct >= 0 ? 'profit' : 'loss'}
            />
            <StatCard label="Win Rate" value={result ? `${result.winRate}%` : '—'} accent="teal" />
            <StatCard label="Max Drawdown" value={result ? `${result.maxDrawdownPct}%` : '—'} accent="loss" />
            <StatCard label="Total Trades" value={result ? result.totalTrades : '—'} accent="marigold" />
          </div>
        </div>
      </Container>
    </section>
  );
}
