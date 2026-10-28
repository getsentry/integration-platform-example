import express from 'express';

import Item from '../models/Item.model';
import Organization from '../models/Organization.model';
import SentryAPIClient from '../util/SentryAPIClient';

const router = express.Router();

async function addSentryAPIData(
  organization: Organization & {items: Item[]}
): Promise<any[]> {
  // Create an APIClient to talk to Sentry
  const sentry = await SentryAPIClient.create(organization);
  return Promise.all(
    organization.items.map(async item => {
      if (item.sentryId) {
        // Use the numerical ID to fetch the short ID
        const sentryData = await sentry.get(`/organizations/${organization.externalSlug}/issues/${item.sentryId}/`);
        // Replace the numerical ID with the short ID
        const shortId = (sentryData || {})?.data?.shortId;
        if (shortId) {
          item.sentryId = shortId;
        }
        return item;
      }
      return item;
    })
  );
}

router.get('/', async (request, response) => {
  // Always scope items to a single organization so one tenant can never
  // list another tenant's items.
  const {organization: slug} = request.query;
  if (!slug) {
    return response
      .status(400)
      .send({message: "The 'organization' query parameter is required"});
  }
  const organization = await Organization.findOne({
    include: Item,
    where: {slug},
  });
  if (!organization) {
    return response.sendStatus(404);
  }
  return response.send(
    organization.items.some(item => !!item.sentryId)
      ? await addSentryAPIData(organization)
      : organization.items
  );
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
