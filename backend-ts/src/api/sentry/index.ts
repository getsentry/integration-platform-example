import express, {Request, Response, NextFunction} from 'express';
import {createHmac} from 'crypto';
import {getRefreshedInstallation} from '../../util/tokens';
import setupRoutes from './setup';
import webhookRoutes from './webhook';
import axios from 'axios';

const router = express.Router();

// This function will authenticate that the requests are coming from Sentry.
// Now, we can be confident in our nested routes that the data is legit, without having to repeat this check.
// See more: https://docs.sentry.io/product/integrations/integration-platform/webhooks/
function verifySentrySignature(req: Request, res: Response, next: NextFunction) {
  const hmac = createHmac('sha256', process.env.SENTRY_CLIENT_SECRET);
  hmac.update(JSON.stringify(req.body), 'utf8');
  const digest = hmac.digest('hex');
  if (digest === req.headers['sentry-hook-signature']) {
    console.info('Verified: Request came from Sentry');
    return next();
  }
  res.status(401).send({error: 'Could not verify request came from Sentry'});
}

router.use('/setup', setupRoutes);
router.use('/webhook', verifySentrySignature, webhookRoutes);

// XXX(Leander): Dummy route used for testing installations talking to sentry
router.get('/:installationId', async (req, res) => {
  const {installationId} = req.params;
  // Make an API call with an associated token to test it's working
  const installation = await getRefreshedInstallation(installationId);
  // Then manually expire the token in Sentry and test that the refresh is issued
  const resp = await axios.get(`${process.env.SENTRY_URL}/api/0/issues/554/`, {
    headers: {
      Authorization: `Bearer ${installation.token}`,
    },
  });
  return res.send(resp.data);
});

export default router;
