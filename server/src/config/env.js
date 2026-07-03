require('dotenv').config();

function required(name, fallback = undefined) {
  const value = process.env[name] ?? fallback;
  return value;
}

const env = {
  port: Number(required('PORT', 5000)),
  nodeEnv: required('NODE_ENV', 'development'),
  clientUrl: required('CLIENT_URL', 'http://localhost:5173'),

  jwtSecret: required('JWT_SECRET', 'dev_insecure_secret_change_me'),
  jwtExpiresIn: required('JWT_EXPIRES_IN', '7d'),
  cookieSecret: required('COOKIE_SECRET', 'dev_insecure_cookie_secret'),

  kite: {
    apiKey: required('KITE_API_KEY', ''),
    apiSecret: required('KITE_API_SECRET', ''),
    redirectUrl: required('KITE_REDIRECT_URL', 'http://localhost:5000/api/broker/kite/callback'),
  },

  upstox: {
    apiKey: required('UPSTOX_API_KEY', ''),
    apiSecret: required('UPSTOX_API_SECRET', ''),
    redirectUrl: required('UPSTOX_REDIRECT_URL', 'http://localhost:5000/api/broker/upstox/callback'),
  },

  strategy: {
    defaultCapital: Number(required('DEFAULT_BACKTEST_CAPITAL', 100000)),
    riskPerTradePct: Number(required('RISK_PER_TRADE_PCT', 1.5)),
  },

  dbPath: required('DB_PATH', './data/algotrade.db'),
};

module.exports = env;
