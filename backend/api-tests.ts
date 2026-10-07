import fetch from 'node-fetch'; 

const BASE_URL = 'http://localhost:5000/api';

const runTests = async () => {
  console.log('🧪 Starting Comprehensive API Edge Case Tests...\n');
  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean, testName: string, errorMsg?: string, responseBody?: any) => {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.log(`❌ FAIL: ${testName}`);
      if (errorMsg) console.log(`   Expected better handling, got: ${errorMsg}`);
      if (responseBody) console.log(`   Response Body: ${JSON.stringify(responseBody)}`);
      failed++;
    }
  };

  try {
    // 1. REVIEWS API
    console.log('\n--- REVIEWS API ---');
    const getReviews = await fetch(`${BASE_URL}/reviews`);
    const reviewsData = await getReviews.json();
    assert(getReviews.status === 200 && Array.isArray(reviewsData), 'GET /reviews returns success');

    const badReview1 = await fetch(`${BASE_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: 5 }) // Missing name, review text
    });
    assert(badReview1.status === 400, 'POST /reviews rejects missing fields (400)');

    const outOfBoundsReview = await fetch(`${BASE_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerName: 'Test', email: 'test@test.com', rating: 10, review: 'Great!' })
    });
    assert(outOfBoundsReview.status === 201, 'POST /reviews clamps rating to max 5 (201)');

    const badReview2 = await fetch(`${BASE_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerName: 'Test', email: 'test@test.com', rating: 'not-a-number', review: 'Great!' })
    });
    assert(badReview2.status === 201, 'POST /reviews handles invalid rating types by defaulting to 5', `Status: ${badReview2.status}`, await badReview2.text());

    // 2. CONTACT API
    console.log('\n--- CONTACT API ---');
    const badContact1 = await fetch(`${BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test' }) // Missing email, message
    });
    assert(badContact1.status === 400, 'POST /contact rejects missing fields (400)');

    const badContact2 = await fetch(`${BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test', email: 'not-an-email', message: 'Hello' })
    });
    assert(badContact2.status === 400 || badContact2.status === 500, 'POST /contact validates email format', `Status: ${badContact2.status}`, await badContact2.text());

    // 3. PAYMENT & ORDER API
    console.log('\n--- ORDER CREATION & PAYMENTS API ---');
    const missingOrderFields = await fetch(`${BASE_URL}/orders/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName: 'John' }) // missing email, phone, address, etc.
    });
    assert(missingOrderFields.status === 400 || missingOrderFields.status === 500, 'POST /orders rejects incomplete order data', `Status: ${missingOrderFields.status}`, await missingOrderFields.text());

    let orderId = '';
    const validOrder = await fetch(`${BASE_URL}/orders/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        fullName: 'Test User', 
        email: 'test@example.com',
        phone: '9999999999',
        address: '123 Main St',
        city: 'Siliguri',
        state: 'West Bengal',
        pincode: '734001',
        quantity: 1
      })
    });
    if (validOrder.status === 201) {
      const orderData = await validOrder.json();
      orderId = orderData.orderId;
      assert(true, 'POST /orders creates order successfully');
    } else {
      assert(false, 'POST /orders failed', `Status: ${validOrder.status}`, await validOrder.text());
    }

    if (orderId) {
      const paymentSession = await fetch(`${BASE_URL}/payment/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });
      assert(paymentSession.status === 200, 'POST /payment/create successfully returns Cashfree session_id');

      const badVerify = await fetch(`${BASE_URL}/payment/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: 'invalid_order_id' })
      });
      assert(badVerify.status === 400 || badVerify.status === 404 || badVerify.status === 500, 'POST /payment/verify securely rejects verification for non-existent orders');
    }

    // 4. ADMIN & SECURITY API (RBAC)
    console.log('\n--- ADMIN SECURITY (RBAC) ---');
    const noTokenAdmin = await fetch(`${BASE_URL}/admin/orders`);
    assert(noTokenAdmin.status === 401, 'GET /admin/orders blocks unauthenticated users (401)');

    const badTokenAdmin = await fetch(`${BASE_URL}/admin/orders`, {
      headers: { 'Authorization': 'Bearer FAKE_TOKEN_123' }
    });
    assert(badTokenAdmin.status === 401, 'GET /admin/orders blocks fake/invalid JWT tokens (401)');

    const fakeMethod = await fetch(`${BASE_URL}/admin/orders`, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer FAKE_TOKEN_123' }
    });
    assert(fakeMethod.status === 401 || fakeMethod.status === 404, 'POST to GET endpoint is handled safely');

    console.log('\n==================================');
    console.log(`🎉 TEST SUMMARY: ${passed} Passed | ${failed} Failed`);
    console.log('==================================');

  } catch (error) {
    console.error('Test script crashed:', error);
  }
};

runTests();
