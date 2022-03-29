import assert from 'assert';
import {Express} from 'express';
import request from 'supertest';

import createItem, {Item} from '../factories/Item.factory';
import createOrganization from '../factories/Organization.factory';
import createUser from '../factories/User.factory';
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
    const user = await createUser();
    const organization = await createOrganization();
    const response = await request(server)
      .post(path)
      .send({title: 'Error 4', organizationId: organization.id, assigneeId: user.id});
    assert.equal(response.statusCode, 201);
    assert(await Item.findByPk(response.body.id));
    // Ensure relationships were properly set
    const userItems = await user.$get('items');
    assert.equal(userItems.length, 1);
    assert.equal(userItems[0].title, 'Error 4');
    const organizationItems = await organization.$get('items');
    assert.equal(organizationItems.length, 1);
    assert.equal(organizationItems[0].title, 'Error 4');
  });

  it('handles PUT', async () => {
    const user = await createUser();
    const organization = await createOrganization();
    const response = await request(server)
      .put(`${path}${items[0].id}`)
      .send({title: 'Error 5', organizationId: organization.id, assigneeId: user.id});
    assert.equal(response.statusCode, 200);
    const item = await Item.findByPk(items[0].id);
    assert.equal(item.title, 'Error 5');
    // Ensure relationships were properly set
    const userItems = await user.$get('items');
    assert.equal(userItems.length, 1);
    assert.equal(userItems[0].title, 'Error 5');
    const organizationItems = await organization.$get('items');
    assert.equal(organizationItems.length, 1);
    assert.equal(organizationItems[0].title, 'Error 5');
  });

  it('handles DELETE', async () => {
    const response = await request(server).delete(`${path}${items[0].id}`);
    assert.equal(response.statusCode, 204);
    const item = await Item.findByPk(items[0].id);
    assert(!item);
  });
});
