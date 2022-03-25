import {createHmac} from 'crypto';
import {NextFunction, Request, Response} from 'express';


// This function will authenticate that the requests are coming from Sentry.
// Now, we can be confident in our nested routes that the data is legit, without having to repeat this check.
// See more: https://docs.sentry.io/product/integrations/integration-platform/webhooks/
export function verifySentrySignature(req: Request, res: Response, next: NextFunction) {
  if (process.env.NODE_ENV == 'test') {
    return next();
  }
  const hmac = createHmac('sha256', process.env.SENTRY_CLIENT_SECRET);
  hmac.update(JSON.stringify(req.body), 'utf8');
  const digest = hmac.digest('hex');
  if (digest === req.headers['sentry-hook-signature']) {
    console.info('Verified: Request came from Sentry');
    return next();
  }
  res.status(401).send({error: 'Could not verify request came from Sentry'});
}
