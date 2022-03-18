import {Column, HasMany, Model, Table} from 'sequelize-typescript';

import Item from './Item.model';

@Table({tableName: 'user'})
export default class User extends Model {
  @Column
  name: string;

  @Column
  username: string;

  @Column
  avatar: number;

  @HasMany(() => Item)
  items: Item[];
}
