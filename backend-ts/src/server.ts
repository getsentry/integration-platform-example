import express from 'express';
import {config} from 'dotenv';

config({debug: true});

const server = express();

server.get('/', (req, res) => res.sendStatus(200));

server.listen(process.env.BACKEND_PORT, () => {
  console.log(`Server started at http://localhost:${process.env.BACKEND_PORT}`);
});

export default server;
