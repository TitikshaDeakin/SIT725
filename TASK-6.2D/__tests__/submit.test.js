const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');

describe('POST /api/submit', () => {
  it('creates a submission and returns 201 with payload', async () => {
    const payload = { first_name: 'Ada', last_name: 'Lovelace', email: 'ada@example.com' };
    const res = await request(app).post('/api/submit').send(payload);
    expect(res.status).to.equal(201);
    expect(res.body).to.include(payload);
    expect(res.body).to.have.property('id');
  });

  it('returns 400 if required fields are missing', async () => {
    const res = await request(app).post('/api/submit').send({ email: 'x@example.com' });
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('error');
  });
});

describe('Unknown routes', () => {
  it('returns 404 JSON for a missing route', async () => {
    const res = await request(app).get('/does-not-exist');
    expect(res.status).to.equal(404);
    expect(res.body).to.deep.equal({ error: 'Not found' });
  });
});
