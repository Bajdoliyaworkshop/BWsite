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

// ===== Custom request logger =====
const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });
  next();
};

const app = express();
app.set('trust proxy', 1);

// ===== Security & Performance =====
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(requestLogger);

// ===== Rate Limiting =====
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// ===== CORS =====
const allowedOrigins = [
  'http://localhost:5173',
  'https://bajdoliyaworkshop.vercel.app',
  'https://bajdoliya-workshop.vercel.app',
  'https://car-service-silk-nu.vercel.app',
  'https://car-service-git-main-rajkumar-yogis-projects.vercel.app',
  'https://car-service-fouw3jqw6-rajkumar-yogis-projects.vercel.app'
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// ===== Routes =====
app.get('/', (req, res) => res.send('Server is running'));
app.use('/api/newsletter', require('./routes/newsletterRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/send-message', require('./routes/sendMessageRoute'));

// ===== Error Handling =====
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// ===== Connect to DB and start server =====
async function startServer() {
  try {
    await connectDB();
    console.log('Database connected');

    if (!process.env.VERCEL) {
      const PORT = process.env.PORT || 5001;
      app.listen(PORT, () => {
        console.log(`🚀 Server running locally at http://localhost:${PORT}`);
      });
    }
  } catch (err) {
    console.error('Database connection failed:', err);
  }
}

startServer();

if (process.env.VERCEL) {
  module.exports = serverless(app);
} else {
  module.exports = app;
}
