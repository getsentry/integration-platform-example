import assert from 'assert';
import {Express} from 'express';
import request from 'supertest';

import createItem, {Item} from '../factories/Item.factory';
import createOrganization from '../factories/Organization.factory';
import {closeTestServer, createTestServer} from '../testutils';

const path = '/api/items/';

describe(path, () => {
  let server: Express;
  let items: Item[];
  const itemTitles = ['Error 1', 'Error 2'];

  beforeEach(async () => {
    server = await createTestServer();
    items = await Promise.all(itemTitles.map(async title => await createItem({title})));
    jest.resetAllMocks();
  });

  afterAll(async () => await closeTestServer());

  it('handles GET all', async () => {
    const response = await request(server).get(path);
    assert.equal(response.body.length, itemTitles.length);
    assert.equal(response.statusCode, 200);
  });

  it('handles GET by organization', async () => {
    const organization = await createOrganization({slug: 'example'});
    await createItem({title: 'Error 3', organizationId: organization.id});
    const response = await request(server).get(path).query({organization: 'example'});
    assert.equal(response.body.length, 1);
  });

  it('handles POST', async () => {
    const response = await request(server).post(path).send({title: 'Error 4'});
    assert.equal(response.statusCode, 201);
  });

  it('handles PUT', async () => {
    const response = await request(server)
      .put(`${path}${items[0].id}`)
      .send({title: 'Error 5'});
    assert.equal(response.statusCode, 200);
    const item = await Item.findByPk(items[0].id);
    assert.equal(item.title, 'Error 5');
  });

  it('handles DELETE', async () => {
    const response = await request(server).delete(`${path}${items[0].id}`);
    assert.equal(response.statusCode, 204);
    const item = await Item.findByPk(items[0].id);
    assert(!item);
  });
});
