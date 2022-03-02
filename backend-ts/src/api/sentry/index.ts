import express from 'express';
import setupRoutes from './setup';
import webhookRoutes from './webhook';

const router = express.Router();

router.use('/setup', setupRoutes);
router.use('/webhook', webhookRoutes);

export default router;
