import express from 'express';

import itemsRoutes from './items';
import sentryRoutes from './sentry';

const router = express.Router();

router.use('/sentry', sentryRoutes);
router.use('/items', itemsRoutes);

export default router;
