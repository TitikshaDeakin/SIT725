const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');

describe('GET / (home page)', () => {
  it('serves HTML with the SIT 725 heading', async () => {
    const res = await request(app).get('/');
    expect(res.status).to.equal(200);
    expect(res.headers['content-type']).to.match(/text\/html/);
    expect(res.text).to.include('SIT 725'); // index.html heading text
  });
});
