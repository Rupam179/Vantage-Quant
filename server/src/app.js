const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const env = require('./config/env');
const { errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth.routes');
const brokerRoutes = require('./routes/broker.routes');
const strategyRoutes = require('./routes/strategy.routes');

const app = express();

// Trust reverse proxy headers (required on Render / Railway / Heroku)
app.set('trust proxy', 1);

// CORS — allow comma-separated CLIENT_URL list for multi-origin support
const allowedOrigins = env.clientUrl
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (curl, Postman, server-to-server)
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser(env.cookieSecret));
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

// Rate limiting on auth + broker endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth', apiLimiter);
app.use('/api/broker', apiLimiter);

// Health check — used by Render/Railway uptime checks
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'vantage-quant-api', time: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/broker', brokerRoutes);
app.use('/api/strategy', strategyRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

app.use(errorHandler);

module.exports = app;
