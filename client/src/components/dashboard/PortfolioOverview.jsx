import { useEffect, useState } from 'react';
import { Briefcase, Info } from 'lucide-react';
import Card from '../common/Card';
import api from '../../services/api';

export default function PortfolioOverview() {
  const [data, setData] = useState(null);
  const [state, setState] = useState('loading'); // loading | not_connected | ready | error

  useEffect(() => {
    api
      .get('/broker/kite/portfolio')
      .then((res) => {
        setData(res.data);
        setState('ready');
      })
      .catch((err) => {
        if (err.response?.status === 404) setState('not_connected');
        else setState('error');
      });
  }, []);

  return (
    <Card>
      <div className="flex items-center gap-2">
        <Briefcase className="h-5 w-5 text-marigold" aria-hidden="true" />
        <h3 className="font-display text-lg font-medium text-cream">Live portfolio (Kite)</h3>
      </div>

      {state === 'loading' && <p className="mt-4 text-sm text-cream-dim">Loading…</p>}

      {state === 'not_connected' && (
        <div className="mt-4 flex items-start gap-2 rounded-sm border border-line-dark bg-surface-2 p-4 text-sm text-cream-dim">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
          Connect Zerodha Kite above to see your real positions and holdings here.
        </div>
      )}

      {state === 'error' && (
        <p className="mt-4 text-sm text-loss">
          Could not load portfolio data. Your Kite session may have expired — Kite Connect access
          tokens are valid only until ~7:30 AM IST the next day, so you may need to reconnect.
        </p>
      )}

      {state === 'ready' && data && (
        <div className="mt-4 space-y-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-cream-dim">Net positions</p>
            <p className="mt-1 text-sm text-cream-dim">
              {data.positions?.net?.length || 0} open position(s)
            </p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-cream-dim">Holdings</p>
            <p className="mt-1 text-sm text-cream-dim">{data.holdings?.length || 0} holding(s)</p>
          </div>
        </div>
      )}
    </Card>
  );
}
