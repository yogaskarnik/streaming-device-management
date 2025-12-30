const Device = require('../models/Device');

class AnalyticsService {
  async getDeviceStats() {
    const [totalDevices, activeDevices, inactiveDevices, maintenanceDevices] = await Promise.all([
      Device.countDocuments(),
      Device.countDocuments({ status: 'active' }),
      Device.countDocuments({ status: 'inactive' }),
      Device.countDocuments({ status: 'maintenance' })
    ]);
    
    return {
      total: totalDevices,
      active: activeDevices,
      inactive: inactiveDevices,
      maintenance: maintenanceDevices,
      activePercentage: totalDevices > 0 ? Math.round((activeDevices / totalDevices) * 100) : 0
    };
  }
  
  async getLocationDistribution() {
    const devices = await Device.find({ 'area.center': { $exists: true } });
    
    const locationGroups = {};
    devices.forEach(device => {
      const lat = Math.round(device.area.center.latitude);
      const lng = Math.round(device.area.center.longitude);
      const key = `${lat},${lng}`;
      
      locationGroups[key] = (locationGroups[key] || 0) + 1;
    });
    
    return Object.entries(locationGroups).map(([coords, count]) => {
      const [lat, lng] = coords.split(',').map(Number);
      return { lat, lng, count };
    });
  }
  
  async getDeviceActivity(hours = 24) {
    const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    const recentActivity = await Device.find({
      lastSeen: { $gte: startTime }
    }).sort({ lastSeen: -1 });
    
    const hourlyActivity = {};
    recentActivity.forEach(device => {
      const hour = new Date(device.lastSeen).getHours();
      hourlyActivity[hour] = (hourlyActivity[hour] || 0) + 1;
    });
    
    return hourlyActivity;
  }
  
  async getPerformanceMetrics() {
    const devices = await Device.find();
    const now = new Date();
    
    let onlineDevices = 0;
    let avgResponseTime = 0;
    
    devices.forEach(device => {
      const timeDiff = now - new Date(device.lastSeen);
      if (timeDiff < 5 * 60 * 1000) { // 5 minutes
        onlineDevices++;
      }
    });
    
    return {
      onlineDevices,
      totalDevices: devices.length,
      uptime: devices.length > 0 ? Math.round((onlineDevices / devices.length) * 100) : 0,
      avgResponseTime: Math.random() * 2000 + 500 // Simulated for now
    };
  }
}

module.exports = new AnalyticsService();
