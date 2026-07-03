/**
 * Zerodha Kite Connect integration.
 *
 * Setup required by the user (cannot be done by this code):
 *  1. Create a Kite Connect app at https://developers.kite.trade
 *     (requires an active Kite Connect subscription, billed by Zerodha).
 *  2. Set the app's redirect URL to match KITE_REDIRECT_URL in your .env.
 *  3. Copy the API key + API secret into your .env file.
 *
 * Flow:
 *  GET  /api/broker/kite/login     -> redirects user to Zerodha's login page
 *  GET  /api/broker/kite/callback  -> Zerodha redirects back with request_token,
 *                                      we exchange it for an access_token and
 *                                      store it against the logged-in user.
 *
 * IMPORTANT: access_token from Kite Connect is valid only until ~7:30 AM IST
 * the next day. Users must re-login daily, or you should add an automated
 * TOTP-based re-login (not included here for security reasons).
 */

const { KiteConnect } = require('kiteconnect');
const env = require('../config/env');
const db = require('../db/database');

function getClient(accessToken = null) {
  const kc = new KiteConnect({ api_key: env.kite.apiKey });
  if (accessToken) kc.setAccessToken(accessToken);
  return kc;
}

function getLoginUrl() {
  const kc = getClient();
  return kc.getLoginURL();
}

async function exchangeRequestToken(requestToken) {
  const kc = getClient();
  const session = await kc.generateSession(requestToken, env.kite.apiSecret);
  // session contains access_token, refresh_token, user_id, etc.
  return session;
}

function saveSession(userId, session) {
  return db.brokerSessions.insert({
    user_id: userId,
    broker: 'kite',
    access_token: session.access_token,
    refresh_token: session.refresh_token || null,
    broker_user_id: session.user_id,
  });
}

function getActiveSession(userId) {
  const sessions = db.brokerSessions.find((s) => s.user_id === userId && s.broker === 'kite');
  if (!sessions.length) return null;
  return sessions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
}

async function getProfile(accessToken) {
  const kc = getClient(accessToken);
  return kc.getProfile();
}

async function getPositions(accessToken) {
  const kc = getClient(accessToken);
  return kc.getPositions();
}

async function getHoldings(accessToken) {
  const kc = getClient(accessToken);
  return kc.getHoldings();
}

async function getMargins(accessToken) {
  const kc = getClient(accessToken);
  return kc.getMargins();
}

async function getHistoricalData(accessToken, instrumentToken, interval, fromDate, toDate) {
  const kc = getClient(accessToken);
  return kc.getHistoricalData(instrumentToken, interval, fromDate, toDate);
}

/**
 * Places a real order via Kite Connect. This sends a LIVE order to the
 * exchange when called with a valid access token and 'regular' product type.
 * Wrap any call site with explicit user confirmation + risk checks.
 */
async function placeOrder(accessToken, orderParams) {
  const kc = getClient(accessToken);
  // orderParams example:
  // { exchange: 'NSE', tradingsymbol: 'RELIANCE', transaction_type: 'BUY',
  //   quantity: 1, order_type: 'MARKET', product: 'MIS' }
  return kc.placeOrder('regular', orderParams);
}

module.exports = {
  getClient,
  getLoginUrl,
  exchangeRequestToken,
  saveSession,
  getActiveSession,
  getProfile,
  getPositions,
  getHoldings,
  getMargins,
  getHistoricalData,
  placeOrder,
};
