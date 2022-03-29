import assert from 'assert';
import {Express} from 'express';
import request from 'supertest';

import createUser, {User} from '../factories/User.factory';
import {closeTestServer, createTestServer} from '../testutils';

const path = '/api/users/';

describe(path, () => {
  let server: Express;
  let users: User[];
  const userNames = ['Person 1', 'Person 2'];

  beforeEach(async () => {
    server = await createTestServer();
    users = await Promise.all(userNames.map(async name => await createUser({name})));
    jest.resetAllMocks();
  });

  afterAll(async () => await closeTestServer());

  it('handles GET', async () => {
    const response = await request(server).get(path);
    assert.equal(response.body.length, userNames.length);
    assert.equal(response.statusCode, 200);
  });

  it('handles POST', async () => {
    const response = await request(server).post(path).send({name: 'Person 4'});
    assert.equal(response.statusCode, 201);
  });

  it('handles PUT', async () => {
    const response = await request(server)
      .put(`${path}${users[0].id}`)
      .send({name: 'Person 5'});
    assert.equal(response.statusCode, 200);
    const user = await User.findByPk(users[0].id);
    assert.equal(user.name, 'Person 5');
  });

  it('handles DELETE', async () => {
    const response = await request(server).delete(`${path}${users[0].id}`);
    assert.equal(response.statusCode, 204);
    const user = await User.findByPk(users[0].id);
    assert(!user);
  });
});
