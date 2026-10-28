import express from 'express';

import Organization from '../models/Organization.model';
import User from '../models/User.model';

const router = express.Router();

router.get('/', async (request, response) => {
  // Always scope users to a single organization so one tenant can never
  // list another tenant's users.
  const {organization: slug} = request.query;
  if (!slug) {
    return response
      .status(400)
      .send({message: "The 'organization' query parameter is required"});
  }
  const organization = await Organization.findOne({
    include: User,
    where: {slug},
  });
  if (!organization) {
    return response.sendStatus(404);
  }
  return response.send(organization.users);
});

router.post('/', async (request, response) => {
  const {name, username, avatar, organizationId} = request.body;
  const user = await User.create({name, username, avatar, organizationId});
  return response.status(201).send(user);
});

router.put('/:userId', async (request, response) => {
  const {name, username, avatar, organizationId} = request.body;
  const user = await User.update(
    {name, username, avatar, organizationId},
    {where: {id: request.params.userId}}
  );
  return response.send(user);
});

router.delete('/:userId', async (request, response) => {
  await User.destroy({where: {id: request.params.userId}});
  return response.sendStatus(204);
});

export default router;
