import { AlertTriangle } from 'lucide-react';
import Container from '../common/Container';

export default function RiskDisclaimer() {
  return (
    <div className="bg-ink py-3">
      <Container className="flex items-center gap-3 text-xs text-paper/70">
        <AlertTriangle className="h-4 w-4 shrink-0 text-marigold" aria-hidden="true" />
        <p>
          Algorithmic trading involves substantial risk of loss and is not suitable for every
          investor. Vantage Quant is an educational template, not investment advice. Backtests use
          historical or simulated data and do not guarantee future results.
        </p>
      </Container>
    </div>
  );
}
