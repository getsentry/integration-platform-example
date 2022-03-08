import sequelize from 'src/models';
import createServer from 'src/server';

sequelize
  .authenticate()
  .then(() => sequelize.sync())
  .then(async () => {
    const server = createServer();
    server.listen(process.env.EXPRESS_LISTEN_PORT, async () => {
      console.info(
        `Server started at http://localhost:${process.env.EXPRESS_LISTEN_PORT}`
      );
    });
  })
  .catch(e => console.error(`[🔌 DB Connection Error]: ${e.message}`));
