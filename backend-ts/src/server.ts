import express from 'express';

function createServer() {
  const server = express();
  server.get('/', (req, res) => res.sendStatus(200));
  return server;
}

export default createServer;
