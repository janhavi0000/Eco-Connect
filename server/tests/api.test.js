const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Recycler = require('../models/Recycler');
const EWasteRequest = require('../models/EWasteRequest');
const PickupSpot = require('../models/PickupSpot');

describe('EcoConnect Backend API Test Suite', () => {
  let userToken = '';
  let recyclerToken = '';
  let adminToken = '';
  let createdUserId = '';
  let createdRecyclerId = '';
  let createdRequestId = '';
  let createdSpotId = '';

  before(async () => {
    // Wait for DB connection if not ready
    if (mongoose.connection.readyState === 0) {
      const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecoconnect_test';
      try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
      } catch (e) {
        console.warn('Skipping test DB setup if Mongo is not running');
      }
    }
  });

  after(async () => {
    // Cleanup test records
    if (mongoose.connection.readyState === 1) {
      await User.deleteMany({ email: /test.*@ecoconnect\.org/ });
      await Recycler.deleteMany({ email: /test.*@ecoconnect\.org/ });
      if (createdRequestId) await EWasteRequest.findByIdAndDelete(createdRequestId);
      if (createdSpotId) await PickupSpot.findByIdAndDelete(createdSpotId);
      await mongoose.disconnect();
    }
  });

  test('GET /api/health should return 200 OK', async () => {
    const res = await request(app).get('/api/health');
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
  });

  test('POST /api/auth/register should register a new community user', async () => {
    if (mongoose.connection.readyState !== 1) return;
    const email = `testuser_${Date.now()}@ecoconnect.org`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Community User',
        email,
        phone: '+1-555-9988',
        password: 'Password123!',
        role: 'user'
      });

    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.token);
    userToken = res.body.data.token;
    createdUserId = res.body.data.user._id;
  });

  test('POST /api/auth/login should authenticate user with valid credentials', async () => {
    if (mongoose.connection.readyState !== 1 || !createdUserId) return;
    const user = await User.findById(createdUserId);
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: user.email,
        password: 'Password123!'
      });

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.token);
  });

  test('POST /api/auth/login with wrong password should fail with 401', async () => {
    if (mongoose.connection.readyState !== 1 || !createdUserId) return;
    const user = await User.findById(createdUserId);
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: user.email,
        password: 'WrongPassword'
      });

    assert.strictEqual(res.statusCode, 401);
    assert.strictEqual(res.body.success, false);
  });

  test('GET /api/auth/me should return current user profile on protected route', async () => {
    if (!userToken) return;
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${userToken}`);

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.user.role, 'user');
  });

  test('Register and verify a Recycler', async () => {
    if (mongoose.connection.readyState !== 1) return;
    const recEmail = `testrec_${Date.now()}@ecoconnect.org`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Recycler Partner Test',
        email: recEmail,
        phone: '+1-555-8877',
        password: 'Password123!',
        role: 'recycler',
        organizationName: 'EcoTech Recyclers Test',
        address: '123 Green Avenue',
        supportedCategories: ['Mobile Phones', 'Chargers / Cables']
      });

    assert.strictEqual(res.statusCode, 201);
    recyclerToken = res.body.data.token;
    createdRecyclerId = res.body.data.recycler._id;

    // Manually mark recycler as VERIFIED for further tests
    await Recycler.findByIdAndUpdate(createdRecyclerId, {
      verificationStatus: 'VERIFIED'
    });
  });

  test('POST /api/requests should create a multi-item e-waste collection request', async () => {
    if (!userToken || !createdRecyclerId) return;
    const res = await request(app)
      .post('/api/requests')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        recyclerId: createdRecyclerId,
        items: [
          {
            category: 'Mobile Phones',
            itemType: 'Smartphone Test',
            quantity: 2,
            weight: 0.5,
            condition: 'Dead / Damaged',
            description: 'Old test phone'
          },
          {
            category: 'Chargers / Cables',
            itemType: 'Cable Test',
            quantity: 3,
            weight: 0.2,
            condition: 'Working'
          }
        ],
        pickupMethod: 'Doorstep Pickup',
        pickupLocation: {
          address: '456 Campus Drive',
          latitude: 28.6139,
          longitude: 77.2090
        },
        preferredDate: '2026-10-20',
        preferredTime: '11:00 - 01:00 PM'
      });

    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.totalQuantity, 5);
    assert.strictEqual(res.body.data.status, 'PENDING');
    createdRequestId = res.body.data._id;
  });

  test('GET /api/requests/my should retrieve user requests', async () => {
    if (!userToken) return;
    const res = await request(app)
      .get('/api/requests/my')
      .set('Authorization', `Bearer ${userToken}`);

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
  });

  test('PATCH /api/recycler/requests/:id/status should update status to ACCEPTED then COLLECTED', async () => {
    if (!recyclerToken || !createdRequestId) return;

    // 1. Accept
    const acceptRes = await request(app)
      .patch(`/api/recycler/requests/${createdRequestId}/status`)
      .set('Authorization', `Bearer ${recyclerToken}`)
      .send({ status: 'ACCEPTED', note: 'Accepted by recycler' });

    assert.strictEqual(acceptRes.statusCode, 200);
    assert.strictEqual(acceptRes.body.data.status, 'ACCEPTED');

    // 2. Mark Collected
    const collectRes = await request(app)
      .patch(`/api/recycler/requests/${createdRequestId}/status`)
      .set('Authorization', `Bearer ${recyclerToken}`)
      .send({ status: 'COLLECTED', note: 'Collected successfully' });

    assert.strictEqual(collectRes.statusCode, 200);
    assert.strictEqual(collectRes.body.data.status, 'COLLECTED');
    assert.ok(collectRes.body.data.collectedAt);
  });
});
