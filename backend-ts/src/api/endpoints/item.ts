import express from 'express';

import Item from '../models/Item.model';

const router = express.Router();

router.get('/', async (request, response) => {
  const items = await Item.findAll();
  return response.send(items);
});

router.post('/', async (request, response) => {
  const {
    title,
    description,
    complexity,
    column,
    assigneeId,
    organizationId,
  } = request.body;

  const item = await Item.create({
    title,
    description,
    complexity,
    column,
    assigneeId,
    organizationId,
  });
  return response.send(item);
});

router.get('/:itemId/', async (request, response) => {
  const {itemId} = request.params;
  const item = await Item.findByPk(itemId);
  return response.send(item);
});

router.put('/:itemId/', async (request, response) => {
  const {itemId} = request.params;
  const {
    title,
    description,
    complexity,
    column,
  } = request.body;

  const item = await Item.update({
      title,
      description,
      complexity,
      column,
    },
    { where: { id: itemId } }
  );

  return response.send(item);
});

router.delete('/:itemId/', async (request, response) => {
  const {itemId} = request.params;

  const item = await Item.findByPk(itemId);
  await item.destroy();

  return response.send();
});

export default router;
