import {Attributes} from 'sequelize';

import {Item} from '../../models';
import {ItemColumn} from '../../models/Item.model';

export default async (fields: Partial<Attributes<Item>>) =>
  Item.create({
    title: 'Error: Module not Found',
    description: 'Module was not found when loading application...',
    complexity: 3,
    column: ItemColumn.Todo,
    ...fields,
  });
