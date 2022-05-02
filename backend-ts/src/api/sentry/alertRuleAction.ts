import express from 'express';

import Organization from '../../models/Organization.model';
import SentryInstallation from '../../models/SentryInstallation.model';

const router = express.Router();

const SEND_SENTRY_DEBUG_ERROR = false;

router.post('/', async (request, response) => {
  // This endpoint will only be called if the 'alert-rule-action' is present in the schema.
  const {installationId: uuid} = request.body;
  const sentryInstallation = await SentryInstallation.findOne({
    where: {uuid},
  });
  if (!sentryInstallation) {
    return response.sendStatus(404);
  }
  const organization = await Organization.findOne({
    where: {id: sentryInstallation.organizationId},
  });
  if (SEND_SENTRY_DEBUG_ERROR) {
    // Sending a payload with the 'message' key will be surfaced to the user in Sentry
    // This stops the user from creating the alert, so it's a good way to bubble up relevant info.
    return response.status(400).send({message: 'Could not verify the provided data!'});
  }
  const prettyPayload = request.body.fields.reduce(
    (acc: Record<string, string>, field: {name: string; value: string}) => {
      acc[field.name] = field.value;
      return acc;
    },
    {}
  );
  // In a real application, this payload can be used to configure in app notification settings, etc.
  console.info(
    `${organization.name} has created an alert in sentry with the following fields:
    \n\t${JSON.stringify(prettyPayload)}`
  );
  response.sendStatus(200);
});

export default router;
