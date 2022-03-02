import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/', (req, res) => {
  const {code, installationId, orgSlug} = req.query;

  const payload = {
    grant_type: 'authorization_code',
    code,
    client_id: process.env.SENTRY_CLIENT_ID,
    client_secret: process.env.SENTRY_CLIENT_SECRET,
  };

  res.send({working: false});
});

export default router;
