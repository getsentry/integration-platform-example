import express from 'express';

import SentryInstallation from '../../models/SentryInstallation.model';
import User from '../../models/User.model';

const router = express.Router();

// The shape of your settings will depend on how you configure your schema
// This example coordinates with integration-schema.json
export type SchemaSettings = {
  title?: string;
  description?: string;
  userId?: string;
};

export type SentryField = {
  name: string;
  value: any;
};

export const convertSentryFieldsToDict = (fields: SentryField[]): SchemaSettings =>
  fields.reduce((acc: Record<string, any>, {name, value}) => {
    acc[name] = value;
    return acc;
  }, {});

router.post('/', async (request, response) => {
  // This endpoint will only be called if the 'alert-rule-action' is present in the schema.
  const {installationId: uuid} = request.body;
  const sentryInstallation = uuid
    ? await SentryInstallation.findOne({
        where: {uuid},
      })
    : null;
  if (!sentryInstallation) {
    return response.status(400).send({message: 'Invalid installation was provided'});
  }

  // Now we can validate the data we the user provided to our alert rule action
  // Sending a payload with the 'message' key will be surfaced to the user in Sentry
  // This stops the user from creating the alert, so it's a good way to bubble up relevant info.
  const alertRuleActionSettings = convertSentryFieldsToDict(request.body.fields);
  if (!alertRuleActionSettings.title || !alertRuleActionSettings.description) {
    return response.status(400).send({message: 'Title and description are required'});
  }
  if (alertRuleActionSettings.userId) {
    const user = await User.findOne({
      where: {
        id: alertRuleActionSettings.userId,
        organizationId: sentryInstallation.organizationId,
      },
    });
    if (!user) {
      return response.status(400).send({message: 'Selected user was not found'});
    }
  }

  console.info('Successfully validated Sentry alert rule');

  // In a real application, this payload can be used to configure in app notification settings, etc.
  // By sending a successful response code, we are allowing that alert to notify our app when it fires.
  response.sendStatus(200);
});

export default router;
