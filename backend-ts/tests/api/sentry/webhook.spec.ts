import assert from 'assert';
import {Express} from 'express';
import request from 'supertest';

import createSentryInstallation, {
  SentryInstallation,
} from '../../factories/SentryInstallation.factory';
import {closeTestServer, createTestServer} from '../../testutils';

const path = '/api/sentry/webhook/';

describe(`GET ${path}`, () => {
  let server: Express;

  beforeEach(async () => {
    server = await createTestServer();
    jest.resetAllMocks();
  });

  afterAll(async () => await closeTestServer());

  it('responds with a 200', async () => {
    const response = await request(server).post(path);
    assert.equal(response.statusCode, 200);
  });

  it('handles uninstallations gracefully', async () => {
    const {uninstallWebhook, uninstallHeader} = sentryMocks;
    const {uuid} = uninstallWebhook.data.installation;
    await createSentryInstallation({uuid});
    const newInstall = await SentryInstallation.findOne({where: {uuid: uuid}});
    expect(newInstall).not.toBeNull();
    await request(server).post(path).send(uninstallWebhook).set(uninstallHeader);
    const oldInstall = await SentryInstallation.findOne({where: {uuid: uuid}});
    expect(oldInstall).toBeNull();
  });
});

const sentryMocks = {
  uninstallHeader: {'sentry-hook-resource': 'installation'},
  uninstallWebhook: {
    action: 'deleted',
    data: {
      installation: {
        app: {
          uuid: '64bf2cf4-37ca-4365-8dd3-6b6e56d741b8',
          slug: 'app',
        },
        organization: {slug: 'example'},
        uuid: '7a485448-a9e2-4c85-8a3c-4f44175783c9',
      },
    },
  },
};
