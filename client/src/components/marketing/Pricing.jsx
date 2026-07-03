import { Check } from 'lucide-react';
import Container from '../common/Container';
import Button from '../common/Button';

const PLANS = [
  {
    name: 'Paper',
    price: '₹0',
    period: 'forever',
    tagline: 'Validate the strategy with zero capital at risk.',
    features: [
      'Full backtest panel, all symbols',
      'Daily signal feed (BUY/SELL/HOLD)',
      'Paper trade log & equity tracking',
      'Community Discord access',
    ],
    cta: 'Start free',
    variant: 'secondary',
  },
  {
    name: 'Live',
    price: '₹1,499',
    period: '/month',
    tagline: 'Connect your broker and let it execute for real.',
    features: [
      'Everything in Paper',
      'Zerodha Kite or Upstox auto-execution',
      'ATR-based position sizing & bracket orders',
      'Trade log export (CSV) for your CA',
    ],
    cta: 'Go live',
    variant: 'primary',
    highlight: true,
  },
  {
    name: 'Desk',
    price: 'Custom',
    period: '',
    tagline: 'For HNI traders running multiple instruments/accounts.',
    features: [
      'Everything in Live',
      'Multiple broker accounts',
      'Custom EMA/RSI/ATR parameter sets per symbol',
      'Priority support',
    ],
    cta: 'Talk to us',
    variant: 'secondary',
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="border-b border-line-dark bg-bg py-24">
      <Container>
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal">Pricing</p>
          <h2 className="mt-3 font-display text-3xl font-medium text-cream md:text-4xl">
            Paper trade for free. Pay only once you go live.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col rounded-md border p-7 ${
                plan.highlight ? 'border-marigold bg-surface-2' : 'border-line-dark bg-surface'
              }`}
            >
              <h3 className="font-display text-xl font-medium text-cream">{plan.name}</h3>
              <p className="mt-1 text-sm text-cream-dim">{plan.tagline}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="font-mono text-3xl font-semibold text-cream">{plan.price}</span>
                <span className="text-sm text-cream-dim">{plan.period}</span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-cream-dim">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button as="a" href="/login?mode=signup" variant={plan.variant} className="mt-7 w-full">
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-cream-dim">
          Kite Connect carries its own subscription fee from Zerodha (billed separately by
          Zerodha, currently ~₹2,000/month). Upstox API access is free.
        </p>
      </Container>
    </section>
  );
}
