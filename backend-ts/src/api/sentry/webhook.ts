import express from 'express';

import Organization from '../../models/Organization.model';
import SentryInstallation from '../../models/SentryInstallation.model';
import issueHandler from './handlers/issueHandler';
import {InstallResponseData} from './setup';

const router = express.Router();

router.post('/', async (request, response) => {
  let statusCode = 200;
  // Parse the JSON body fields off of the request
  const {
    action,
    data,
    installation: {uuid},
  } = request.body;
  // Identify the resource triggering the webhook in Sentry
  const resource = request.header('sentry-hook-resource');
  console.info(`Received '${resource}.${action}' webhook from Sentry`);

  // If there is no associated installation, ignore the webhook
  // Note: We can drop webhooks without installations because we specified a
  //       Redirect URL on our Sentry Integration, so setup.ts handles it.
  //       If we didn't set the Redirect URL we'd have to handle it here by
  //       creating an installation for 'installation.created' webhoooks.
  //       e.g. if (resource === 'installation' && action === 'created') { createSentryInstallation(...); }
  const sentryInstallation = await SentryInstallation.findOne({where: {uuid}});
  if (!sentryInstallation) {
    return response.sendStatus(404);
  }

  // Handle webhooks related to issues
  if (resource === 'issue') {
    statusCode = issueHandler(action, sentryInstallation, data);
  }

  // Handle uninstallation webhook
  if (resource === 'installation' && action === 'deleted') {
    statusCode = await handleUninstall(data.installation);
  }

  // We can monitor these status codes on our integration dashboard
  response.sendStatus(statusCode);
});

async function handleUninstall(installData: InstallResponseData): Promise<number> {
  const installation = await SentryInstallation.findOne({
    where: {uuid: installData.uuid},
  });
  if (!installation) {
    return 404;
  }
  // This is where you could destroy any associated data you've created alongside the installation
  const organization = await Organization.findByPk(installation.organizationId);
  organization.externalSlug = null;
  await organization.save();
  await installation.destroy();
  console.info(
    `Uninstalled ${installData.app.slug} from '${installData.organization.slug}'`
  );

  return 204;
}

export default router;
