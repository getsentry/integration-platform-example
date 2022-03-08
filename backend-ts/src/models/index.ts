import {Sequelize} from 'sequelize';
import UsersModelDefiner, {Users} from 'src/models/Users.model';
import ItemsModelDefiner, {Items} from 'src/models/Items.model';
import SentryInstallationsDefiner, {
  SentryInstallations,
} from 'src/models/SentryInstallations.model';

// Connect our ORM to the database.
const {POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB} = process.env;
const sequelize = new Sequelize(POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, {
  dialect: 'postgres',
  host: 'database', // Note: This must match the container name for the Docker bridge network to connect properly
  logging: false,
});

// Run our model definers
UsersModelDefiner(sequelize);
ItemsModelDefiner(sequelize);
SentryInstallationsDefiner(sequelize);

// Describe their relationships
Users.hasMany(Items);

// Export the sequelize instance and models
export {sequelize, Users, Items, SentryInstallations};
export default sequelize;
