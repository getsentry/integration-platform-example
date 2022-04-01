import {createHmac} from 'crypto';
import express, {NextFunction, Request, Response} from 'express';

import setupRoutes from './setup';
import webhookRoutes from './webhook';

const router = express.Router();

// This function will authenticate that the requests are coming from Sentry.
// Now, we can be confident in our nested routes that the data is legit, without having to repeat this check.
// See more: https://docs.sentry.io/product/integrations/integration-platform/webhooks/
function verifySentrySignature(request: Request, response: Response, next: NextFunction) {
  if (process.env.NODE_ENV == 'test') {
    return next();
  }
  const hmac = createHmac('sha256', process.env.SENTRY_CLIENT_SECRET);

  hmac.update(JSON.stringify(request.body), 'utf8');
  const digest = hmac.digest('hex');
  if (digest === request.headers['sentry-hook-signature']) {
    console.info('Authorized: Verified request came from Sentry');
    return next();
  }
  console.info('Unauthorized: Could not verify request came from Sentry');
  response.sendStatus(401);
}

router.use('/setup', setupRoutes);
// We need to verify that the request came from Sentry before we can trust the webhook data.
router.use('/webhook', verifySentrySignature, webhookRoutes);

export default router;
