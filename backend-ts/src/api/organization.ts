import express from 'express';

import Organization from '../models/Organization.model';

const router = express.Router();

router.get('/', async (req, res) => {
  const data = await Organization.findAll();
  return res.send(data);
});

export default router;
