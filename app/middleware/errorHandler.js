const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: 'Invalid input data' });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  
  if (err.code === 11000) {
    return res.status(409).json({ error: 'Resource already exists' });
  }
  
  res.status(500).json({ error: 'Internal server error' });
};

const notFound = (req, res) => {
  res.status(404).json({ error: 'Route not found' });
};

module.exports = { errorHandler, notFound };
