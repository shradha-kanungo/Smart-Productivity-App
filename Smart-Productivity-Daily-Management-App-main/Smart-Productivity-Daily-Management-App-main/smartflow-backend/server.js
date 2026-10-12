const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow all for development
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
// Test Route
app.get('/', (req, res) => {
  res.json({ 
    message: 'SmartFlow API Running ✅',
    ip: 'http://192.168.1.7:5000',
    time: new Date().toISOString()
  });
});

// Health check for phone browser
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'SmartFlow API Running ✅' });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/events', require('./routes/events'));
app.use('/api/dashboard', require('./routes/dashboard'));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ msg: `Route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: 'Server Error', error: err.message });
});

// Jobs
require('./jobs/reminderJob');

// SINGLE LISTEN - This is the fix
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
      console.log(`✅ Local: http://localhost:${PORT}`);
      console.log(`✅ Network: http://192.168.1.7:${PORT}`);
      console.log(`✅ Test on phone: http://192.168.1.7:${PORT}/`);
      
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

