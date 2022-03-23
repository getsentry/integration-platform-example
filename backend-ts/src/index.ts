import {sequelize} from './models';
import createServer from './server';

sequelize
  .authenticate()
  .then(() => sequelize.sync())
  .then(() => {
    const server = createServer();
    server.listen(process.env.EXPRESS_LISTEN_PORT, () => {
      console.info(
        `Server started at http://localhost:${process.env.EXPRESS_LISTEN_PORT}`
      );
    });
  })
  .catch(e => console.error(`[🔌 DB Connection Error]: ${e.message}`));
