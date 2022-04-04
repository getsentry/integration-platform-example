import {Column, HasMany, Model, Table} from 'sequelize-typescript';

import Item from './Item.model';
import SentryInstallation from './SentryInstallation.model';
import User from './User.model';

@Table({tableName: 'organization', underscored: true, timestamps: false})
export default class Organization extends Model {
  @Column
  name: string;

  @Column
  slug: string;

  @Column
  externalSlug: string;

  @HasMany(() => User)
  users: User[];

  @HasMany(() => Item)
  items: Item[];

  @HasMany(() => SentryInstallation)
  sentryInstallations: SentryInstallation[];
}
