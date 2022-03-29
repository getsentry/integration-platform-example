import express from 'express';

import Organization from '../models/Organization.model';

const router = express.Router();

router.get('/', async (request, response) => {
  const data = await Organization.findAll();
  return response.send(data);
});

router.post('/', async (request, response) => {
  const {name, slug, externalSlug} = request.body;
  const organization = await Organization.create({name, slug, externalSlug});
  return response.status(201).send(organization);
});

router.put('/:organizationId', async (request, response) => {
  const {name, slug, externalSlug} = request.body;
  const organization = await Organization.update(
    {name, slug, externalSlug},
    {where: {id: request.params.organizationId}}
  );
  return response.send(organization);
});

router.delete('/:organizationId', async (request, response) => {
  await Organization.destroy({where: {id: request.params.organizationId}});
  return response.sendStatus(204);
});

export default router;
