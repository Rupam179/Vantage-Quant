import { useEffect, useState } from 'react';
import { Link2, CheckCircle2, ExternalLink } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import api from '../../services/api';

export default function BrokerConnect() {
  const [status, setStatus] = useState({ kite: false, upstox: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connected = params.get('broker_connected');
    const error = params.get('broker_error');

    Promise.allSettled([api.get('/broker/kite/status'), api.get('/broker/upstox/status')])
      .then(([kiteRes, upstoxRes]) => {
        setStatus({
          kite: kiteRes.status === 'fulfilled' ? kiteRes.value.data.connected : false,
          upstox: upstoxRes.status === 'fulfilled' ? upstoxRes.value.data.connected : false,
        });
      })
      .finally(() => setLoading(false));

    if (connected || error) {
      // Clean the query string after reading the broker redirect result
      window.history.replaceState({}, '', '/dashboard');
    }
  }, []);

  return (
    <Card className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <Link2 className="h-5 w-5 text-marigold" aria-hidden="true" />
        <h3 className="font-display text-lg font-medium text-cream">Broker connection</h3>
      </div>

      <BrokerRow
        name="Zerodha Kite"
        connected={status.kite}
        loading={loading}
        loginUrl="/api/broker/kite/login"
        note="Requires an active Kite Connect subscription from Zerodha."
      />
      <BrokerRow
        name="Upstox"
        connected={status.upstox}
        loading={loading}
        loginUrl="/api/broker/upstox/login"
        note="Free API access for retail developers."
      />

      <p className="text-xs text-cream-dim">
        OAuth tokens are stored server-side and used only to place orders you trigger from this
        dashboard. You can revoke access anytime from your broker's app permissions page.
      </p>
    </Card>
  );
}

function BrokerRow({ name, connected, loading, loginUrl, note }) {
  return (
    <div className="flex items-center justify-between rounded-sm border border-line-dark bg-surface-2 px-4 py-3">
      <div>
        <p className="text-sm font-medium text-cream">{name}</p>
        <p className="text-xs text-cream-dim">{note}</p>
      </div>
      {loading ? (
        <span className="text-xs text-cream-dim">Checking…</span>
      ) : connected ? (
        <span className="flex items-center gap-1.5 text-xs font-medium text-profit">
          <CheckCircle2 className="h-4 w-4" /> Connected
        </span>
      ) : (
        <Button as="a" href={loginUrl} variant="secondary" className="px-3 py-1.5 text-xs">
          Connect <ExternalLink className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
