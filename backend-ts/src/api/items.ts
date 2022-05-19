import express from 'express';

import Item from '../models/Item.model';
import Organization from '../models/Organization.model';
import SentryAPIClient from '../util/SentryAPIClient';

const router = express.Router();

async function addSentryAPIData(
  organization: Organization & {items: Item[]}
): Promise<Item[]> {
  const sentry = await SentryAPIClient.create(organization);
  const res = await sentry.get('/projects/');
  console.log(res);
  return organization.items;
}

router.get('/', async (request, response) => {
  const {organization: slug} = request.query;
  if (slug) {
    const organization = await Organization.findOne({
      include: Item,
      where: {slug},
    });
    if (organization) {
      const items = await addSentryAPIData(organization);
      return response.send(items);
    }
  }
  const items = await Item.findAll();
  return response.send(items);
});

router.post('/', async (request, response) => {
  const {title, description, complexity, column, assigneeId, organizationId} =
    request.body;
  const item = await Item.create({
    title,
    description,
    complexity,
    column,
    assigneeId,
    organizationId,
  });
  return response.status(201).send(item);
});

router.put('/:itemId', async (request, response) => {
  const {title, description, complexity, column, assigneeId, organizationId} =
    request.body;
  const item = await Item.update(
    {
      title,
      description,
      complexity,
      column,
      assigneeId,
      organizationId,
    },
    {where: {id: request.params.itemId}}
  );
  return response.send(item);
});

router.delete('/:itemId', async (request, response) => {
  await Item.destroy({where: {id: request.params.itemId}});
  return response.sendStatus(204);
});

export default router;
