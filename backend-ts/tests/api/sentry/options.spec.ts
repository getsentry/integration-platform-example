import assert from 'assert';
import {Express} from 'express';
import request from 'supertest';

import createItem from '../../factories/Item.factory';
import createOrganization, {Organization} from '../../factories/Organization.factory';
import createSentryInstallation from '../../factories/SentryInstallation.factory';
import {closeTestServer, createTestServer} from '../../testutils';
import {UUID} from './../../mocks';

const path = '/api/sentry/options/items/';

describe(`GET ${path}`, () => {
  let server: Express;
  let organization: Organization;
  const initialItemCount = 1;

  beforeEach(async () => {
    server = await createTestServer();
    jest.resetAllMocks();
    organization = await createOrganization();
    await createItem({organizationId: organization.id});
    await createSentryInstallation({uuid: UUID, organizationId: organization.id});
  });

  afterAll(async () => await closeTestServer());

  it('responds with the proper format', async () => {
    const response = await request(server).get(path).query({installationId: UUID});
    assert.equal(response.statusCode, 200);
    assert.equal(response.body.length, initialItemCount);
    // Check that the options are all valid
    for (const option of response.body) {
      expect(option).toHaveProperty('value');
      expect(option).toHaveProperty('label');
    }
  });
});
