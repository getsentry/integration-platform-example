import {Sequelize} from 'sequelize';
import ItemsModelDefiner, {Items} from './Items.model';
import UsersModelDefiner, {Users} from './Users.model';

// Connect our ORM to the database.
const {POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB} = process.env;
const sequelize = new Sequelize(POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, {
  dialect: 'postgres',
  host: 'database', // Note: This must match the container name for the Docker bridge network to connect properly
  logging: false,
});

// Run our model definers
ItemsModelDefiner(sequelize);
UsersModelDefiner(sequelize);

// Describe their relationships
Users.hasMany(Items);

// Export the sequelize instance and models
export {sequelize, Users, Items};
export default sequelize;
