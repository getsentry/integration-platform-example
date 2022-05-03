import express from 'express';

import SentryInstallation from '../../models/SentryInstallation.model';

const router = express.Router();

router.post('/', async (request, response) => {
  // This endpoint will only be called if the 'alert-rule-action' is present in the schema.
  const {installationId: uuid} = request.body;
  const sentryInstallation = await SentryInstallation.findOne({
    where: {uuid},
  });
  if (!sentryInstallation) {
    // Sending a payload with the 'message' key will be surfaced to the user in Sentry
    // This stops the user from creating the alert, so it's a good way to bubble up relevant info.
    return response.status(400).send({message: 'Invalid installation was provided!'});
  }

  // In a real application, this payload can be used to configure in app notification settings, etc.
  // By sending a successful response code, we are allowing that alert to notify our app when it fires.
  console.info('An approved alert rule was successfully created/updated in Sentry');
  response.sendStatus(200);
});

export default router;
