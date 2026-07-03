# Vantage Quant — Algo Trading Platform for the Indian Market

A full-stack template: a marketing site + an interactive dashboard for a
rules-based **EMA(9)/EMA(21) crossover with RSI(14) confirmation** strategy,
built for NSE & BSE equities and indices, with **Zerodha Kite Connect** and
**Upstox** broker integration for real execution.

> ⚠️ **This is an educational/starter template, not financial advice.**
> Algorithmic trading carries real risk of capital loss. Paper trade
> thoroughly, understand SEBI/exchange rules, and validate the strategy
> yourself before connecting live capital. See [`RISK.md`](./RISK.md).

---

## What's inside

| Layer | Tech | What it does |
|---|---|---|
| `client/` | React 19 + Vite + Tailwind v4 + Recharts | Marketing site (hero, strategy explainer, live sample backtest, pricing, FAQ) + a dashboard (broker connect, live signals, interactive backtest panel) |
| `server/` | Node.js + Express | Auth (JWT + cookies), Zerodha Kite Connect OAuth + orders, Upstox OAuth, strategy engine (EMA/RSI + ATR-based sizing), backtest API |
| Data | JSON file store (`server/data/`) | Zero-dependency persistence for users, broker sessions, trade logs. Swap for Postgres before scaling — see `DEPLOYMENT.md`. |

## Project structure

```
algo-trade-platform/
├── client/                     React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/         Navbar, Footer
│   │   │   ├── marketing/      Hero, Features, StrategyExplainer, Pricing, FAQ, CTA...
│   │   │   ├── dashboard/      BrokerConnect, BacktestPanel, SignalsPanel, PortfolioOverview
│   │   │   └── common/         Button, Card, StatCard, Container, ProtectedRoute
│   │   ├── pages/               LandingPage, Login, Dashboard, NotFound
│   │   ├── context/             AuthContext
│   │   ├── services/            api.js (axios client)
│   │   └── index.css            Design tokens (Tailwind v4 @theme)
│   └── vite.config.js           Dev proxy: /api -> http://localhost:5000
│
├── server/                     Express backend
│   ├── src/
│   │   ├── config/env.js        Centralized env var loader
│   │   ├── db/database.js       Lightweight JSON file data store
│   │   ├── strategies/emaRsiCrossover.js   The actual trading logic
│   │   ├── services/            kiteService.js, upstoxService.js
│   │   ├── controllers/, routes/, middleware/
│   │   └── app.js
│   └── server.js                Entry point
│
├── package.json                 Root convenience scripts (npm run dev, etc.)
└── DEPLOYMENT.md                 Full deployment + GitHub instructions
```

## Quick start (local development)

**Prerequisites:** Node.js 18+ and npm.

```bash
# 1. Install all dependencies (root, client, server)
npm run install:all

# 2. Configure the backend
cp server/.env.example server/.env
# Edit server/.env — at minimum set JWT_SECRET and COOKIE_SECRET to random strings.
# Kite/Upstox keys are optional for paper/demo mode (see below).

# 3. Run both client and server together
npm run dev
```

This starts:
- Backend on **http://localhost:5000**
- Frontend on **http://localhost:5173** (proxies `/api/*` to the backend)

Open **http://localhost:5173** — the site, backtest panel, and live "signals"
work immediately using generated sample data, with **no broker connection
required**.

## Connecting a real broker (Zerodha Kite or Upstox)

The dashboard works in demo mode out of the box. To execute real orders:

### Zerodha Kite Connect
1. Subscribe to [Kite Connect](https://developers.kite.trade) (paid, billed by
   Zerodha, currently ~₹2,000/month).
2. Create an app, set its redirect URL to
   `http://localhost:5000/api/broker/kite/callback` (or your deployed backend
   URL + `/api/broker/kite/callback`).
3. Copy the API key + secret into `server/.env` as `KITE_API_KEY` /
   `KITE_API_SECRET`.
4. Log in to the dashboard, click **Connect** next to Zerodha Kite.

Kite access tokens expire daily (~7:30 AM IST) — users need to reconnect each
trading day, which is standard for all Kite Connect apps.

### Upstox (free API)
1. Create an app at [Upstox Developer](https://upstox.com/developer/apps).
2. Set the redirect URI to `http://localhost:5000/api/broker/upstox/callback`.
3. Copy the client ID/secret into `server/.env` as `UPSTOX_API_KEY` /
   `UPSTOX_API_SECRET`.
4. Connect from the dashboard.

## The strategy, in short

```
BUY  when  EMA(9) crosses above EMA(21)  AND  RSI(14) > 45
SELL when  EMA(9) crosses below EMA(21)  AND  RSI(14) < 55
Stop loss:  entry - 1.5 × ATR(14)
Target:     entry + 3.0 × ATR(14)
Position size: risk% of capital ÷ stop distance, capped by available cash
```

Full implementation: `server/src/strategies/emaRsiCrossover.js`. The same
module powers both the backtest endpoint and the "live" signal endpoint —
swap `server/src/utils/sampleData.js` for real Kite/Upstox historical data
once a broker is connected (see inline comments in
`server/src/controllers/strategy.controller.js`).

## Deployment & GitHub

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for:
- Step-by-step GitHub upload from VS Code
- Deploying the frontend to Vercel/Netlify
- Deploying the backend to Render/Railway
- Environment variable checklist for production

## License

MIT — use this as a starting point for your own strategy and platform.
