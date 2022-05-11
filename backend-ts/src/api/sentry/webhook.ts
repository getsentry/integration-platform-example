import express, {Response} from 'express';

import Organization from '../../models/Organization.model';
import SentryInstallation from '../../models/SentryInstallation.model';
import alertHandler from './handlers/alertHandler';
import commentHandler from './handlers/commentHandler';
import issueHandler from './handlers/issueHandler';
import {InstallResponseData} from './setup';

const router = express.Router();

router.post('/', async (request, response) => {
  response.status(200);
  // Parse the JSON body fields off of the request
  const {action, data, installation} = request.body;
  const {uuid} = installation || {};

  // Identify the resource triggering the webhook in Sentry
  const resource = request.header('sentry-hook-resource');
  if (!action || !data || !uuid || !resource) {
    return response.sendStatus(400);
  }
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
    await issueHandler(response, action, sentryInstallation, data);
  }

  // Handle webhooks related to errors
  if (resource === 'error') {
    // The error.created webhook has an immense volume since it triggers on each event in Sentry.
    // If you're developing a public integration on SaaS, both you (the integration builder) and
    // the user installing your integration will require at least a Business plan to use them.
    // Keep this in mind while building on this webhook.
    response.status(200);
  }

  // Handle webhooks related to comments
  if (resource === 'comment') {
    const {actor} = request.body;
    await commentHandler(response, action, sentryInstallation, data, actor);
  }

  // Handle webhooks related to alerts
  if (resource === 'event_alert' || resource === 'metric_alert') {
    await alertHandler(response, resource, action, sentryInstallation, data);
  }

  // Handle uninstallation webhook
  if (resource === 'installation' && action === 'deleted') {
    await handleUninstall(response, data.installation);
  }

  // We can monitor what status codes we're sending from the integration dashboard
  response.send();
});

async function handleUninstall(
  response: Response,
  installData: InstallResponseData
): Promise<Response> {
  const installation = await SentryInstallation.findOne({
    where: {uuid: installData.uuid},
  });
  if (!installation) {
    return response.status(404);
  }
  // This is where you could destroy any associated data you've created alongside the installation
  const organization = await Organization.findByPk(installation.organizationId);
  organization.externalSlug = null;
  await organization.save();
  await installation.destroy();
  console.info(
    `Uninstalled ${installData.app.slug} from '${installData.organization.slug}'`
  );
  return response.status(204);
}

export default router;
