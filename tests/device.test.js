const request = require('supertest');
const app = require('../app/index');
const Device = require('../app/models/Device');

describe('Device API', () => {
  beforeEach(async () => {
    await Device.deleteMany({});
  });

  describe('POST /api/devices/api', () => {
    it('should create a new device', async () => {
      const deviceData = {
        name: 'Test Device',
        phoneNumber: '+1234567890',
        area: {
          center: {
            latitude: 40.7128,
            longitude: -74.0060,
            radius: 1000
          }
        }
      };

      const response = await request(app)
        .post('/api/devices/api')
        .send(deviceData)
        .expect(201);

      expect(response.body.name).toBe(deviceData.name);
      expect(response.body.phoneNumber).toBe(deviceData.phoneNumber);
    });

    it('should return 400 for invalid phone number', async () => {
      const deviceData = {
        name: 'Test Device',
        phoneNumber: 'invalid',
        area: {
          center: {
            latitude: 40.7128,
            longitude: -74.0060,
            radius: 1000
          }
        }
      };

      await request(app)
        .post('/api/devices/api')
        .send(deviceData)
        .expect(400);
    });
  });

  describe('GET /api/devices/api', () => {
    it('should return all devices', async () => {
      await Device.create({
        name: 'Device 1',
        phoneNumber: '+1234567890',
        area: {
          center: {
            latitude: 40.7128,
            longitude: -74.0060,
            radius: 1000
          }
        }
      });

      const response = await request(app)
        .get('/api/devices/api')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('Device 1');
    });
  });
});
