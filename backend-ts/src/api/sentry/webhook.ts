import express from 'express';

import {SentryInstallations} from '../../models/SentryInstallations';
import {VerifyResponseData} from './setup';

const router = express.Router();

router.post('/', async (req, res) => {
  const {action, data} = req.body;

  // Handle Uninstallation webhook...
  if (action === 'deleted' && !!data.installation) {
    await handleUninstall(data.installation);
  }

  res.sendStatus(200);
});

async function handleUninstall(data: VerifyResponseData) {
  const installation = await SentryInstallations.findByPk(data.uuid);
  if (installation) {
    // This is where you could destroy any associated data you've created alongside the installation
    await installation.destroy();
    console.info(`Uninstalled ${data.app.slug} from '${data.organization.slug}'`);
  }
}

export default router;
