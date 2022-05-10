import {createHmac} from 'crypto';
import {NextFunction, Request, Response} from 'express';

// This function will authenticate that the requests are coming from Sentry.
// Now, we can be confident in our nested routes that the data is legit,
// without having to repeat this check.
export default function verifySentrySignature(
  request: Request,
  response: Response,
  next: NextFunction
) {
  // TODO(Leander): Continue signature verification once partners have been notified of changes
  return next();
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
