import express from 'express';

import {verifySentrySignature} from '../middleware';
import issueLinkRoutes from './issueLink';
import optionRoutes from './options';
import setupRoutes from './setup';
import webhookRoutes from './webhook';

const router = express.Router();

router.use('/setup', setupRoutes);
// We need to very that the request came from Sentry before we can...
// ...trust the webhook data.
router.use('/webhook', verifySentrySignature, webhookRoutes);
// ...allow queries to the options fields.
router.use('/options', verifySentrySignature, optionRoutes);
// ...allow links to be created between Sentry issues and our items.
router.use('/issue-link', verifySentrySignature, issueLinkRoutes);

export default router;
