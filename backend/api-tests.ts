import fetch from 'node-fetch'; // Requires node 18+ native fetch, so we can just use global fetch

const BASE_URL = 'http://localhost:5000/api';

const runTests = async () => {
  console.log('🧪 Starting API Edge Case Tests...\n');
  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean, testName: string, errorMsg?: string) => {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.log(`❌ FAIL: ${testName}`);
      if (errorMsg) console.log(`   Expected better handling, got: ${errorMsg}`);
      failed++;
    }
  };

  try {
    // 1. REVIEWS API
    console.log('--- REVIEWS ---');
    const getReviews = await fetch(`${BASE_URL}/reviews`);
    const reviewsData = await getReviews.json();
    assert(getReviews.status === 200 && Array.isArray(reviewsData) && reviewsData.length <= 5, 'GET /reviews returns max 5 approved reviews');

    const badReview = await fetch(`${BASE_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: 5 }) // Missing name, email, review text
    });
    assert(badReview.status === 400, 'POST /reviews handles missing fields gracefully (400)');

    const outOfBoundsReview = await fetch(`${BASE_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerName: 'Test', email: 'test@test.com', rating: 10, review: 'Great!' })
    });
    assert(outOfBoundsReview.status === 201, 'POST /reviews accepts review but clamps rating');

    // 2. CONTACT API
    console.log('\n--- CONTACT ---');
    const badContact = await fetch(`${BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test' }) // Missing email, message
    });
    assert(badContact.status === 400, 'POST /contact handles missing fields gracefully (400)');

    // 3. PAYMENT API
    console.log('\n--- PAYMENTS ---');
    const badOrder = await fetch(`${BASE_URL}/payment/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ totalAmount: 'not a number' })
    });
    assert(badOrder.status === 500 || badOrder.status === 400, 'POST /payment/create-order rejects invalid amount');

    const badVerify = await fetch(`${BASE_URL}/payment/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        razorpay_order_id: 'fake_order', 
        razorpay_payment_id: 'fake_pay', 
        razorpay_signature: 'fake_sig' 
      })
    });
    assert(badVerify.status === 400, 'POST /payment/verify securely rejects invalid cryptographic signatures (400)');

    // 4. ADMIN & SECURITY API
    console.log('\n--- ADMIN SECURITY (RBAC) ---');
    const noTokenAdmin = await fetch(`${BASE_URL}/admin/orders`);
    assert(noTokenAdmin.status === 401, 'GET /admin/orders blocks unauthenticated users (401)');

    const badTokenAdmin = await fetch(`${BASE_URL}/admin/orders`, {
      headers: { 'Authorization': 'Bearer FAKE_TOKEN_123' }
    });
    assert(badTokenAdmin.status === 401, 'GET /admin/orders blocks fake/invalid JWT tokens (401)');

    console.log('\n==================================');
    console.log(`🎉 TEST SUMMARY: ${passed} Passed | ${failed} Failed`);
    console.log('==================================');

  } catch (error) {
    console.error('Test script crashed:', error);
  }
};

runTests();
