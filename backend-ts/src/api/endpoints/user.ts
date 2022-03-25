import express from 'express';

import User from '../models/User.model';

const router = express.Router();

router.get('/', async (request, response) => {
  const users = await User.findAll();
  return response.send(users);
});

router.post('/', async (request, response) => {
  const {name, username, avatar} = request.body;

  const user = await User.create({name, username, avatar});
  return response.send(user);
});

router.get('/:userId/', async (request, response) => {
  const {userId} = request.params;
  const user = await User.findByPk(userId);
  return response.send(user);
});

router.put('/:userId/', async (request, response) => {
  const {userId} = request.params;
  const {name, username, avatar} = request.body;

  const user = await User.update({name, username, avatar}, { where: { id: userId } });

  return response.send(user);
});

router.delete('/:userId/', async (request, response) => {
  const {userId} = request.params;

  const user = await User.findByPk(userId);
  await user.destroy();

  return response.send();
});

export default router;
