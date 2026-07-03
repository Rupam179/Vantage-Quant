# Risk Disclosure

This repository is an **educational software template**. Before using it
with real money, please read this in full.

## This is not investment advice

Nothing in this codebase, the sample strategy, the backtest results, or the
UI copy constitutes investment advice, a recommendation, or a solicitation
to trade any security or derivative. The author/maintainer is not a SEBI-
registered investment adviser or research analyst.

## Algorithmic trading risk

- **Past performance does not predict future results.** The EMA/RSI
  crossover strategy included here is a common educational example, not a
  proven money-maker. Backtests (especially on the bundled *synthetic*
  sample data) can look better than live results due to lack of real
  slippage, liquidity gaps, and regime change.
- **You can lose your entire capital**, and with leveraged derivatives
  (futures/options), losses can exceed your initial margin.
- **Technical failures happen**: API downtime, network latency, broker
  outages, or a bug in this code could cause missed exits, duplicate
  orders, or incorrect position sizing. Always run a kill-switch / manual
  override process and monitor live trades, especially in the first weeks.
- **Backtest ≠ live.** Brokerage, STT, exchange transaction charges, GST,
  SEBI turnover fees, and stamp duty all reduce real returns versus a
  backtest; this template applies only a rough flat cost assumption.

## Regulatory responsibility

- Retail algorithmic trading through SEBI-registered brokers (e.g.
  Zerodha, Upstox) is permitted in India, but **you are responsible** for
  complying with SEBI and exchange (NSE/BSE) algo-trading guidelines,
  including any order-tagging or approval requirements that apply to your
  broker and account type.
- This software does not register, file, or report anything to SEBI,
  exchanges, or tax authorities on your behalf.
- Consult a qualified financial advisor, tax professional, or compliance
  expert before trading live capital or operating this as a service for
  other users.

## Recommended path before going live

1. Run the backtest panel across multiple symbols and parameter sets.
2. Paper trade the live signal feed for several weeks and compare it
   against your own manual tracking.
3. Start live trading with the smallest viable capital and position size.
4. Keep a trade log (the platform does this automatically) and review it
   weekly.

By using this software, you acknowledge that trading and investment
decisions made using it are entirely your own responsibility.
