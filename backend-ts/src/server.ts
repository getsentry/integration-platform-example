import express from 'express';

import apiRoutes from './api';

function createServer() {
  const server = express();
  server.use(express.json());
  server.get('/', (req, res) => res.sendStatus(200));
  server.use('/api', apiRoutes);
  return server;
}

export default createServer;
