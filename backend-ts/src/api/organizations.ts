import express from 'express';

import Organization from '../models/Organization.model';

const router = express.Router();

router.get('/', async (request, response) => {
  const data = await Organization.findAll();
  return response.send(data);
});

export default router;
