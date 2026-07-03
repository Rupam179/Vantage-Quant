/**
 * Generates deterministic, realistic-looking daily OHLC candles for demo
 * purposes (NIFTY 50, BANKNIFTY, and common large-cap symbols) so the
 * dashboard and backtest panel work out-of-the-box before a broker is
 * connected. Once Kite/Upstox is connected, real historical data from the
 * broker API should be used instead (see services/kiteService.js).
 */

function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function next() {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const BASE_PRICES = {
  NIFTY50: 23500,
  BANKNIFTY: 51200,
  RELIANCE: 2950,
  TCS: 3850,
  HDFCBANK: 1650,
  INFY: 1550,
  ICICIBANK: 1180,
};

function symbolSeed(symbol) {
  return symbol.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0) * 7919;
}

function generateCandles(symbol = 'NIFTY50', days = 260) {
  const base = BASE_PRICES[symbol] || 1000;
  const rand = seededRandom(symbolSeed(symbol));
  const cycleLength = 38 + Math.floor(rand() * 14); // one swing roughly every ~6-8 weeks

  const candles = [];
  let price = base * 0.9;
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - Math.ceil(days * 1.6) - 10); // generous buffer for weekends
  const cursor = new Date(start);
  let i = 0;

  while (cursor <= today) {
    if (cursor.getDay() !== 0 && cursor.getDay() !== 6) {
      // Oscillating trend: sine wave creates alternating bull/bear regimes,
      // so the EMA crossover strategy actually has crossovers to trade.
      const cyclePos = (i / cycleLength) * Math.PI * 2;
      const trendDrift = Math.sin(cyclePos) * (base * 0.0032);
      const spike = rand() < 0.08 ? (rand() - 0.5) * base * 0.018 : 0;
      const noise = (rand() - 0.5) * base * 0.0075 + spike;
      const change = trendDrift + noise;

      const open = price;
      const close = Math.max(1, open + change);
      const high = Math.max(open, close) + rand() * base * 0.004;
      const low = Math.max(1, Math.min(open, close) - rand() * base * 0.004);
      const volume = Math.floor(500000 + rand() * 4500000);

      candles.push({
        date: cursor.toISOString().slice(0, 10),
        open: round2(open),
        high: round2(high),
        low: round2(low),
        close: round2(close),
        volume,
      });

      price = close;
      i++;
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return candles.slice(-days);
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

module.exports = { generateCandles, BASE_PRICES };
