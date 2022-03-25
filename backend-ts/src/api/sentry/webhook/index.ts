import express from 'express';

import SentryInstallation from '../../../models/SentryInstallation.model';
import {InstallResponseData} from '../setup';
import issueHandler from './issueHandler';

const router = express.Router();

router.post('/', async (request, response) => {
  const {
    action,
    data,
    installation: {uuid},
  } = request.body;
  const resource = request.header('sentry-hook-resource');
  let statusCode = 200;

  // Retreive the associated SentryInstallation
  const sentryInstallation = await SentryInstallation.findOne({where: {uuid}});

  if (resource === 'issue') {
    statusCode = issueHandler(action, sentryInstallation, data);
  }

  // Handle Uninstallation webhook...
  if (resource === 'installation' && action === 'deleted') {
    await handleUninstall(data.installation);
    statusCode = 204;
  }

  // We can monitor these status codes on our integration dashboard
  response.sendStatus(statusCode);
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
