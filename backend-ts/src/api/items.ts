import express from 'express';

import Item from '../models/Item.model';
import Organization from '../models/Organization.model';

const router = express.Router();

router.get('/', async (request, response) => {
  const data = await Item.findAll();
  const organizationSlug = request.query.organization;
  if (organizationSlug) {
    const organization = await Organization.findOne({
      where: {slug: organizationSlug},
    });
    if (organization) {
      const filteredData = data.filter(item => item.organizationId === organization.id);
      return response.send(filteredData);
    }
  }
  return response.send(data);
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
