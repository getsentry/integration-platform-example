import express from 'express';
import {Example} from '../../data/types';
import {config} from 'dotenv';

// Load environment
config({path: '../../.env'});

const app = express();

app.get('/', (req, res) => {
  res.send('Hello wordasdfasdf!');
});

app.listen(process.env.BACKEND_PORT, () => {
  console.log(`Server started at http://localhost:${process.env.BACKEND_PORT}`);
});
