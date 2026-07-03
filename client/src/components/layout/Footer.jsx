import { TrendingUp } from 'lucide-react';
import Container from '../common/Container';

export default function Footer() {
  return (
    <footer className="border-t border-line-dark bg-bg">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-semibold text-cream">
            <TrendingUp className="h-5 w-5 text-marigold" aria-hidden="true" />
            Vantage Quant
          </div>
          <p className="mt-3 max-w-xs text-sm text-cream-dim">
            A rules-based EMA/RSI system for NSE &amp; BSE equities and indices, built for traders
            who want their edge written down, not remembered.
          </p>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-cream-dim">Product</p>
          <ul className="mt-4 space-y-2 text-sm text-cream-dim">
            <li><a href="/#strategy" className="hover:text-cream">The strategy</a></li>
            <li><a href="/#performance" className="hover:text-cream">Performance</a></li>
            <li><a href="/#pricing" className="hover:text-cream">Pricing</a></li>
          </ul>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-cream-dim">Resources</p>
          <ul className="mt-4 space-y-2 text-sm text-cream-dim">
            <li><a href="/#faq" className="hover:text-cream">FAQ</a></li>
            <li>
              <a href="https://kite.trade/docs/connect/v3/" target="_blank" rel="noreferrer" className="hover:text-cream">
                Kite Connect docs
              </a>
            </li>
            <li>
              <a href="https://www.sebi.gov.in" target="_blank" rel="noreferrer" className="hover:text-cream">
                SEBI
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-cream-dim">Legal</p>
          <ul className="mt-4 space-y-2 text-sm text-cream-dim">
            <li>Algo trading involves substantial risk</li>
            <li>Not investment advice</li>
            <li>Past performance ≠ future results</li>
          </ul>
        </div>
      </Container>

      <Container className="border-t border-line-dark py-6">
        <p className="text-xs text-cream-dim">
          © {new Date().getFullYear()} Vantage Quant. Educational template — verify SEBI &amp; exchange
          compliance before deploying live capital.
        </p>
      </Container>
    </footer>
  );
}
