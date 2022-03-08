import {Attributes} from 'sequelize';

import {Users} from 'src/models';

export default async (fields: Partial<Attributes<Users>>) =>
  Users.create({
    name: 'Leander',
    username: 'leeandher',
    avatar: 'https://example.com/avatar',
    ...fields,
  });
