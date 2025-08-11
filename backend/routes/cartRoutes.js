import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import * as cartController from '../controllers/cartController.js';

const router = express.Router();

router.post('/add', authMiddleware, cartController.addToCart);
router.delete('/remove/:serviceId', authMiddleware, cartController.removeFromCart);
router.get('/', authMiddleware, cartController.getCart);

export default router;