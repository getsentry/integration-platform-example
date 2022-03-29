import express from 'express';

import User from '../models/User.model';

const router = express.Router();

router.get('/', async (request, response) => {
  const data = await User.findAll();
  return response.send(data);
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
