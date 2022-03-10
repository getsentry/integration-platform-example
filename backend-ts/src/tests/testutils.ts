import {sequelize} from '../models';
import createServer from '../server';

export const createTestServer = async () => {
  await sequelize.authenticate();
  await sequelize.sync({force: true});
  return createServer();
};

export const closeTestServer = async () => {
  await sequelize.close();
};
