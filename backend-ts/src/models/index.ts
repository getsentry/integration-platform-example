import {config} from 'dotenv';
import path from 'path';
import {Sequelize} from 'sequelize-typescript';

const sequelizeConfig = {
  host: 'database', // Note: This must match the container name for the Docker bridge network to connect properly
  port: 5432,
};

// We modify the Sequelize config to point to our test-database
if (process.env.NODE_ENV === 'test') {
  config({path: path.resolve(__dirname, '../../../.env')});
  sequelizeConfig.host = '127.0.0.1';
  sequelizeConfig.port = parseInt(process.env.TEST_DB_PORT);
}

const {POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB} = process.env;

// Connect our ORM to the database.
const sequelize = new Sequelize(POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, {
  dialect: 'postgres',
  logging: false,
  models: [__dirname + '/**/*.model.ts'],
  ...sequelizeConfig,
});

export {sequelize};
