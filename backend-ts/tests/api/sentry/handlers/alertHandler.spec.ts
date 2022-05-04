import assert from 'assert';
import {Express} from 'express';
import request from 'supertest';

import {Item} from '../../../factories/Item.factory';
import createSentryInstallation from '../../../factories/SentryInstallation.factory';
import createUser from '../../../factories/User.factory';
import {closeTestServer, createTestServer} from '../../../testutils';
import {
  ALERT_RULE_ACTION_VALUES,
  ISSUE,
  METRIC_ALERT,
  MOCK_WEBHOOK,
  UUID,
} from './../../../mocks';

const path = '/api/sentry/webhook/';

describe('alertHandler for webhooks', () => {
  let server: Express;

  beforeEach(async () => {
    server = await createTestServer();
    await createSentryInstallation({uuid: UUID});
    await createUser({id: ALERT_RULE_ACTION_VALUES.userId});
    jest.resetAllMocks();
  });

  afterAll(async () => await closeTestServer());

  it('should handle event_alert.triggered events', async () => {
    const response = await request(server)
      .post(path)
      .send(MOCK_WEBHOOK['event_alert.triggered'])
      .set({'sentry-hook-resource': 'event_alert'});
    assert.equal(response.statusCode, 202);
    const item = await Item.findOne({where: {sentryId: ISSUE.id}});
    expect(item).not.toBeNull();
    expect(item.title).toContain('Issue Alert');
  });

  it('should handle metric_alert actions', async () => {
    for (const action of ['resolved', 'warning', 'critical'] as const) {
      const response = await request(server)
        .post(path)
        .send(MOCK_WEBHOOK[`metric_alert.${action}`])
        .set({'sentry-hook-resource': 'metric_alert'});
      assert.equal(response.statusCode, 202);
      const {
        rows: [item],
        count: itemCount,
      } = await Item.findAndCountAll({
        where: {sentryAlertId: METRIC_ALERT.id},
      });
      expect(itemCount).toBe(1);
      expect(item).not.toBeNull();
      expect(item.title.toLowerCase()).toContain(action);
    }
  });

  it('should handle issue alerts with alert rule actions', async () => {
    const response = await request(server)
      .post(path)
      .send(MOCK_WEBHOOK['event_alert.triggered:with_alert_rule_action'])
      .set({'sentry-hook-resource': 'event_alert'});
    assert.equal(response.statusCode, 202);
    const item = await Item.findOne({where: {sentryId: ISSUE.id}});
    expect(item.title).toContain('Issue Alert');
    expect(item.title).toContain(ALERT_RULE_ACTION_VALUES.title);
    expect(item.description).toContain(ALERT_RULE_ACTION_VALUES.description);
    expect(item.assigneeId).toEqual(parseInt(ALERT_RULE_ACTION_VALUES.userId, 10));
  });

  it('should handle metric alerts with alert rule actions', async () => {
    for (const action of ['warning', 'critical'] as const) {
      const response = await request(server)
        .post(path)
        .send(MOCK_WEBHOOK[`metric_alert.${action}:with_alert_rule_action`])
        .set({'sentry-hook-resource': 'metric_alert'});
      assert.equal(response.statusCode, 202);
      const {
        rows: [item],
        count: itemCount,
      } = await Item.findAndCountAll({
        where: {sentryAlertId: METRIC_ALERT.id},
      });
      expect(itemCount).toBe(1);
      expect(item.title.toLowerCase()).toContain(action);
      expect(item.title).toContain(ALERT_RULE_ACTION_VALUES.title);
      expect(item.description).toContain(ALERT_RULE_ACTION_VALUES.description);
      expect(item.assigneeId).toEqual(parseInt(ALERT_RULE_ACTION_VALUES.userId, 10));
    }
  });
});
