import assert from 'assert';
import {Express} from 'express';
import request from 'supertest';

import createOrganization, {Organization} from '../factories/Organization.factory';
import {closeTestServer, createTestServer} from '../testutils';

const path = '/api/organizations/';

describe(path, () => {
  let server: Express;
  let organizations: Organization[];
  const organizationNames = ['Example 1', 'Example 2'];

  beforeEach(async () => {
    server = await createTestServer();
    organizations = await Promise.all(
      organizationNames.map(async name => await createOrganization({name}))
    );
    jest.resetAllMocks();
  });

  afterAll(async () => await closeTestServer());

  it('handles GET', async () => {
    const response = await request(server).get(path);
    assert.equal(response.body.length, organizationNames.length);
    assert.equal(response.statusCode, 200);
  });

  it('handles POST', async () => {
    const response = await request(server).post(path).send({name: 'Example 4'});
    assert.equal(response.statusCode, 201);
  });

  it('handles PUT', async () => {
    const response = await request(server)
      .put(`${path}${organizations[0].slug}`)
      .send({name: 'Example 5'});
    assert.equal(response.statusCode, 200);
    const organization = await Organization.findByPk(organizations[0].id);
    assert.equal(organization.name, 'Example 5');
  });

  it('handles DELETE', async () => {
    const response = await request(server).delete(`${path}${organizations[0].slug}`);
    assert.equal(response.statusCode, 204);
    const organization = await Organization.findByPk(organizations[0].id);
    assert(!organization);
  });
});
