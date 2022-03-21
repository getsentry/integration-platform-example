import {Column, HasMany, Model, Table} from 'sequelize-typescript';

import User from './User.model';
import SentryInstallation from './SentryInstallation.model';
import Item from './Item.model';

@Table({tableName: 'organization', underscored: true})
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
