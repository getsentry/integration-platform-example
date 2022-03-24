import {Column, ForeignKey, HasMany, Model, Table} from 'sequelize-typescript';

import Item from './Item.model';
import Organization from './Organization.model';

@Table({tableName: 'user', underscored: true})
export default class User extends Model {
  @Column
  name: string;

  @Column
  username: string;

  @Column
  avatar: string;

  @HasMany(() => Item)
  items: Item[];

  @ForeignKey(() => Organization)
  @Column
  organizationId: number;
}
