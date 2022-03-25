import express from 'express';

import setupRoutes from './setup';
import webhookRoutes from './webhook';
import {verifySentrySignature} from '../../middleware/auth'

const router = express.Router();

router.use('/setup', setupRoutes);
router.use('/webhook', verifySentrySignature, webhookRoutes);

export default router;
