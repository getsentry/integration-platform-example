import express from 'express';
import path from 'path';
// TS hints work
import {Example} from '../../data/types';
import {config} from 'dotenv';

// Load .env environment file from the project root
// We need to traverse up from /backend-ts/dist/backend-ts/src/server.js
config({path: path.resolve(__dirname, '../../../../.env'), debug: true});

const app = express();

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.listen(process.env.BACKEND_PORT, () => {
  // Linting errors also work
  console.log(`Server started at http://localhost:${process.env.BACKEND_PORT}`);
});
