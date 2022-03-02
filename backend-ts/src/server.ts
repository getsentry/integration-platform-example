import apiRoutes from './api';
import express from 'express';

function createServer() {
  const server = express();
  server.get('/', (req, res) => res.sendStatus(200));
  server.use('/api', apiRoutes)
  return server;
}

export default createServer;
