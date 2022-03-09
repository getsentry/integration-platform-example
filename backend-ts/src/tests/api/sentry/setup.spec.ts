import assert from 'assert';
import request, {Response} from 'supertest';
import axios from 'axios';
import {Express} from 'express';
import {createTestServer, closeTestServer} from '../../testutils';

const path = '/api/sentry/setup/';

describe(`GET ${path}`, () => {
  let server: Express;
  let res: Response;
  const mockPost = jest.spyOn(axios, 'post');
  const mockPut = jest.spyOn(axios, 'put');

  beforeEach(async () => {
    server = await createTestServer();
    jest.resetAllMocks();
    const {newToken, installation, queryInstall} = sentryMocks;
    mockPost.mockResolvedValue(newToken);
    mockPut.mockResolvedValue(installation);
    res = await request(server).get(path).query(queryInstall);
  });

  afterAll(async () => await closeTestServer());

  it('responds with a 302', async () => {
    assert.equal(res.statusCode, 302);
  });

  it('properly requests a token', async () => {
    const [endpoint, payload] = mockPost.mock.calls[0];
    assert(endpoint.includes('sentry-app-installations'));
    assert(Object.keys(payload).includes('client_id'));
    assert(Object.keys(payload).includes('client_secret'));
  });

  it('properly verifies the installation', async () => {
    const [endpoint, payload, options] = mockPut.mock.calls[0] as any[];
    assert(endpoint.includes('sentry-app-installations'));
    assert.equal(payload.status, 'installed');
    const authHeader = options.headers.Authorization as string;
    assert(authHeader.includes(sentryMocks.newToken.data.token));
  });
});

const sentryMocks = {
  queryInstall: {
    code: 'installCode',
    installationId: 'abc123',
    orgSlug: 'example',
  },
  newToken: {
    data: {
      token: 'abc123',
      refreshToken: 'def456',
      expiresAt: '2022-01-01T08:00:00.000Z',
    },
  },
  installation: {
    data: {
      app: {
        uuid: '64bf2cf4-37ca-4365-8dd3-6b6e56d741b8',
        slug: 'app',
      },
      organization: {slug: 'example'},
      uuid: '7a485448-a9e2-4c85-8a3c-4f44175783c9',
    },
  },
};
