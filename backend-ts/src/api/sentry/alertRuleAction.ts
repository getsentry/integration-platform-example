import express from 'express';

import Item from '../../models/Item.model';
import SentryInstallation from '../../models/SentryInstallation.model';

const router = express.Router();

router.post('/', async (request, response) => {
  const {installationId: uuid} = request.body;
  const sentryInstallation = await SentryInstallation.findOne({
    where: {uuid},
  });
  return response.status(400).send({message: 'informative error from my app'});
  if (!sentryInstallation) {
    return response.send(404);
  }
  console.info('');
  return response.status(400).send('Not implemented');
});

export default router;
