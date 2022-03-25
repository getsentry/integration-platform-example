import express from 'express';

import itemRoutes from './item';
import organizationRoutes from './organization';
import userRoutes from './user';
import sentryRoutes from './sentry';

const router = express.Router();

router.use('/sentry', sentryRoutes);
router.use('/item', itemRoutes);
router.use('/organization', organizationRoutes);
router.use('/user', userRoutes);

export default router;
