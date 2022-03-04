const { Sequelize, DataTypes } = require("sequelize");
const { faker } = require("@faker-js/faker");

const sequelize = new Sequelize(
  `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@localhost:5432/${process.env.POSTGRES_DB}`,
  { logging: false }
);

async function createSeedData(numUsers, numItems) {
  console.info("Defining Users table...");

  const Users = sequelize.define("Users", {
    name: { type: DataTypes.STRING },
    username: { type: DataTypes.STRING },
    avatar: { type: DataTypes.STRING },
  });

  console.info("Defining Items table...");

  const ITEM_COLUMNS = ["TODO", "DOING", "DONE"];
  const Items = sequelize.define("Items", {
    title: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
    complexity: { type: DataTypes.INTEGER },
    column: { type: DataTypes.ENUM(...ITEM_COLUMNS) },
  });
  Users.hasMany(Items);

  console.info("Overwriting existing tables...");

  await sequelize.sync({ force: true });

  console.info(`Creating mock ${numUsers} users...`);

  const futureUsers = [];
  for (let i = 0; i < numUsers; i++) {
    futureUsers.push({
      name: faker.name.findName(),
      username: faker.internet.userName(),
      avatar: faker.image.avatar(),
    });
  }
  const newUsers = await Users.bulkCreate(futureUsers, { returning: true });

  console.info(`Creating mock ${numItems} items...`);

  const futureItems = [];
  for (let i = 0; i < numItems; i++) {
    futureItems.push({
      title: `${faker.hacker.noun()}::${faker.hacker.verb()} - ${faker.system.fileName()}`,
      description: faker.hacker.phrase(),
      complexity: faker.helpers.randomize([1, 2, 3, 5, 8]),
      column: faker.helpers.randomize(ITEM_COLUMNS),
    });
  }
  const newItems = await Items.bulkCreate(futureItems, { returning: true });
  newItems.forEach(async (item) => {
    await faker.helpers.randomize(newUsers).addItem(item);
  });

  console.info("Finished seeding data. Exiting...");
}

createSeedData(4, 20);
