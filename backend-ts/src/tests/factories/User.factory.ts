import {Attributes} from 'sequelize';

import {User} from '../../models';

export default async function createUser(fields: Partial<Attributes<User>>) {
  User.create({
    name: 'Leander',
    username: 'leeandher',
    avatar: 'https://example.com/avatar',
    ...fields,
  });
}
