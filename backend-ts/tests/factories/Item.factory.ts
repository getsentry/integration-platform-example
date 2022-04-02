import {Attributes} from 'sequelize';

import Item, {ItemColumn} from '../../src/models/Item.model';
import createOrganization from './Organization.factory';
import createUser from './User.factory';

export default async function createItem(fields: Partial<Attributes<Item>> = {}) {
  if (!fields.organizationId) {
    const organization = await createOrganization();
    fields.organizationId = organization.id;
  }
  if (!fields.assigneeId) {
    const user = await createUser({organizationId: fields.organizationId});
    fields.assigneeId = user.id;
  }
  return Item.create({
    title: 'Error: Module not Found',
    description: 'Module was not found when loading application...',
    complexity: 3,
    column: ItemColumn.Todo,
    ...fields,
  });
}

export {Item, ItemColumn};
