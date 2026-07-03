/**
 * EMA Crossover + RSI Filter Strategy
 * ------------------------------------
 * A trend-following intraday/swing strategy template commonly used as a
 * starting point for NSE/BSE equity & index algo strategies.
 *
 * LOGIC:
 *  - Fast EMA crosses above Slow EMA  + RSI > rsiBullThreshold  => BUY signal
 *  - Fast EMA crosses below Slow EMA  + RSI < rsiBearThreshold  => SELL/EXIT signal
 *  - Optional ATR-based stop loss & target for risk management
 *
 * This is an educational/template strategy. Past performance on historical
 * data does NOT guarantee future results. Always validate with your own
 * research, paper trading, and risk management before going live.
 */

function ema(values, period) {
  const k = 2 / (period + 1);
  const out = new Array(values.length).fill(null);
  let prevEma = null;
  for (let i = 0; i < values.length; i++) {
    if (values[i] === null || values[i] === undefined) continue;
    if (prevEma === null) {
      // seed with SMA of first `period` values
      if (i >= period - 1) {
        const slice = values.slice(i - period + 1, i + 1);
        prevEma = slice.reduce((a, b) => a + b, 0) / period;
        out[i] = prevEma;
      }
    } else {
      prevEma = values[i] * k + prevEma * (1 - k);
      out[i] = prevEma;
    }
  }
  return out;
}

function rsi(closes, period = 14) {
  const out = new Array(closes.length).fill(null);
  let gains = 0;
  let losses = 0;

  for (let i = 1; i < closes.length; i++) {
    const change = closes[i] - closes[i - 1];
    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? Math.abs(change) : 0;

    if (i <= period) {
      gains += gain;
      losses += loss;
      if (i === period) {
        const avgGain = gains / period;
        const avgLoss = losses / period;
        const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        out[i] = 100 - 100 / (1 + rs);
      }
      continue;
    }

    // Wilder's smoothing
    const prevAvgGain = gains / period;
    const prevAvgLoss = losses / period;
    const avgGain = (prevAvgGain * (period - 1) + gain) / period;
    const avgLoss = (prevAvgLoss * (period - 1) + loss) / period;
    gains = avgGain * period;
    losses = avgLoss * period;
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    out[i] = 100 - 100 / (1 + rs);
  }
  return out;
}

function atr(candles, period = 14) {
  const trs = candles.map((c, i) => {
    if (i === 0) return c.high - c.low;
    const prevClose = candles[i - 1].close;
    return Math.max(
      c.high - c.low,
      Math.abs(c.high - prevClose),
      Math.abs(c.low - prevClose)
    );
  });
  return ema(trs, period);
}

const DEFAULT_PARAMS = {
  fastPeriod: 9,
  slowPeriod: 21,
  rsiPeriod: 14,
  rsiBullThreshold: 45,
  rsiBearThreshold: 55,
  atrPeriod: 14,
  stopLossAtrMultiple: 1.5,
  targetAtrMultiple: 3,
};

/**
 * Generate signal series for an OHLC candle array.
 * candles: [{ date, open, high, low, close, volume }, ...] sorted ascending by date
 */
function generateSignals(candles, params = {}) {
  const p = { ...DEFAULT_PARAMS, ...params };
  const closes = candles.map((c) => c.close);
  const fastEma = ema(closes, p.fastPeriod);
  const slowEma = ema(closes, p.slowPeriod);
  const rsiSeries = rsi(closes, p.rsiPeriod);
  const atrSeries = atr(candles, p.atrPeriod);

  const signals = candles.map((c, i) => {
    let signal = 'HOLD';
    if (
      i > 0 &&
      fastEma[i] !== null &&
      slowEma[i] !== null &&
      fastEma[i - 1] !== null &&
      slowEma[i - 1] !== null &&
      rsiSeries[i] !== null
    ) {
      const crossedUp = fastEma[i - 1] <= slowEma[i - 1] && fastEma[i] > slowEma[i];
      const crossedDown = fastEma[i - 1] >= slowEma[i - 1] && fastEma[i] < slowEma[i];

      if (crossedUp && rsiSeries[i] > p.rsiBullThreshold) signal = 'BUY';
      else if (crossedDown && rsiSeries[i] < p.rsiBearThreshold) signal = 'SELL';
    }

    return {
      date: c.date,
      close: c.close,
      fastEma: fastEma[i],
      slowEma: slowEma[i],
      rsi: rsiSeries[i],
      atr: atrSeries[i],
      signal,
    };
  });

  return signals;
}

/**
 * Run a simple long/flat backtest using the generated signals.
 * Assumes one position at a time, full capital deployed per trade,
 * applies ATR-based stop loss / target, and brokerage+slippage cost.
 */
