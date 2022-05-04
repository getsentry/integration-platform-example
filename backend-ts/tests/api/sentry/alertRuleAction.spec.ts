import assert from 'assert';
import {Express} from 'express';
import request from 'supertest';

import createSentryInstallation from '../../factories/SentryInstallation.factory';
import createUser from '../../factories/User.factory';
import {closeTestServer, createTestServer} from '../../testutils';
import {ALERT_RULE_ACTION_VALUES, MOCK_ALERT_RULE_ACTION, UUID} from './../../mocks';

const path = '/api/sentry/alert-rule-action';

describe(`POST ${path}`, () => {
  let server: Express;

  beforeEach(async () => {
    server = await createTestServer();
    jest.resetAllMocks();
  });

  afterAll(async () => await closeTestServer());

  it('handles successfully approving alert rule changes in Sentry', async () => {
    const sentryInstallation = await createSentryInstallation({uuid: UUID});
    await createUser({
      id: ALERT_RULE_ACTION_VALUES.userId,
      organizationId: sentryInstallation.organizationId,
    });
    const response = await request(server).post(path).send(MOCK_ALERT_RULE_ACTION);
    assert.equal(response.statusCode, 200);
  });

  it('handles successfully surfacing errors in Sentry', async () => {
    // No SentryInstallation...
    let response = await request(server).post(path).send({});
    assert.equal(response.statusCode, 400);
    expect(response.body.message);

    // No required fields...
    await createSentryInstallation({uuid: UUID});
    response = await request(server).post(path).send({});
    assert.equal(response.statusCode, 400);
    expect(response.body.message);

    // No associated User...
    response = await request(server).post(path).send(MOCK_ALERT_RULE_ACTION);
    assert.equal(response.statusCode, 400);
    expect(response.body.message);
  });
});
