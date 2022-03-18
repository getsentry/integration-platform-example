import express from 'express';

import {Items} from '../../models';

const router = express.Router();

router.get('/', async (req, res) => {
  const data = await Items.findAll();
  return res.send(data);
});

router.get('/:', async (req, res) => {
  const data = await Items.findAll();
  return res.send(data);
});

export default router;
