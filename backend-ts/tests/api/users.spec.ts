import assert from 'assert';
import {Express} from 'express';
import request from 'supertest';

import createOrganization from '../factories/Organization.factory';
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

  it('handles GET by organization', async () => {
    const organization = await createOrganization({slug: 'example'});
    await createUser({name: 'Person 3', organizationId: organization.id});
    const response = await request(server).get(path).query({organization: 'example'});
    assert.equal(response.body.length, 1);
  });

  it('handles POST', async () => {
    const organization = await createOrganization();
    const response = await request(server)
      .post(path)
      .send({name: 'Person 4', organizationId: organization.id});
    assert.equal(response.statusCode, 201);
    assert(await User.findByPk(response.body.id));
    // Ensure relationships were properly set
    const organizationUsers = await organization.$get('users');
    assert.equal(organizationUsers.length, 1);
    assert.equal(organizationUsers[0].name, 'Person 4');
  });

  it('handles PUT', async () => {
    const organization = await createOrganization();
    const response = await request(server)
      .put(`${path}${users[0].id}`)
      .send({name: 'Person 5', organizationId: organization.id});
    assert.equal(response.statusCode, 200);
    const user = await User.findByPk(users[0].id);
    assert.equal(user.name, 'Person 5');
    // Ensure relationships were properly set
    const organizationUsers = await organization.$get('users');
    assert.equal(organizationUsers.length, 1);
    assert.equal(organizationUsers[0].name, user.name);
  });

  it('handles DELETE', async () => {
    const response = await request(server).delete(`${path}${users[0].id}`);
    assert.equal(response.statusCode, 204);
    const user = await User.findByPk(users[0].id);
    assert(!user);
  });
});
