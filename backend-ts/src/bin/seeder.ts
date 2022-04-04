// eslint-disable-next-line import/no-named-as-default
import faker from '@faker-js/faker';

import {sequelize} from '../models';
import Item, {ItemColumn} from '../models/Item.model';
import Organization from '../models/Organization.model';
import User from '../models/User.model';

async function createSeedData(
  organizationCount: number,
  userCount: number,
  itemCount: number
) {
  await sequelize.sync({force: true});
  console.info(`Creating ${organizationCount} mock organization(s)...`);

  const futureOrganizations = [];
  for (let i = 0; i < organizationCount; i++) {
    const companyName = faker.company.companyName();
    futureOrganizations.push({
      name: companyName,
      slug: faker.helpers.slugify(companyName).toLowerCase(),
    });
  }
  const newOrganizations = await Organization.bulkCreate(futureOrganizations, {
    returning: true,
  });

  console.info(`Creating ${userCount} mock user(s)...`);

  const futureUsers = [];
  for (let i = 0; i < userCount; i++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    futureUsers.push({
      name: firstName + ' ' + lastName,
      username: faker.internet.email(firstName, lastName),
      avatar: faker.image.avatar(),
    });
  }
  const newUsers = await User.bulkCreate(futureUsers, {returning: true});

  console.info('Assigning user(s) to organization(s)...');
  newUsers.forEach(async user => {
    await faker.helpers.randomize(newOrganizations).$add('users', user);
  });

  console.info(`Creating ${itemCount} mock item(s)...`);

  const futureItems = [];
  for (let i = 0; i < itemCount; i++) {
    futureItems.push({
      title: `${faker.hacker.noun()}::${faker.hacker.verb()} - ${faker.system.fileName()}`,
      description: faker.hacker.phrase(),
      complexity: faker.helpers.randomize([1, 2, 3, 5, 8]),
      column: faker.helpers.randomize(Object.values(ItemColumn)),
      isIgnored: false,
    });
  }
  const newItems = await Item.bulkCreate(futureItems, {returning: true});

  console.info('Assigning item(s) to user(s) and organization(s)...');

  newItems.forEach(async item => {
    await faker.helpers.randomize(newOrganizations).$add('items', item);
    await faker.helpers.randomize(newUsers).$add('items', item);
  });
}

createSeedData(1, 4, 20)
  .then(() => {
    console.info('Finished seeding data.');
    console.info(
      'Note: SentryInstallations cannot be seeded, you must manually reinstall on Sentry.'
    );
  })
  .catch(e => console.error(`[🌱 Seeding Error]: ${e.message}`));
