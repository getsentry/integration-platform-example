import express from 'express';

import {verifySentrySignature} from '../middleware';
import optionRoutes from './options';
import setupRoutes from './setup';
import webhookRoutes from './webhook';

const router = express.Router();

router.use('/setup', setupRoutes);
// We need to verify that the request came from Sentry before we can trust the webhook data.
router.use('/webhook', verifySentrySignature, webhookRoutes);
// We only allow verified sentry requests to query the form options
router.use('/options', verifySentrySignature, optionRoutes);

export default router;
