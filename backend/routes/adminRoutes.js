import express from 'express';
import adminMiddleware from '../middleware/adminMiddleware.js';
import * as adminController from '../controllers/adminController.js';

const router = express.Router();

router.post('/login', adminController.adminLogin);
router.get('/logout', adminMiddleware, adminController.adminLogout);

router.get('/me', adminMiddleware, (req, res) => {
    res.send(req.admin);
});
router.post('/service', adminMiddleware, adminController.addService);
router.get('/services', adminMiddleware, adminController.getAllServices);
router.get('/users', adminMiddleware, adminController.getAllUsers);
router.get('/bookings', adminMiddleware, adminController.getAllBookings);
router.patch('/bookings/:id', adminMiddleware, adminController.updateBookingStatus);
router.delete('/services/:id', adminMiddleware, adminController.deleteService);
router.get('/user/:id', adminMiddleware, adminController.getUserDetails);

export default router;