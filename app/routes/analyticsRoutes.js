const express = require('express');
const router = express.Router();
const AnalyticsService = require('../services/AnalyticsService');

// GET /api/analytics/stats - Device statistics
router.get('/stats', async (req, res, next) => {
  try {
    const stats = await AnalyticsService.getDeviceStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

// GET /api/analytics/locations - Location distribution
router.get('/locations', async (req, res, next) => {
  try {
    const locations = await AnalyticsService.getLocationDistribution();
    res.json(locations);
  } catch (error) {
    next(error);
  }
});

// GET /api/analytics/activity - Device activity over time
router.get('/activity', async (req, res, next) => {
  try {
    const hours = parseInt(req.query.hours) || 24;
    const activity = await AnalyticsService.getDeviceActivity(hours);
    res.json(activity);
  } catch (error) {
    next(error);
  }
});

// GET /api/analytics/performance - Performance metrics
router.get('/performance', async (req, res, next) => {
  try {
    const metrics = await AnalyticsService.getPerformanceMetrics();
    res.json(metrics);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
