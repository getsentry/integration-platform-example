import {Column, DataType, Default, ForeignKey, Model, Table} from 'sequelize-typescript';

import Organization from './Organization.model';
import User from './User.model';

export enum ItemColumn {
  Todo = 'TODO',
  Doing = 'DOING',
  Done = 'DONE',
}

@Table({tableName: 'item', underscored: true, timestamps: false})
export default class Item extends Model {
  @Column
  title: string;

  @Column
  description: string;

  @Column
  complexity: number;

  @Default(false)
  @Column
  isIgnored: boolean;

  @Column
  sentryId: string;

  @Column({type: DataType.ENUM({values: Object.values(ItemColumn)})})
  column: ItemColumn;

  @ForeignKey(() => User)
  @Column
  assigneeId: number;

  @ForeignKey(() => Organization)
  @Column
  organizationId: number;
}
