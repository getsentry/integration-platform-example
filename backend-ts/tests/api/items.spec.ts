import assert from 'assert';
import {Express} from 'express';
import request from 'supertest';

import SentryAPIClient from '../../src/util/SentryAPIClient';
import createItem, {Item} from '../factories/Item.factory';
import createOrganization, {Organization} from '../factories/Organization.factory';
import createSentryInstallation, {
  SentryInstallation,
} from '../factories/SentryInstallation.factory';
import createUser from '../factories/User.factory';
import {closeTestServer, createTestServer} from '../testutils';

const path = '/api/items/';

describe(path, () => {
  let server: Express;
  let items: Item[];
  let organization: Organization;
  const itemTitles = ['Error 1', 'Error 2'];
  const itemSentryId = '12345';
  const itemShortId = 'PROJ-123';

  beforeEach(async () => {
    server = await createTestServer();
    items = await Promise.all(itemTitles.map(async title => await createItem({title})));
    jest.resetAllMocks();
  });

  afterAll(async () => await closeTestServer());

  xit('handles GET all', async () => {
    const response = await request(server).get(path);
    assert.equal(response.body.length, itemTitles.length);
    assert.equal(response.statusCode, 200);
  });

  xit('handles GET by organization', async () => {
    organization = await createOrganization({slug: 'example'});
    await createItem({title: 'Error 3', organizationId: organization.id});
    const response = await request(server)
      .get(path)
      .query({organization: organization.slug});
    assert.equal(response.body.length, 1);
  });

  it('handles GET all with Sentry API data', async () => {
    organization = await createOrganization({slug: 'example2'});
    await createSentryInstallation({
      organizationId: organization.id,
    });
    items[0].update({sentryId: itemSentryId, organizationId: organization.id});

    const mockSentryAPIClientGet = jest
      .spyOn(SentryAPIClient.prototype, 'get')
      .mockImplementation(() => ({data: {shortId: itemShortId}} as any));

    const response = await request(server)
      .get(path)
      .query({organization: organization.slug});

    expect(mockSentryAPIClientGet).toHaveBeenCalledTimes(1);
    expect(response.body[0].sentryId).toEqual(itemShortId);
  });

  xit('handles GET all with a failing Sentry API', async () => {
    organization = await createOrganization({slug: 'example3'});
    await createSentryInstallation({
      organizationId: organization.id,
    });
    items[0].update({sentryId: itemSentryId, organizationId: organization.id});

    const mockSentryAPIClientGet = jest
      .spyOn(SentryAPIClient.prototype, 'get')
      .mockImplementation(() => ({} as any));

    const response = await request(server)
      .get(path)
      .query({organization: organization.slug});

    expect(mockSentryAPIClientGet).toHaveBeenCalledTimes(1);
    expect(response.body[0].sentryId).toEqual(itemShortId);
  });

  xit('handles POST', async () => {
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

  xit('handles PUT', async () => {
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

  xit('handles DELETE', async () => {
    const response = await request(server).delete(`${path}${items[0].id}`);
    assert.equal(response.statusCode, 204);
    const item = await Item.findByPk(items[0].id);
    assert(!item);
  });
});
