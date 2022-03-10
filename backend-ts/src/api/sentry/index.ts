import {createHmac} from 'crypto';
import express, {NextFunction, Request, Response} from 'express';

import setupRoutes from './setup';
import webhookRoutes from './webhook';

const router = express.Router();

// This function will authenticate that the requests are coming from Sentry.
// Now, we can be confident in our nested routes that the data is legit, without having to repeat this check.
// See more: https://docs.sentry.io/product/integrations/integration-platform/webhooks/
function verifySentrySignature(req: Request, res: Response, next: NextFunction) {
  if (process.env.NODE_ENV == 'test') {
    return next();
  }
  const hmac = createHmac('sha256', process.env.SENTRY_CLIENT_SECRET);
  hmac.update(JSON.stringify(req.body), 'utf8');
  const digest = hmac.digest('hex');
  console.log(digest);
  if (digest === req.headers['sentry-hook-signature']) {
    console.info('Verified: Request came from Sentry');
    return next();
  }
  res.status(401).send({error: 'Could not verify request came from Sentry'});
}

router.use('/setup', setupRoutes);
router.use('/webhook', verifySentrySignature, webhookRoutes);

export default router;
