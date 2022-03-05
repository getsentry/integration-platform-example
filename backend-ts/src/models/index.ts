import {Sequelize} from 'sequelize';
import ItemsModelDefiner, {Items} from './Items.model';
import UsersModelDefiner, {Users} from './Users.model';

// Connect our ORM to the database.
// Since both we've containerized our server + database, we can use the default bridge network to connect them
const {POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, DB_CONTAINER} = process.env;
const sequelize = new Sequelize(
  `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${DB_CONTAINER}:5432/${POSTGRES_DB}`,
  {logging: false}
);

// Run our model definers
ItemsModelDefiner(sequelize);
UsersModelDefiner(sequelize);

// Describe their relationships
Users.hasMany(Items);

// Export the sequelize instance and models
export {sequelize, Users, Items};
export default sequelize;
