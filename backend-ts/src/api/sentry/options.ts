import express from 'express';

import Item from '../../models/Item.model';
import SentryInstallation from '../../models/SentryInstallation.model';

const router = express.Router();

type SentryOption = {
  label: string;
  value: string;
  default?: boolean;
};

router.get('/items', async (request, response) => {
  const {installationId: uuid} = request.query;
  const sentryInstallation = await SentryInstallation.findOne({
    where: {uuid},
  });
  if (!sentryInstallation) {
    return response.sendStatus(404);
  }
  const items = await Item.findAll({
    where: {organizationId: sentryInstallation.organizationId},
  });
  const result: SentryOption[] = items.map(item => ({
    label: item.title,
    value: item.id,
  }));
  console.info('Populating item options in Sentry');
  return response.send(result);
});

export default router;
