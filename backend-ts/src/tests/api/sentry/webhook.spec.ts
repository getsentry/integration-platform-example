import assert from 'assert';
import {Express} from 'express';
import request from 'supertest';

import createSentryInstallation from '../../factories/SentryInstallation.factory';
import {closeTestServer, createTestServer} from '../../testutils';
import {SentryInstallation} from './../../../models';

const path = '/api/sentry/webhook/';

describe(`GET ${path}`, () => {
  let server: Express;

  beforeEach(async () => {
    server = await createTestServer();
    jest.resetAllMocks();
  });

  afterAll(async () => await closeTestServer());

  it('responds with a 200', async () => {
    const response = await request(server).post(path).send(sentryMocks.uninstallWebhook);
    assert.equal(response.statusCode, 200);
  });

  it('handles uninstallations gracefully', async () => {
    const sentryInstallationId = sentryMocks.uninstallWebhook.data.installation.uuid;
    await createSentryInstallation({id: sentryInstallationId});
    const newInstall = await SentryInstallation.findByPk(sentryInstallationId);
    expect(newInstall).not.toBeNull();
    await request(server).post(path).send(sentryMocks.uninstallWebhook);
    const oldInstall = await SentryInstallation.findByPk(sentryInstallationId);
    expect(oldInstall).toBeNull();
  });
});

const sentryMocks = {
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
