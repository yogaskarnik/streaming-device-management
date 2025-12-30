# Technical Architecture Guide

## System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Client    │────│   Express.js    │────│    MongoDB      │
│   (Frontend)    │    │   (Backend)     │    │   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                       ┌─────────────────┐
                       │   Nokia APIs    │
                       │ (External APIs) │
                       └─────────────────┘
```

## Technology Stack
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Frontend**: HTML5 + JavaScript + Leaflet.js
- **External APIs**: Nokia Network API
- **Containerization**: Docker + Docker Compose

## Key Components

### 1. Device Management (`/app/models/Device.js`)
- Device registration and tracking
- Status monitoring
- Location services

### 2. QoS Management (`/app/public/qos-on-demand.html`)
- Dynamic bandwidth allocation
- Area-based network optimization
- Predictive resource management

### 3. Geo-Tracking (`/app/public/device-locator.html`)
- Real-time location retrieval
- Location verification
- Map-based visualization

### 4. Notification System (`/app/public/notifications.html`)
- Device-specific messaging
- Broadcast capabilities
- Status alerts

## API Endpoints
```
GET  /devices          - List all devices
POST /devices          - Add new device
PUT  /devices/:id      - Update device
DELETE /devices/:id    - Remove device
POST /notifications    - Send notification
GET  /location/:id     - Get device location
```

## Database Schema
```javascript
Device: {
  id: String,
  name: String,
  location: { lat: Number, lng: Number },
  status: String,
  lastSeen: Date
}

Stadium: {
  id: String,
  name: String,
  capacity: Number,
  location: { lat: Number, lng: Number }
}
```

## Security Considerations
- API key management via environment variables
- Session-based authentication
- Input validation required
- HTTPS enforcement needed
