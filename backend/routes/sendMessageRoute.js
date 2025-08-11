import express from 'express';
import { sendMessage } from '../controllers/sendMessageController.js';

const router = express.Router();

router.post('/send', sendMessage);

export default router;