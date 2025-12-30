const WebSocket = require('ws');
const Device = require('../models/Device');

class DeviceMonitor {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map();
    this.deviceStatus = new Map();
    
    this.wss.on('connection', (ws, req) => {
      const clientId = this.generateClientId();
      this.clients.set(clientId, ws);
      
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          this.handleMessage(clientId, data);
        } catch (error) {
          ws.send(JSON.stringify({ error: 'Invalid message format' }));
        }
      });
      
      ws.on('close', () => {
        this.clients.delete(clientId);
      });
      
      ws.send(JSON.stringify({ type: 'connected', clientId }));
    });
    
    this.startMonitoring();
  }
  
  generateClientId() {
    return Math.random().toString(36).substr(2, 9);
  }
  
  handleMessage(clientId, data) {
    switch (data.type) {
      case 'subscribe':
        this.subscribeToDevice(clientId, data.deviceId);
        break;
      case 'unsubscribe':
        this.unsubscribeFromDevice(clientId, data.deviceId);
        break;
    }
  }
  
  subscribeToDevice(clientId, deviceId) {
    const client = this.clients.get(clientId);
    if (client) {
      client.deviceSubscriptions = client.deviceSubscriptions || new Set();
      client.deviceSubscriptions.add(deviceId);
    }
  }
  
  unsubscribeFromDevice(clientId, deviceId) {
    const client = this.clients.get(clientId);
    if (client && client.deviceSubscriptions) {
      client.deviceSubscriptions.delete(deviceId);
    }
  }
  
  async startMonitoring() {
    setInterval(async () => {
      try {
        const devices = await Device.find({ status: 'active' });
        
        for (const device of devices) {
          const currentStatus = {
            id: device._id,
            status: device.status,
            lastSeen: device.lastSeen,
            location: device.area?.center
          };
          
          const previousStatus = this.deviceStatus.get(device._id.toString());
          
          if (!previousStatus || this.hasStatusChanged(previousStatus, currentStatus)) {
            this.deviceStatus.set(device._id.toString(), currentStatus);
            this.broadcastDeviceUpdate(device._id.toString(), currentStatus);
          }
        }
      } catch (error) {
        console.error('Device monitoring error:', error);
      }
    }, 5000); // Check every 5 seconds
  }
  
  hasStatusChanged(previous, current) {
    return previous.status !== current.status ||
           previous.lastSeen !== current.lastSeen ||
           JSON.stringify(previous.location) !== JSON.stringify(current.location);
  }
  
  broadcastDeviceUpdate(deviceId, status) {
    this.clients.forEach((client) => {
      if (client.deviceSubscriptions && client.deviceSubscriptions.has(deviceId)) {
        client.send(JSON.stringify({
          type: 'deviceUpdate',
          deviceId,
          status
        }));
      }
    });
  }
}

module.exports = DeviceMonitor;
