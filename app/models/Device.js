const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Device name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format']
  },
  area: {
    areaType: {
      type: String,
      default: "Circle" 
    },
    center: {
      latitude: {
        type: Number,
        required: true,
        min: -90,
        max: 90
      },
      longitude: {
        type: Number,
        required: true,
        min: -180,
        max: 180
      },
      radius: {
        type: Number,
        required: true,
        min: 0
      }
    },
    civicAddress: {
      country: String,
      A1: String,
      A2: String
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  lastSeen: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

deviceSchema.index({ tenantId: 1, phoneNumber: 1 }, { unique: true });
deviceSchema.index({ tenantId: 1, status: 1 });

module.exports = mongoose.model('Device', deviceSchema);
