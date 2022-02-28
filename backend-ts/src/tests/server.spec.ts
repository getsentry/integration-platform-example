import {assert} from 'chai';
import server from '../server';
import request from 'supertest';

describe('GET /', () => {
  it('responds with text', async () => {
    const res = await request(server).get('/');
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, {});
    assert.typeOf(res.text, 'string');
  });
});
