import {Column, DataType, ForeignKey, Model, Table} from 'sequelize-typescript';

import SentryInstallation from './SentryInstallation.model';
import User from './User.model';

export enum ItemColumn {
  Todo = 'TODO',
  Doing = 'DOING',
  Done = 'DONE',
}

@Table({tableName: 'item'})
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

  @ForeignKey(() => SentryInstallation)
  @Column
  installationId: string;
}
