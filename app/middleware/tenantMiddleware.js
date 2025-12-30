const Tenant = require('../models/Tenant');
const crypto = require('crypto');

const tenantMiddleware = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];
    const domain = req.headers['x-tenant-domain'];
    
    if (!apiKey && !domain) {
      return res.status(401).json({ error: 'API key or tenant domain required' });
    }
    
    let tenant;
    if (apiKey) {
      tenant = await Tenant.findOne({ apiKey, status: 'active' });
    } else if (domain) {
      tenant = await Tenant.findOne({ domain, status: 'active' });
    }
    
    if (!tenant) {
      return res.status(401).json({ error: 'Invalid tenant credentials' });
    }
    
    req.tenant = tenant;
    next();
  } catch (error) {
    next(error);
  }
};

const generateApiKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

module.exports = { tenantMiddleware, generateApiKey };
