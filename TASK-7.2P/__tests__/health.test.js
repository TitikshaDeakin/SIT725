const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');

describe('GET /health', () => {
  it('returns 200 and { ok: true }', async () => {
    const res = await request(app).get('/health');
    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal({ ok: true });
  });
});
