const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tenant name is required'],
    unique: true,
    trim: true
  },
  domain: {
    type: String,
    required: [true, 'Domain is required'],
    unique: true,
    lowercase: true
  },
  apiKey: {
    type: String,
    required: true,
    unique: true
  },
  settings: {
    maxDevices: {
      type: Number,
      default: 100
    },
    features: [{
      type: String,
      enum: ['location-tracking', 'qos-management', 'notifications', 'analytics']
    }],
    nokiaApiConfig: {
      apiKey: String,
      rateLimit: {
        type: Number,
        default: 10
      }
    }
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'trial'],
    default: 'trial'
  }
}, {
  timestamps: true
});

tenantSchema.index({ domain: 1 });
tenantSchema.index({ apiKey: 1 });

module.exports = mongoose.model('Tenant', tenantSchema);
