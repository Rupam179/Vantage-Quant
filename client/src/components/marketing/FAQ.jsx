import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Container from '../common/Container';

const FAQS = [
  {
    q: 'Do you hold my money or place trades without my approval?',
    a: 'No. All orders route through your own Zerodha Kite Connect or Upstox account using OAuth — Vantage Quant never touches your funds directly. You can revoke access from your broker\'s app permissions at any time.',
  },
  {
    q: 'Is this guaranteed to make money?',
    a: 'No. The backtest panel shows historical (and, before a broker is connected, simulated) performance only. Markets change regime, slippage and liquidity vary, and no systematic strategy wins every period. Trade only with capital you can afford to lose.',
  },
  {
    q: 'What instruments does the strategy trade?',
    a: 'The default rule set is tuned for NIFTY 50, BANKNIFTY, and a handful of liquid large-caps. You can extend it to other NSE/BSE symbols once you understand the parameters in the strategy explainer above.',
  },
  {
    q: 'Do I need to know how to code?',
    a: 'No — the dashboard handles signal generation, sizing, and order placement. If you do want to read or modify the logic, the entire strategy engine ships as a documented, open Node.js module.',
  },
  {
    q: 'Is algo trading legal in India?',
    a: 'Yes, retail algo trading through SEBI-registered brokers like Zerodha and Upstox is legal. You remain responsible for complying with exchange and SEBI rules — this platform doesn\'t file anything on your behalf.',
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section id="faq" className="border-b border-line-dark bg-bg py-24">
      <Container>
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal">FAQ</p>
          <h2 className="mt-3 font-display text-3xl font-medium text-cream md:text-4xl">
            Before you connect a broker.
          </h2>
        </div>

        <div className="mt-12 max-w-3xl divide-y divide-line-dark border-y border-line-dark">
          {FAQS.map((item, i) => {
            const isOpen = openIdx === i;
            return (
              <div key={item.q}>
                <button
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  onClick={() => setOpenIdx(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-base font-medium text-cream md:text-lg">{item.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-cream-dim transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && <p className="pb-5 text-sm leading-relaxed text-cream-dim">{item.a}</p>}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
