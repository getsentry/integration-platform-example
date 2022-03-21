import {Column, DataType, ForeignKey, Model, Table} from 'sequelize-typescript';

import Organization from './Organization.model';
import User from './User.model';

export enum ItemColumn {
  Todo = 'TODO',
  Doing = 'DOING',
  Done = 'DONE',
}

@Table({tableName: 'item', underscored: true})
export default class Item extends Model {
  @Column
  title: string;

  @Column
  description: string;

  @Column
  complexity: number;

  @Column({type: DataType.ENUM({values: Object.keys(ItemColumn)})})
  column: ItemColumn;

  @ForeignKey(() => User)
  @Column
  assigneeId: number;

  @ForeignKey(() => Organization)
  @Column
  organizationId: number;
}
