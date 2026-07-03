import { useEffect, useState } from 'react';
import { Radio } from 'lucide-react';
import Card from '../common/Card';
import api from '../../services/api';

const SYMBOLS = ['NIFTY50', 'BANKNIFTY', 'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK'];

const SIGNAL_STYLE = {
  BUY: 'bg-profit/15 text-profit border-profit/30',
  SELL: 'bg-loss/15 text-loss border-loss/30',
  HOLD: 'bg-cream-dim/10 text-cream-dim border-line-dark',
};

export default function SignalsPanel() {
  const [signals, setSignals] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      SYMBOLS.map((s) =>
        api
          .get(`/strategy/signal?symbol=${s}`)
          .then((res) => [s, res.data])
          .catch(() => [s, null])
      )
    ).then((entries) => {
      if (cancelled) return;
      setSignals(Object.fromEntries(entries));
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Card>
      <div className="flex items-center gap-2">
        <Radio className="h-5 w-5 text-marigold" aria-hidden="true" />
        <h3 className="font-display text-lg font-medium text-cream">Today's signals</h3>
      </div>
      <p className="mt-1 text-xs text-cream-dim">
        Demo mode uses generated sample data until a broker is connected.
      </p>

      <div className="mt-5 divide-y divide-line-dark">
        {SYMBOLS.map((s) => {
          const data = signals[s];
          return (
            <div key={s} className="flex items-center justify-between py-3">
              <div>
                <p className="font-mono text-sm text-cream">{s}</p>
                {data && <p className="text-xs text-cream-dim">₹{data.close.toLocaleString('en-IN')}</p>}
              </div>
              {loading ? (
                <span className="text-xs text-cream-dim">…</span>
              ) : (
                <span
                  className={`rounded-sm border px-2.5 py-1 font-mono text-xs font-semibold ${
                    SIGNAL_STYLE[data?.signal] || SIGNAL_STYLE.HOLD
                  }`}
                >
                  {data?.signal || 'N/A'}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
