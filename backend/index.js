import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import connectDB from './config/connectDB.js';
import { requestLogger } from './middleware/requestLogger.js';

const app = express();

// CORS setup
const allowedOrigins = [
  'http://localhost:5173',
  'https://bajdoliyaworkshop.vercel.app',
  'https://bajdoliya-workshop.vercel.app',
  'https://car-service-silk-nu.vercel.app',
  'https://car-service-git-main-rajkumar-yogis-projects.vercel.app',
  'https://car-service-fouw3jqw6-rajkumar-yogis-projects.vercel.app',
];
app.use(cors({
  origin: process.env.CLIENT_URL || allowedOrigins,
  credentials: true
}));

// Middleware
app.set('trust proxy', 1);
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(compression());
app.use(morgan('dev'));
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

app.use(requestLogger);

// Routes
app.get('/', (req, res) => res.send('Server is running'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Local dev server only
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5001;
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running locally at http://localhost:${PORT}`);
    });
  });
}

// Export for Vercel serverless function
// export default app;
