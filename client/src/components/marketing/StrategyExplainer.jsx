import Container from '../common/Container';

const STEPS = [
  {
    n: '01',
    title: 'Scan',
    body: 'Every session, the engine tracks a 9-period EMA against a 21-period EMA on each watched symbol, alongside a 14-period RSI reading.',
  },
  {
    n: '02',
    title: 'Confirm',
    body: 'A crossover only becomes a signal once RSI confirms momentum — above 45 for longs, below 55 for exits — filtering out weak, low-conviction crosses.',
  },
  {
    n: '03',
    title: 'Size & execute',
    body: 'Position size is set from ATR-based stop distance and your chosen risk-per-trade percentage, then sent to your broker as a bracket order.',
  },
];

export default function StrategyExplainer() {
  return (
    <section id="strategy" className="grid-paper-light border-b border-line-light bg-paper py-24 text-ink">
      <Container>
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal-dim">
            Field notes — EMA / RSI crossover
          </p>
          <h2 className="mt-3 font-display text-3xl font-medium md:text-4xl">
            The whole strategy, in three steps.
          </h2>
          <p className="mt-4 text-ink/70">
            No sentiment scores, no news scraping, no discretionary overrides. Just price and
            momentum, checked the same way every single day.
          </p>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.n} className="border-t-2 border-ink/15 pt-6">
              <span className="ledger-number text-sm text-marigold-dim">{step.n}</span>
              <h3 className="mt-2 font-display text-xl font-medium">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{step.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-md border border-ink/10 bg-paper-dim p-6 md:p-8">
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-ink/50">Signal definition</p>
          <pre className="mt-4 overflow-x-auto font-mono text-sm leading-relaxed text-ink/80">
{`BUY  when  EMA(9) crosses above EMA(21)  AND  RSI(14) > 45
SELL when  EMA(9) crosses below EMA(21)  AND  RSI(14) < 55
EXIT also triggers on:  price <= entry - 1.5×ATR(14)   (stop loss)
                        price >= entry + 3.0×ATR(14)   (target)`}
          </pre>
          <p className="mt-4 text-xs text-ink/50">
            This is the exact rule set running in the backtest panel below — change the inputs
            there and the numbers update on the same logic, not a different "live" model.
          </p>
        </div>
      </Container>
    </section>
  );
}
