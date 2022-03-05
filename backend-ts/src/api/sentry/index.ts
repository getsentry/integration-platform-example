import express from 'express';
import setupRoutes from './setup';
import webhookRoutes from './webhook';

const router = express.Router();

router.use('/setup', setupRoutes);
router.use('/webhook', webhookRoutes);
router.get('/:installationId', (req, res) => {
  const {installationId} = req.params;
  // Make an API call with an associated token to test it's working
  // Then manually expire the token in Sentry and test that the refresh is issued
});

export default router;
