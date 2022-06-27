import {Attributes} from 'sequelize';

import User from '../../src/models/User.model';
import createOrganization from './Organization.factory';

export default async function createUser(
  fields: Partial<Attributes<User>> = {}
): Promise<User> {
  if (!fields.organizationId) {
    const organization = await createOrganization();
    fields.organizationId = organization.id;
  }
  return User.create({
    name: 'Name',
    username: 'username',
    avatar: 'https://example.com/avatar',
    ...fields,
  });
}
export {User};
