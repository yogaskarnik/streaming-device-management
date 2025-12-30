const express = require("express");
const path = require("path");
const router = express.Router();
const Device = require('../models/Device');

// API Routes
router.get("/api", async (req, res, next) => {
  try {
    const devices = await Device.find().sort({ lastSeen: -1 });
    res.json(devices);
  } catch (error) {
    next(error);
  }
});

router.post("/api", async (req, res, next) => {
  try {
    const device = new Device(req.body);
    await device.save();
    res.status(201).json(device);
  } catch (error) {
    next(error);
  }
});

router.get("/api/:id", async (req, res, next) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }
    res.json(device);
  } catch (error) {
    next(error);
  }
});

// Web Routes
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
  