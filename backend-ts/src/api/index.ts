import express from 'express';
import setupRoutes from './setup';

const router = express.Router();

router.use('/setup', setupRoutes);

export default router;
