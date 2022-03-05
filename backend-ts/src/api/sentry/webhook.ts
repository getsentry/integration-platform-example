import express from 'express';
import {VerifyResponseData} from './setup';

const router = express.Router();

router.post('/', async (req, res) => {
  const {action, data} = req.body;

  // Handle Uninstallation webhook...
  if (action === 'deleted' && !!data.installation) {
    handleUninstall(data.installation);
  }

  res.sendStatus(200);
});

function handleUninstall(data: VerifyResponseData) {
  // In practice, this would be where you could remove the saved token/refreshToken
  // from your DB, or delete other information as clean up.
  console.info(`Uninstalled ${data.app.slug} from '${data.organization.slug}'`);
}

export default router;
