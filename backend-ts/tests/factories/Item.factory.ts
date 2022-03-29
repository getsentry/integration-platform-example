import {Attributes} from 'sequelize';

import Item, {ItemColumn} from '../../src/models/Item.model';

export default async function createItem(fields?: Partial<Attributes<Item>>) {
  return Item.create({
    title: 'Error: Module not Found',
    description: 'Module was not found when loading application...',
    complexity: 3,
    column: ItemColumn.Todo,
    ...fields,
  });
}

export {Item, ItemColumn};
