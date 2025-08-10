// backend/index.cjs
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const serverless = require('serverless-http');
const connectDB = require('./config/db');

// Initialize Express app
const app = express();
app.set('trust proxy', 1);

// Middleware setup
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS.split(','),
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// Custom request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });
  next();
});

// Connect to the database
connectDB().then(() => {
  console.log('Database connected successfully');
}).catch(err => {
  console.error('Database connection failed:', err);
});

// Routes
app.get('/', (req, res) => res.send('Server is running'));
app.use('/api/newsletter', require('./routes/newsletterRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/send-message', require('./routes/sendMessageRoute'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Export for Vercel & Local
if (process.env.VERCEL) {
  module.exports = serverless(app);
} else {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`🚀 Server running locally at http://localhost:${PORT}`);
  });
}

module.exports = app;
