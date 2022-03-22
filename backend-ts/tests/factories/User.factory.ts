import {Attributes} from 'sequelize';

import User from '../../src/models/User.model';

export default async function createUser(fields: Partial<Attributes<User>>) {
  User.create({
    name: 'Leander',
    username: 'leeandher',
    avatar: 'https://example.com/avatar',
    ...fields,
  });
}
export {User};
