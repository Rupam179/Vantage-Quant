/**
 * Upstox API v2 integration (alternative to Zerodha Kite Connect).
 * Upstox API access is free for retail developers, unlike Kite Connect.
 * Docs: https://upstox.com/developer/api-documentation/open-api
 *
 * Setup required by the user:
 *  1. Create an app at https://upstox.com/developer/apps
 *  2. Set redirect URI to match UPSTOX_REDIRECT_URL in your .env
 *  3. Copy API key (client_id) + API secret (client_secret) into .env
 */

const env = require('../config/env');
const db = require('../db/database');

const AUTH_BASE = 'https://api.upstox.com/v2/login/authorization/dialog';
const TOKEN_URL = 'https://api.upstox.com/v2/login/authorization/token';
const API_BASE = 'https://api.upstox.com/v2';

function getLoginUrl() {
  const params = new URLSearchParams({
    client_id: env.upstox.apiKey,
    redirect_uri: env.upstox.redirectUrl,
    response_type: 'code',
  });
  return `${AUTH_BASE}?${params.toString()}`;
}

async function exchangeCodeForToken(code) {
  const params = new URLSearchParams({
    code,
    client_id: env.upstox.apiKey,
    client_secret: env.upstox.apiSecret,
    redirect_uri: env.upstox.redirectUrl,
    grant_type: 'authorization_code',
  });

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: params.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upstox token exchange failed: ${res.status} ${text}`);
  }
  return res.json(); // { access_token, ... }
}

function saveSession(userId, session) {
  return db.brokerSessions.insert({
    user_id: userId,
    broker: 'upstox',
    access_token: session.access_token,
    refresh_token: null,
    broker_user_id: session.user_id || null,
  });
}

function getActiveSession(userId) {
  const sessions = db.brokerSessions.find((s) => s.user_id === userId && s.broker === 'upstox');
  if (!sessions.length) return null;
  return sessions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
}

async function apiGet(accessToken, path) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });
  if (!res.ok) throw new Error(`Upstox API error: ${res.status}`);
  return res.json();
}

const getPositions = (accessToken) => apiGet(accessToken, '/portfolio/short-term-positions');
const getHoldings = (accessToken) => apiGet(accessToken, '/portfolio/long-term-holdings');
const getFunds = (accessToken) => apiGet(accessToken, '/user/get-funds-and-margin');
const getProfile = (accessToken) => apiGet(accessToken, '/user/profile');

module.exports = {
  getLoginUrl,
  exchangeCodeForToken,
  saveSession,
  getActiveSession,
  getPositions,
  getHoldings,
  getFunds,
  getProfile,
};
