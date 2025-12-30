const express = require("express");
const router = express.Router();
const Device = require('../models/Device');
const { tenantMiddleware } = require('../middleware/tenantMiddleware');

// API Routes with tenant middleware
router.use('/api', tenantMiddleware);

router.get("/api", async (req, res, next) => {
  try {
    const devices = await Device.find({ tenantId: req.tenant._id }).sort({ lastSeen: -1 });
    res.json(devices);
  } catch (error) {
    next(error);
  }
});

router.post("/api", async (req, res, next) => {
  try {
    const deviceData = { ...req.body, tenantId: req.tenant._id };
    const device = new Device(deviceData);
    await device.save();
    res.status(201).json(device);
  } catch (error) {
    next(error);
  }
});

router.get("/api/:id", async (req, res, next) => {
  try {
    const device = await Device.findOne({ 
      _id: req.params.id, 
      tenantId: req.tenant._id 
    });
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }
    res.json(device);
  } catch (error) {
    next(error);
  }
});

// Web Routes (without tenant middleware for backward compatibility)
router.get("/", async (req, res, next) => {
    res.redirect("/panel");
});
  
router.get("/panel", async (req, res, next) => {
    res.render("control-panel.ejs", {
      msg: "",
    });
});

router.get("/searchDevice", async (req, res, next) => {
    try {
      const { phoneNumber } = req.query;
      const device = await Device.findOne({ phoneNumber });
      res.json(device || { message: 'Device not found' });
    } catch (error) {
      next(error);
    }
});

module.exports = router;
  