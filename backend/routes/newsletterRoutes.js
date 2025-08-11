import express from 'express';
import { Router } from 'express';
import { subscribe, verify } from '../controllers/newsletterController.js';

const newsletterRoutes = Router()

newsletterRoutes.post('/', subscribe);
newsletterRoutes.get('/verify/:token', verify);

export default newsletterRoutes;