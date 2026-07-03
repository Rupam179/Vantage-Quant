import { useEffect, useState } from 'react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { SlidersHorizontal } from 'lucide-react';
import Card from '../common/Card';
import StatCard from '../common/StatCard';
import Button from '../common/Button';
import api from '../../services/api';

const SYMBOLS = ['NIFTY50', 'BANKNIFTY', 'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK'];

export default function BacktestPanel() {
  const [form, setForm] = useState({
    symbol: 'NIFTY50',
    days: 260,
    capital: 100000,
    fastPeriod: 9,
    slowPeriod: 21,
    stopLossAtrMultiple: 1.5,
    targetAtrMultiple: 3,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function runBacktest(e) {
    e?.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/strategy/backtest', form);
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    api
      .post('/strategy/backtest', form)
      .then((res) => { if (!cancelled) setResult(res.data); })
      .catch((err) => console.error(err))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  return (
    <Card>
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="h-5 w-5 text-marigold" aria-hidden="true" />
        <h3 className="font-display text-lg font-medium text-cream">Backtest the strategy</h3>
      </div>

      <form onSubmit={runBacktest} className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Field label="Symbol">
          <select
            value={form.symbol}
            onChange={(e) => update('symbol', e.target.value)}
            className="w-full rounded-sm border border-line-dark bg-surface-2 px-3 py-2 text-sm text-cream"
          >
            {SYMBOLS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="Capital (₹)">
          <input
            type="number"
            value={form.capital}
            onChange={(e) => update('capital', Number(e.target.value))}
            className="w-full rounded-sm border border-line-dark bg-surface-2 px-3 py-2 text-sm text-cream"
          />
        </Field>
        <Field label="Fast EMA">
          <input
            type="number"
            value={form.fastPeriod}
            onChange={(e) => update('fastPeriod', Number(e.target.value))}
            className="w-full rounded-sm border border-line-dark bg-surface-2 px-3 py-2 text-sm text-cream"
          />
        </Field>
        <Field label="Slow EMA">
          <input
            type="number"
            value={form.slowPeriod}
            onChange={(e) => update('slowPeriod', Number(e.target.value))}
            className="w-full rounded-sm border border-line-dark bg-surface-2 px-3 py-2 text-sm text-cream"
          />
        </Field>

        <div className="col-span-2 md:col-span-4">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Running…' : 'Run backtest'}
          </Button>
        </div>
      </form>

      {result && (
        <>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatCard
              label="Total Return"
              value={`${result.totalReturnPct}%`}
              accent={result.totalReturnPct >= 0 ? 'profit' : 'loss'}
            />
            <StatCard label="Win Rate" value={`${result.winRate}%`} accent="teal" />
            <StatCard label="Max Drawdown" value={`${result.maxDrawdownPct}%`} accent="loss" />
            <StatCard label="Trades" value={result.totalTrades} accent="marigold" />
          </div>

          <div className="mt-6 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={result.equityCurve}>
                <CartesianGrid stroke="#2A3C53" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#B9C3D1' }} tickFormatter={(d) => d.slice(5)} minTickGap={40} stroke="#2A3C53" />
                <YAxis tick={{ fontSize: 11, fill: '#B9C3D1' }} width={60} domain={['auto', 'auto']} stroke="#2A3C53" />
                <Tooltip contentStyle={{ background: '#142539', border: '1px solid #2A3C53', fontSize: 12 }} labelStyle={{ color: '#EDE7D9' }} />
                <Line type="monotone" dataKey="equity" stroke="#2BA89A" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line-dark text-xs uppercase tracking-wide text-cream-dim">
                  <th className="py-2 pr-4 font-mono">Entry</th>
                  <th className="py-2 pr-4 font-mono">Exit</th>
                  <th className="py-2 pr-4 font-mono">Qty</th>
                  <th className="py-2 pr-4 font-mono">P&amp;L</th>
                  <th className="py-2 pr-4 font-mono">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-dark">
                {result.trades.slice(-8).reverse().map((t, i) => (
                  <tr key={i}>
                    <td className="py-2 pr-4 font-mono text-cream-dim">{t.entryDate}</td>
                    <td className="py-2 pr-4 font-mono text-cream-dim">{t.exitDate}</td>
                    <td className="py-2 pr-4 font-mono text-cream-dim">{t.qty}</td>
                    <td className={`py-2 pr-4 font-mono font-medium ${t.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                      {t.pnl >= 0 ? '+' : ''}₹{t.pnl.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2 pr-4 font-mono text-cream-dim">{t.exitReason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Card>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block font-mono text-[11px] uppercase tracking-wide text-cream-dim">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
