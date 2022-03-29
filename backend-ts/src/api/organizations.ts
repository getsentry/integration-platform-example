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

router.put('/:organizationSlug', async (request, response) => {
  const {name, slug, externalSlug} = request.body;
  const organization = await Organization.update(
    {name, slug, externalSlug},
    {where: {slug: request.params.organizationSlug}}
  );
  return response.send(organization);
});

router.delete('/:organizationSlug', async (request, response) => {
  await Organization.destroy({where: {slug: request.params.organizationSlug}});
  return response.sendStatus(204);
});

export default router;
