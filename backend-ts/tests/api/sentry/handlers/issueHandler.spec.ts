import assert from 'assert';
import {Express} from 'express';
import request from 'supertest';

import {Item, ItemColumn} from '../../../factories/Item.factory';
import createSentryInstallation from '../../../factories/SentryInstallation.factory';
import {User} from '../../../factories/User.factory';
import {closeTestServer, createTestServer} from '../../../testutils';
import {ISSUE, MOCK_WEBHOOK, UUID} from './../../../mocks';

const path = '/api/sentry/webhook/';

describe(`issueHandler for webhooks`, () => {
  let server: Express;
  let baseRequest: request.Test;

  beforeEach(async () => {
    server = await createTestServer();
    await createSentryInstallation({uuid: UUID});
    baseRequest = request(server).post(path).set({'sentry-hook-resource': 'issue'});
    jest.resetAllMocks();
  });

  afterAll(async () => await closeTestServer());

  it('should handle issue.assigned events', async () => {
    const response = await baseRequest.send(MOCK_WEBHOOK['issue.assigned']);
    assert.equal(response.statusCode, 202);
    const item = await Item.findOne({where: {sentryId: ISSUE.id}});
    expect(item).not.toBeNull();
    const user = await User.findOne({where: {username: ISSUE.assignedTo.email}});
    expect(user).not.toBeNull();
    expect(item.assigneeId).toEqual(user.id);
  });

  it('should handle issue.created events', async () => {
    const response = await baseRequest.send(MOCK_WEBHOOK['issue.created']);
    assert.equal(response.statusCode, 201);
    const item = await Item.findOne({where: {sentryId: ISSUE.id}});
    expect(item).not.toBeNull();
  });

  it('should handle issue.ignored events', async () => {
    const response = await baseRequest.send(MOCK_WEBHOOK['issue.ignored']);
    assert.equal(response.statusCode, 202);
    const item = await Item.findOne({where: {sentryId: ISSUE.id}});
    expect(item).not.toBeNull();
    assert.equal(item.isIgnored, true);
  });

  it('should handle issue.resolved events', async () => {
    const response = await baseRequest.send(MOCK_WEBHOOK['issue.resolved']);
    assert.equal(response.statusCode, 202);
    const item = await Item.findOne({where: {sentryId: ISSUE.id}});
    assert.equal(item.column, ItemColumn.Done);
  });

  it('should handle unknown action events', async () => {
    const response = await baseRequest.send({
      ...MOCK_WEBHOOK['issue.assigned'],
      action: 'bookmarked',
    });
    assert.equal(response.statusCode, 400);
    const item = await Item.findOne({where: {sentryId: ISSUE.id}});
    expect(item).toBeNull();
  });
});
