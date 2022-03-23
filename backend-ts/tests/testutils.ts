import {sequelize} from '../src/models';
import createServer from '../src/server';

export const createTestServer = async () => {
  await sequelize.authenticate();
  await sequelize.sync({force: true});
  return createServer();
};

export const closeTestServer = async () => {
  await sequelize.close();
};
