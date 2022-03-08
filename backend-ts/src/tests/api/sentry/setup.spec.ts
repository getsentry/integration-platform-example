import request from 'supertest';
import axios from 'axios';
import {Express} from 'express';
import assert from 'assert';
import {createTestServer, closeTestServer} from '../../testutils';

const path = '/api/sentry/setup/';

describe(`GET ${path}`, () => {
  let server: Express;
  beforeAll(async () => (server = await createTestServer()));
  afterAll(async () => await closeTestServer());

  it('responds with a 302', async () => {
    axios.post = jest.fn().mockResolvedValue({
      data: {token: '234', refreshToken: 'asdf', expiresAt: '2022-03-08T21:47:10.570Z'},
    });
    axios.put = jest.fn().mockResolvedValue({
      data: {
        app: {
          uuid: 'string',
          slug: 'string',
        },
        organization: {
          slug: 'string',
        },
        uuid: 'string',
      },
    });
    const res = await request(server).get(path).query({
      code: 'test',
      installationId: 'asdf',
      orgSlug: 'test',
    });
    assert.equal(res.statusCode, 302);
  });
});
