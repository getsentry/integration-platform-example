import {config} from 'dotenv';
import {connectToDatabase, loadSeedData} from './util/db';

import createServer from './server';

config({debug: true});

const server = createServer();

connectToDatabase()
  .then(loadSeedData)
  .then(() => {
    server.listen(process.env.BACKEND_PORT, async () => {
      console.log(`Server started at http://localhost:${process.env.BACKEND_PORT}`);
    });
  });
