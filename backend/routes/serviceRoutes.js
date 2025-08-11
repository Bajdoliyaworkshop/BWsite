import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import * as serviceController from '../controllers/serviceController.js';

const router = express.Router();

router.post('/book', authMiddleware, serviceController.bookService);
router.get('/', serviceController.getAllServices);
// for canceling a service
router.delete('/cancel/:id', authMiddleware, serviceController.cancelService);

export default router;