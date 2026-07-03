const kite = require('../services/kiteService');
const upstox = require('../services/upstoxService');
const env = require('../config/env');

// ---------- ZERODHA KITE ----------

function kiteLogin(req, res) {
  if (!env.kite.apiKey) {
    return res.status(400).json({
      error: 'Kite API key not configured. Add KITE_API_KEY and KITE_API_SECRET to your .env file.',
    });
  }
  const url = kite.getLoginUrl();
  res.redirect(url);
}

async function kiteCallback(req, res) {
  const { request_token, status } = req.query;
  if (status !== 'success' || !request_token) {
    return res.redirect(`${env.clientUrl}/dashboard?broker_error=kite_login_failed`);
  }
  try {
    const session = await kite.exchangeRequestToken(request_token);
    // req.user is populated by requireAuth middleware applied before this route
    kite.saveSession(req.user.id, session);
    res.redirect(`${env.clientUrl}/dashboard?broker_connected=kite`);
  } catch (err) {
    console.error('Kite callback error:', err.message);
    res.redirect(`${env.clientUrl}/dashboard?broker_error=kite_exchange_failed`);
  }
}

async function kiteStatus(req, res) {
  const session = kite.getActiveSession(req.user.id);
  res.json({ connected: Boolean(session), broker: 'kite' });
}

async function kitePortfolio(req, res, next) {
  try {
    const session = kite.getActiveSession(req.user.id);
    if (!session) return res.status(404).json({ error: 'Kite not connected yet.' });

    const [positions, holdings, margins] = await Promise.all([
      kite.getPositions(session.access_token),
      kite.getHoldings(session.access_token),
      kite.getMargins(session.access_token),
    ]);

    res.json({ positions, holdings, margins });
  } catch (err) {
    next(err);
  }
}

// ---------- UPSTOX ----------

function upstoxLogin(req, res) {
  if (!env.upstox.apiKey) {
    return res.status(400).json({
      error: 'Upstox API key not configured. Add UPSTOX_API_KEY and UPSTOX_API_SECRET to your .env file.',
    });
  }
  res.redirect(upstox.getLoginUrl());
}

async function upstoxCallback(req, res) {
  const { code } = req.query;
  if (!code) {
    return res.redirect(`${env.clientUrl}/dashboard?broker_error=upstox_login_failed`);
  }
  try {
    const session = await upstox.exchangeCodeForToken(code);
    upstox.saveSession(req.user.id, session);
    res.redirect(`${env.clientUrl}/dashboard?broker_connected=upstox`);
  } catch (err) {
    console.error('Upstox callback error:', err.message);
    res.redirect(`${env.clientUrl}/dashboard?broker_error=upstox_exchange_failed`);
  }
}

async function upstoxStatus(req, res) {
  const session = upstox.getActiveSession(req.user.id);
  res.json({ connected: Boolean(session), broker: 'upstox' });
}

async function upstoxPortfolio(req, res, next) {
  try {
    const session = upstox.getActiveSession(req.user.id);
    if (!session) return res.status(404).json({ error: 'Upstox not connected yet.' });

    const [positions, holdings, funds] = await Promise.all([
      upstox.getPositions(session.access_token),
      upstox.getHoldings(session.access_token),
      upstox.getFunds(session.access_token),
    ]);

    res.json({ positions, holdings, funds });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  kiteLogin,
  kiteCallback,
  kiteStatus,
  kitePortfolio,
  upstoxLogin,
  upstoxCallback,
  upstoxStatus,
  upstoxPortfolio,
};
