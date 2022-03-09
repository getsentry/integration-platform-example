import apiRoutes from './api';
import express from 'express';

function createServer() {
  const server = express();
  server.use(express.json());
  server.get('/', (req, res) => res.sendStatus(200));
  server.use('/api', apiRoutes);
  return server;
}

export default createServer;
