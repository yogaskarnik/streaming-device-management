const PORT = process.env.SERVER_PORT || 3000;
const express = require('express');
const path = require('path');
const sessions = require('express-session');
const helmet = require('helmet');
const connectDB = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { apiLimiter, nokiaApiLimiter } = require('./middleware/rateLimiter');
const DeviceMonitor = require('./services/DeviceMonitor');

const app = express();
const server = require('http').createServer(app);

// Connect to database
connectDB();

// Initialize real-time monitoring
const deviceMonitor = new DeviceMonitor(server);

// Security middleware
app.use(helmet());
app.use(apiLimiter);

// ImPORT routes of our app
const deviceRoutes = require('./routes/deviceRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// view engine setup and other configurations
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  sessions({
    secret: process.env.SESSION_SECRET || 'thisismysecrctekeyfhrgfgrfrty84fwir767',
    resave: false,
    saveUninitialized: false,
  })
);

// Import routes
const deviceRoutes = require('./routes/deviceRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'SportStream API v1.0', status: 'running' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.use('/api/devices', deviceRoutes);
app.use('/api/analytics', analyticsRoutes);

app.post('/api/location/retrieve', nokiaApiLimiter, async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number required' });
    }

    const axios = require('axios');
    const options = {
      method: 'POST',
      url: 'https://location-retrieval.p-eu.rapidapi.com/retrieve',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': process.env.NOKIA_API_KEY || '045a41f880msh934bba06750a7c5p137aadjsnd3cbc9a8e472',
        'X-RapidAPI-Host': 'location-retrieval.nokia.rapidapi.com',
      },
      data: {
        device: { phoneNumber },
        maxAge: '60',
      },
    };

    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    console.error('Location retrieval error:', error);
    res.status(500).json({ error: 'Failed to retrieve location' });
  }
});

app.get('/api/event-subscription', async (req, res) => {
  try {
    const axios = require('axios');
    const options = {
      method: 'GET',
      url: 'https://device-status.p-eu.rapidapi.com/event-subscriptions/045a41f880msh934bba06750a7c5p137aadjsnd3cbc9a8e472',
      headers: {
        'X-RapidAPI-Key': process.env.NOKIA_API_KEY || '4ed0e194d0mshff39531bdaec257p1136e1jsnd62933539b8d',
        'X-RapidAPI-Host': 'device-status.nokia.rapidapi.com',
      },
    };

    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    console.error('Event subscription error:', error);
    res.status(500).json({ error: 'Failed to get event subscription' });
  }
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

server.listen(PORT, (err) => {
  if (err) {
    console.error(`ERROR: Starting server ${err}`);
    process.exit(1);
  }
  console.log(`Server running on PORT ${PORT}`);
});
