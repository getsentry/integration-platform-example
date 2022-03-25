import express from 'express';

import Organization from '../models/Organization.model';

const router = express.Router();

router.get('/', async (request, response) => {
  const organizations = await Organization.findAll();
  return response.send(organizations);
});

router.post('/', async (request, response) => {
  const {name, slug, externalSlug} = request.body;

  const organization = await Organization.create({name, slug, externalSlug});
  return response.send(organization);
});

router.get('/:organizationSlug/', async (request, response) => {
  const {organizationSlug} = request.params;
  const organization = await Organization.findOne({where: {organizationSlug: organizationSlug}});
  return response.send(organization);
});

router.put('/:organizationSlug/', async (request, response) => {
  const {organizationSlug} = request.params;
  const {name, externalSlug} = request.body;

  const organization = await Organization.update(
    {name, externalSlug},
    { where: { organizationSlug: organizationSlug } }
  );

  return response.send(organization);
});

router.delete('/:organizationSlug/', async (request, response) => {
  const {organizationSlug} = request.params;

  const organization = await Organization.findOne({where: {organizationSlug: organizationSlug}});
  await organization.destroy();

  return response.send();
});


export default router;
