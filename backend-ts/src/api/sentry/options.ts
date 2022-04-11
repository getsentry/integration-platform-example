import express from 'express';

import Item from '../../models/Item.model';
import SentryInstallation from '../../models/SentryInstallation.model';

const router = express.Router();

type SentrySelectOption = {
  label: string;
  value: string;
  default?: boolean;
};

// This endpoint is used by FormFields in Sentry to populate the item options for the user to select.
router.get('/items', async (request, response) => {
  const {installationId: uuid} = request.query;
  const sentryInstallation = await SentryInstallation.findOne({
    where: {uuid},
  });
  if (!sentryInstallation) {
    return response.sendStatus(404);
  }
  // We can use the installation data to filter the items we return to Sentry.
  const items = await Item.findAll({
    where: {organizationId: sentryInstallation.organizationId},
  });
  // Sentry requires the results in this exact format.
  const result: SentrySelectOption[] = items.map(item => ({
    label: item.title,
    value: item.id,
  }));
  console.info('Populating item options in Sentry');
  return response.send(result);
});

export default router;