function backtest(candles, params = {}, capital = 100000) {
  const p = { ...DEFAULT_PARAMS, ...params };
  const signals = generateSignals(candles, p);

  const COST_PCT = 0.0006; // ~0.06% round-trip brokerage + slippage assumption

  let cash = capital;
  let position = null; // { entryPrice, qty, entryDate, stopLoss, target }
  const trades = [];
  const equityCurve = [];

  for (let i = 0; i < signals.length; i++) {
    const s = signals[i];
    const price = s.close;

    // Manage open position: check stop loss / target first
    if (position) {
      const hitStop = price <= position.stopLoss;
      const hitTarget = price >= position.target;
      const exitSignal = s.signal === 'SELL';

      if (hitStop || hitTarget || exitSignal) {
        const exitPrice = price;
        const grossPnl = (exitPrice - position.entryPrice) * position.qty;
        const cost = exitPrice * position.qty * COST_PCT;
        const netPnl = grossPnl - cost;
        cash += position.entryPrice * position.qty + netPnl;

        trades.push({
          entryDate: position.entryDate,
          exitDate: s.date,
          entryPrice: round2(position.entryPrice),
          exitPrice: round2(exitPrice),
          qty: position.qty,
          pnl: round2(netPnl),
          pnlPct: round2((netPnl / (position.entryPrice * position.qty)) * 100),
          exitReason: hitStop ? 'STOP_LOSS' : hitTarget ? 'TARGET' : 'SIGNAL_EXIT',
        });

        position = null;
      }
    }

    // Enter new position on BUY signal if flat
    if (!position && s.signal === 'BUY' && s.atr) {
      const riskAmount = capital * (p.riskPerTradePct ? p.riskPerTradePct / 100 : 0.015);
      const stopDistance = s.atr * p.stopLossAtrMultiple;
      const riskSizedQty = Math.floor(riskAmount / stopDistance);
      const cashSizedQty = Math.floor(cash / price);
      const qty = Math.max(0, Math.min(riskSizedQty, cashSizedQty));
      const cost = price * qty;

      if (qty > 0) {
        position = {
          entryDate: s.date,
          entryPrice: price,
          qty,
          stopLoss: price - stopDistance,
          target: price + s.atr * p.targetAtrMultiple,
        };
        cash -= cost;
      }
    }

    const markToMarket = position ? position.qty * price : 0;
    equityCurve.push({ date: s.date, equity: round2(cash + markToMarket) });
  }

  // Close any open position at the end using last available price
  if (position) {
    const lastPrice = candles[candles.length - 1].close;
    const grossPnl = (lastPrice - position.entryPrice) * position.qty;
    const cost = lastPrice * position.qty * COST_PCT;
    const netPnl = grossPnl - cost;
    cash += position.entryPrice * position.qty + netPnl;
    trades.push({
      entryDate: position.entryDate,
      exitDate: candles[candles.length - 1].date,
      entryPrice: round2(position.entryPrice),
      exitPrice: round2(lastPrice),
      qty: position.qty,
      pnl: round2(netPnl),
      pnlPct: round2((netPnl / (position.entryPrice * position.qty)) * 100),
      exitReason: 'END_OF_DATA',
    });
  }

  const finalEquity = cash;
  const totalReturnPct = round2(((finalEquity - capital) / capital) * 100);
  const wins = trades.filter((t) => t.pnl > 0);
  const losses = trades.filter((t) => t.pnl <= 0);
  const winRate = trades.length ? round2((wins.length / trades.length) * 100) : 0;
  const avgWin = wins.length ? round2(wins.reduce((a, t) => a + t.pnl, 0) / wins.length) : 0;
  const avgLoss = losses.length ? round2(losses.reduce((a, t) => a + t.pnl, 0) / losses.length) : 0;
  const profitFactor =
    losses.length && avgLoss !== 0
      ? round2(Math.abs(wins.reduce((a, t) => a + t.pnl, 0) / losses.reduce((a, t) => a + t.pnl, 0)))
      : null;

  const maxDrawdownPct = computeMaxDrawdown(equityCurve);

  return {
    params: p,
    capital,
    finalEquity: round2(finalEquity),
    totalReturnPct,
    totalTrades: trades.length,
    winRate,
    avgWin,
    avgLoss,
    profitFactor,
    maxDrawdownPct,
    trades,
    equityCurve,
  };
}

function computeMaxDrawdown(equityCurve) {
  let peak = -Infinity;
  let maxDd = 0;
  for (const point of equityCurve) {
    if (point.equity > peak) peak = point.equity;
    const dd = peak > 0 ? ((peak - point.equity) / peak) * 100 : 0;
    if (dd > maxDd) maxDd = dd;
  }
  return round2(maxDd);
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

module.exports = {
  ema,
  rsi,
  atr,
  generateSignals,
  backtest,
  DEFAULT_PARAMS,
};
