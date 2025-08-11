import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import connectDB from './config/connectDB.js'
//import routes
import newsletterRoutes from './routes/newsletterRoutes.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import serviceRoutes from './routes/serviceRoutes.js'
import sendMessageRoute from './routes/sendMessageRoute.js'
// Initialize Express app
const app = express();
// CORS
const allowedOrigins = [
    'http://localhost:5173',
  'https://bajdoliyaworkshop.vercel.app',
  'https://bajdoliya-workshop.vercel.app',
  'https://car-service-silk-nu.vercel.app',
  'https://car-service-git-main-rajkumar-yogis-projects.vercel.app',
  'https://car-service-fouw3jqw6-rajkumar-yogis-projects.vercel.app',
];
app.use(cors({
    origin : process.env.CLIENT_URL || allowedOrigins.split(','),
    credentials: true
}));
// Middleware setup
app.set('trust proxy', 1);
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(compression());
app.use(morgan('dev')); // Logging middleware
app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for simplicity, adjust as needed
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));
// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);
// Custom middleware for logging requests
import { requestLogger } from './middleware/requestLogger.js';
app.use(requestLogger);
// Routes
app.get('/', (req, res) => res.send('Server is running'));
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/send-message', sendMessageRoute);
app.use((req, res, next) => {
  res.status(404).json({ message: 'Resource not found' });
});
// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server running locally at http://localhost:${PORT}`);
    })
})

export default app;