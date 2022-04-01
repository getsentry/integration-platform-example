import {Attributes} from 'sequelize';

import User from '../../src/models/User.model';
import createOrganization from './Organization.factory';

export default async function createUser(fields?: Partial<Attributes<User>>) {
  if (!fields.organization_id) {
    const organization = await createOrganization();
    fields.organizationId = organization.id;
  }
  return User.create({
    name: 'Leander',
    username: 'leeandher',
    avatar: 'https://example.com/avatar',
    ...fields,
  });
}
export {User};
