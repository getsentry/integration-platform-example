import express from 'express';

import {Item} from '../../models';

const router = express.Router();

router.get('/', async (req, res) => {
  const data = await Item.findAll();
  return res.send(data);
});

router.get('/:', async (req, res) => {
  const data = await Item.findAll();
  return res.send(data);
});

export default router;
