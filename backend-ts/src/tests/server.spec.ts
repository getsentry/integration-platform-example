import assert from 'assert';
import request from 'supertest';

import createServer from '../server';

describe('GET /', () => {
  it('responds with a 200', async () => {
    const server = createServer();
    const res = await request(server).get('/');
    assert.equal(res.statusCode, 200);
  });
});
