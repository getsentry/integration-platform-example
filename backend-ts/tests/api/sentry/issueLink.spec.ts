import assert from 'assert';
import {Express} from 'express';
import request from 'supertest';

import createItem, {Item} from '../../factories/Item.factory';
import createOrganization, {Organization} from '../../factories/Organization.factory';
import createSentryInstallation from '../../factories/SentryInstallation.factory';
import {closeTestServer, createTestServer} from '../../testutils';
import {MOCK_ISSUE_LINK, UUID} from './../../mocks';

const path = '/api/sentry/issue-link';

describe(`GET ${path}`, () => {
  let server: Express;
  let organization: Organization;
  let item: Item;

  beforeEach(async () => {
    server = await createTestServer();
    jest.resetAllMocks();
    organization = await createOrganization();
    item = await createItem({organizationId: organization.id});
    await createSentryInstallation({uuid: UUID, organizationId: organization.id});
  });

  afterAll(async () => await closeTestServer());

  it('handles creating Sentry Issue Links', async () => {
    // Check that the response was appropriate
    const response = await request(server).post(`${path}/create`).send(MOCK_ISSUE_LINK);
    assert.equal(response.statusCode, 201);
    expect(response.body.webUrl);
    assert.equal(response.body.project, 'ACME');
    // Check that item was created properly
    const itemId = response.body.identifier;
    const newItem = await Item.findByPk(itemId);
    assert.equal(newItem.title, MOCK_ISSUE_LINK.fields.title);
    assert.equal(newItem.description, MOCK_ISSUE_LINK.fields.description);
    assert.equal(newItem.column, MOCK_ISSUE_LINK.fields.column);
    assert.equal(newItem.complexity, MOCK_ISSUE_LINK.fields.complexity);
    assert.equal(newItem.sentryId, MOCK_ISSUE_LINK.issueId);
  });

  it('handles linking to Sentry Issue Links', async () => {
    const payload = MOCK_ISSUE_LINK;
    payload.fields.itemId = item.id;
    assert.equal(item.sentryId, null);
    // Check that the existing item was updated
    const response = await request(server).post(`${path}/link`).send(payload);
    await item.reload();
    assert.equal(response.statusCode, 200);
    assert.equal(item.sentryId, payload.issueId);
    // Check that the response was appropriate
    expect(response.body.webUrl);
    assert.equal(response.body.project, 'ACME');
    assert.equal(response.body.identifier, item.id);
  });
});
