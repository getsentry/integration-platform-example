import assert from 'assert';
import {Express} from 'express';
import request from 'supertest';

import createItem, {Item} from '../../../factories/Item.factory';
import createSentryInstallation from '../../../factories/SentryInstallation.factory';
import {closeTestServer, createTestServer} from '../../../testutils';
import {ISSUE, MOCK_WEBHOOK, UUID} from './../../../mocks';

const path = '/api/sentry/webhook/';

describe(`commentHandler for webhooks`, () => {
  let server: Express;
  let baseRequest: request.Test;
  let item: Item;

  beforeEach(async () => {
    server = await createTestServer();
    const sentryInstallation = await createSentryInstallation({uuid: UUID});
    item = await createItem({
      sentryId: ISSUE.id,
      organizationId: sentryInstallation.organizationId,
    });
    baseRequest = request(server).post(path).set({'sentry-hook-resource': 'comment'});
    jest.resetAllMocks();
  });

  afterAll(async () => await closeTestServer());

  it('should handle events for unlinked Sentry issues', async () => {
    const payload = {
      ...MOCK_WEBHOOK['comment.created'],
      data: {...MOCK_WEBHOOK['comment.created'].data, issue_id: '90210'},
    };
    const response = await baseRequest.send(payload);
    assert.equal(response.statusCode, 200);
  });

  it('should handle comment.created events', async () => {
    const payload = MOCK_WEBHOOK['comment.created'];
    const response = await baseRequest.send(payload);
    assert.equal(response.statusCode, 201);

    await item.reload();
    assert.equal(item.comments.length, 1);
    const newComment = item.comments[0];
    assert.equal(newComment.author, payload.actor.name);
    assert.equal(newComment.text, payload.data.comment);
    assert.equal(newComment.timestamp, payload.data.timestamp);
    assert.equal(newComment.sentryCommentId, payload.data.comment_id);
  });

  it('should handle comment.updated events', async () => {
    const payload = MOCK_WEBHOOK['comment.updated'];
    await item.update({
      comments: [
        {
          sentryCommentId: payload.data.comment_id,
          timestamp: payload.data.timestamp,
          author: payload.actor.name,
          text: 'old comment',
        },
      ],
    });
    await item.reload();
    assert.equal(item.comments.length, 1);

    const response = await baseRequest.send(payload);
    assert.equal(response.statusCode, 200);

    await item.reload();
    assert.equal(item.comments.length, 1);
    const existingComment = item.comments[0];
    assert.equal(existingComment.text, payload.data.comment);
  });

  it('should handle comment.deleted events', async () => {
    const payload = MOCK_WEBHOOK['comment.deleted'];
    await item.update({
      comments: [
        {
          sentryCommentId: payload.data.comment_id,
          timestamp: payload.data.timestamp,
          author: payload.actor.name,
          text: payload.data.comment,
        },
        {
          sentryCommentId: '90210',
          timestamp: payload.data.timestamp,
          author: payload.actor.name,
          text: 'untouched comment',
        },
      ],
    });
    await item.reload();
    assert.equal(item.comments.length, 2);

    const response = await baseRequest.send(payload);
    assert.equal(response.statusCode, 204);

    await item.reload();
    assert.equal(item.comments.length, 1);
  });
});
