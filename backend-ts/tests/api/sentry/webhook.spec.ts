import assert from 'assert';
import {Express} from 'express';
import request from 'supertest';

import createSentryInstallation, {
  SentryInstallation,
} from '../../factories/SentryInstallation.factory';
import {closeTestServer, createTestServer} from '../../testutils';
import {MOCK_WEBHOOK, UUID} from './../../mocks';

const path = '/api/sentry/webhook/';

describe(`GET ${path}`, () => {
  let server: Express;

  beforeEach(async () => {
    server = await createTestServer();
    jest.resetAllMocks();
  });

  afterAll(async () => await closeTestServer());

  it('responds with a 400 to bad requests', async () => {
    let response = await request(server).post(path);
    assert.equal(response.statusCode, 400);
    response = await request(server).post(path).send('malformed');
    assert.equal(response.statusCode, 400);
    await request(server).post(path).send(MOCK_WEBHOOK['installation.deleted']); // missing headers
    assert.equal(response.statusCode, 400);
  });

  it('responds with a 400 to unknown installations', async () => {
    const response = await request(server)
      .post(path)
      .send(MOCK_WEBHOOK['installation.deleted'])
      .set({'sentry-hook-resource': 'installation'});
    assert.equal(response.statusCode, 404);
  });

  it('handles installation.deleted', async () => {
    await createSentryInstallation({uuid: UUID});
    const newInstall = await SentryInstallation.findOne({where: {uuid: UUID}});
    expect(newInstall).not.toBeNull();
    await request(server)
      .post(path)
      .send(MOCK_WEBHOOK['installation.deleted'])
      .set({'sentry-hook-resource': 'installation'});
    const oldInstall = await SentryInstallation.findOne({where: {uuid: UUID}});
    expect(oldInstall).toBeNull();
  });
});
