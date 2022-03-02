import {assert} from 'chai';
import server from '../server';
import request from 'supertest';

describe('GET /', () => {
  it('responds with a 200', async () => {
    const res = await request(server).get('/');
    assert.equal(res.statusCode, 200);
  });
});
