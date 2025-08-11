import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import * as userController from '../controllers/userController.js';

const router = express.Router();

router.get('/profile', authMiddleware, userController.getProfile);
router.patch('/profile', authMiddleware, userController.updateProfile);
router.post('/cars', authMiddleware, userController.addCar);
router.get('/bookings', authMiddleware, userController.getMyBookings);

export default router;