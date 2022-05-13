import {createHmac} from 'crypto';
import {NextFunction, Request, Response} from 'express';

// There are few hacks in this verification step (denoted with HACK) that we at Sentry hope
// to migrate away from in the future. Presently however, for legacy reasons, they are
// necessary to keep around, so we've shown how to deal with them here.

function getSignatureBody(req: Request): string {
  const stringifiedBody = JSON.stringify(req.body);
  // HACK: This is necessary since express.json() converts the empty request body to {}
  return stringifiedBody === '{}' ? '' : stringifiedBody;
}

export default function verifySentrySignature(
  request: Request,
  response: Response,
  next: NextFunction
) {
  /**
   * This function will authenticate that the requests are coming from Sentry.
   * It allows us to be confident that all the code run after this middleware are
   * using verified data sent directly from Sentry.
   */
  if (process.env.NODE_ENV == 'test') {
    return next();
  }
  const hmac = createHmac('sha256', process.env.SENTRY_CLIENT_SECRET);

  hmac.update(getSignatureBody(request), 'utf8');
  const digest = hmac.digest('hex');
  if (
    // HACK: The signature header may be one of these two values
    digest === request.headers['sentry-hook-signature'] ||
    digest === request.headers['sentry-app-signature']
  ) {
    console.info('Authorized: Verified request came from Sentry');
    return next();
  }
  console.info('Unauthorized: Could not verify request came from Sentry');
  response.sendStatus(401);
}
