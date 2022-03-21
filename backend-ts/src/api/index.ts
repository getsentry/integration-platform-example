import express from 'express';

import organizationRoutes from './organization';
import sentryRoutes from './sentry';

const router = express.Router();

router.use('/sentry', sentryRoutes);
router.use('/organization', organizationRoutes);

export default router;
