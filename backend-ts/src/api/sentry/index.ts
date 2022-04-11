import express from 'express';

import {verifySentrySignature} from '../middleware';
import setupRoutes from './setup';
import webhookRoutes from './webhook';

const router = express.Router();

router.use('/setup', setupRoutes);
// We need to verify that the request came from Sentry before we can trust the webhook data.
router.use('/webhook', verifySentrySignature, webhookRoutes);

export default router;
