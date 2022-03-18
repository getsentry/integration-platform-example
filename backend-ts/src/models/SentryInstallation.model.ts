import {Column, HasMany, Model, PrimaryKey, Table} from 'sequelize-typescript';

import Item from './Item.model';

@Table({tableName: 'sentry_installation'})
export default class SentryInstallation extends Model {
  @PrimaryKey
  @Column
  id: string;

  @Column
  orgSlug: string;

  @Column
  token: string;

  @Column
  refreshToken: string;

  @Column
  expiresAt: Date;

  @HasMany(() => Item)
  items: Item[];
}
