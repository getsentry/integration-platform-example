import createServer from '../server';
import sequelize from '../models';

export const createTestServer = async () => {
  await sequelize.authenticate();
  await sequelize.sync({force: true});
  return createServer();
};

export const closeTestServer = async () => {
  await sequelize.close();
};
