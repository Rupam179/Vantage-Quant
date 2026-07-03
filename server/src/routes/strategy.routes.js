const express = require('express');
const { listSymbols, runBacktest, liveSignal } = require('../controllers/strategy.controller');

const router = express.Router();

router.get('/symbols', listSymbols);
router.post('/backtest', runBacktest);
router.get('/signal', liveSignal);

module.exports = router;
