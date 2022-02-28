import express from 'express';
import path from 'path';
import {config} from 'dotenv';
import {Example} from './../../data/types';

// Load .env environment file from the project root
// We need to traverse up from /backend-ts/dist/server.js
config({path: path.resolve(__dirname, '../.env'), debug: true});
const port = process.env.BACKEND_PORT ?? 1234;

const server = express();

server.get('/', (req, res) => {
  res.send('Hello World!');
});

server.listen(port, () => {
  // TS Linting errors also work
  console.log(`Server started at http://localhost:${port}`);
});

export default server;
