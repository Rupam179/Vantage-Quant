const { backtest, generateSignals } = require('../strategies/emaRsiCrossover');
const { generateCandles, BASE_PRICES } = require('../utils/sampleData');
const kite = require('../services/kiteService');
const db = require('../db/database');
const env = require('../config/env');

const SUPPORTED_SYMBOLS = Object.keys(BASE_PRICES);

function listSymbols(req, res) {
  res.json({ symbols: SUPPORTED_SYMBOLS });
}

async function runBacktest(req, res, next) {
  try {
    const {
      symbol = 'NIFTY50',
      days = 260,
      capital = env.strategy.defaultCapital,
      fastPeriod,
      slowPeriod,
      rsiPeriod,
      stopLossAtrMultiple,
      targetAtrMultiple,
      riskPerTradePct,
    } = req.body || {};

    if (!SUPPORTED_SYMBOLS.includes(symbol)) {
      return res.status(400).json({ error: `Unsupported symbol. Choose from: ${SUPPORTED_SYMBOLS.join(', ')}` });
    }

    // NOTE: This uses generated sample data so the demo works without a
    // broker connection. To backtest on REAL historical data, swap this
    // line for kite.getHistoricalData(accessToken, instrumentToken, ...)
    // once the user has connected their Kite account.
    const candles = generateCandles(symbol, Number(days));

    const params = {
      fastPeriod: fastPeriod ? Number(fastPeriod) : undefined,
      slowPeriod: slowPeriod ? Number(slowPeriod) : undefined,
      rsiPeriod: rsiPeriod ? Number(rsiPeriod) : undefined,
      stopLossAtrMultiple: stopLossAtrMultiple ? Number(stopLossAtrMultiple) : undefined,
      targetAtrMultiple: targetAtrMultiple ? Number(targetAtrMultiple) : undefined,
      riskPerTradePct: riskPerTradePct ? Number(riskPerTradePct) : undefined,
    };
    Object.keys(params).forEach((k) => params[k] === undefined && delete params[k]);

    const result = backtest(candles, params, Number(capital));

    if (req.user) {
      db.backtestRuns.insert({
        user_id: req.user.id,
        symbol,
        strategy: 'ema_rsi_crossover',
        params: JSON.stringify(params),
        result_json: JSON.stringify(result),
      });
    }

    res.json({ symbol, candleCount: candles.length, ...result });
  } catch (err) {
    next(err);
  }
}

async function liveSignal(req, res, next) {
  try {
    const { symbol = 'NIFTY50' } = req.query;
    if (!SUPPORTED_SYMBOLS.includes(symbol)) {
      return res.status(400).json({ error: `Unsupported symbol. Choose from: ${SUPPORTED_SYMBOLS.join(', ')}` });
    }

    // Demo mode: derive a "live" signal from generated sample data.
    // Production: fetch the latest candles from Kite/Upstox historical or
    // quote API for `symbol`'s instrument token, then run generateSignals().
    const candles = generateCandles(symbol, 120);
    const signals = generateSignals(candles);
    const latest = signals[signals.length - 1];

    res.json({
      symbol,
      asOf: latest.date,
      signal: latest.signal,
      close: latest.close,
      fastEma: latest.fastEma,
      slowEma: latest.slowEma,
      rsi: latest.rsi,
      recent: signals.slice(-10),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { listSymbols, runBacktest, liveSignal };
