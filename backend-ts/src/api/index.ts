import express from 'express';

import itemRoutes from './item';
import organizationRoutes from './organization';
import sentryRoutes from './sentry';

const router = express.Router();

router.use('/sentry', sentryRoutes);
router.use('/organization', organizationRoutes);
router.use('/item', itemRoutes);

export default router;
