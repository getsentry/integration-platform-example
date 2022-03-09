import express from 'express';
import sentryRoutes from './sentry';

const router = express.Router();

router.use('/sentry', sentryRoutes);

export default router;
