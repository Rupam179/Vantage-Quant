const express = require('express');
const { requireAuth } = require('../middleware/auth.middleware');
const ctrl = require('../controllers/broker.controller');

const router = express.Router();

// Zerodha Kite Connect
router.get('/kite/login', requireAuth, ctrl.kiteLogin);
router.get('/kite/callback', requireAuth, ctrl.kiteCallback);
router.get('/kite/status', requireAuth, ctrl.kiteStatus);
router.get('/kite/portfolio', requireAuth, ctrl.kitePortfolio);

// Upstox
router.get('/upstox/login', requireAuth, ctrl.upstoxLogin);
router.get('/upstox/callback', requireAuth, ctrl.upstoxCallback);
router.get('/upstox/status', requireAuth, ctrl.upstoxStatus);
router.get('/upstox/portfolio', requireAuth, ctrl.upstoxPortfolio);

module.exports = router;
