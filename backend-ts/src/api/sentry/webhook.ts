import express from 'express';

import SentryInstallation from '../../models/SentryInstallation.model';
import {InstallResponseData} from './setup';

const router = express.Router();

router.post('/', async (req, res) => {
  const {action, data} = req.body;
  const resource = req.header('sentry-hook-resource');

  // Handle Uninstallation webhook...
  if (resource === 'installation' && action === 'deleted') {
    await handleUninstall(data.installation);
  }
  res.sendStatus(200);
});

async function handleUninstall(installData: InstallResponseData) {
  const installation = await SentryInstallation.findOne({
    where: {uuid: installData.uuid},
  });
  if (installation) {
    // This is where you could destroy any associated data you've created alongside the installation
    await installation.destroy();
    console.info(
      `Uninstalled ${installData.app.slug} from '${installData.organization.slug}'`
    );
  }
}

export default router;
