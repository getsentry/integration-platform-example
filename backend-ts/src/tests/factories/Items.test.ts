import {Attributes} from 'sequelize';

import {Items} from '../../models';
import {Column} from '../../models/Items';

export default async (fields: Partial<Attributes<Items>>) =>
  Items.create({
    title: 'Error: Module not Found',
    description: 'Module was not found when loading application...',
    complexity: 3,
    column: Column.Todo,
    ...fields,
  });
