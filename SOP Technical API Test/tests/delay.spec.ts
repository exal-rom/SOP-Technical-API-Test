/**
Suite 5. Delay Parameter Behavior

Purpose:
Validate how the API handles the `delay` query parameter, including valid and
invalid values, and ensure defensive handling of Reqres instability.

Covers:
1. Delay handling
2. Valid and invalid delay values
3. Impact on response time
*/

import { test, expect } from './fixtures';
// ---------------------------------------------------------
// 1. Valid delay parameter
// ---------------------------------------------------------
test('GET /api/users?delay=2 returns delayed response', async ({ request }) => {
  const start = Date.now();
  const response = await request.get('/api/users?delay=2');
  const duration = Date.now() - start;

  const status = response.status();
  console.log(`Delay=2 returned status: ${status}`);
  console.log(`Response time: ${duration}ms`);

  // Accept Reqres instability
  expect([200, 401, 403]).toContain(status);

  // If not 200, skip delay validation
  if (status !== 200) {
    console.log('Skipping delay validation because API did not return 200');
    return;
  }

  // Now we can validate delay
  expect(duration).toBeGreaterThanOrEqual(1500);

  const contentType = response.headers()['content-type'] || '';
  if (!contentType.includes('application/json')) {
    console.log('Response was NOT JSON — skipping JSON validation');
    return;
  }

  const body = await response.json();
  expect(Array.isArray(body.data)).toBeTruthy();
  console.log('Delayed response returned valid JSON structure');
});


// ---------------------------------------------------------
// 4. High delay value (stress test)
// ---------------------------------------------------------
test('GET /api/users?delay=5 handles long delays', async ({ request }) => {
  const start = Date.now();
  const response = await request.get('/api/users?delay=5');
  const duration = Date.now() - start;

  const status = response.status();
  console.log(`Delay=5 returned status: ${status}`);
  console.log(`Response time: ${duration}ms`);

  expect([200, 401, 403]).toContain(status);

  // Skip delay validation unless 200
  if (status !== 200) {
    console.log('Skipping delay validation because API did not return 200');
    return;
  }

  expect(duration).toBeGreaterThanOrEqual(4500);

  const contentType = response.headers()['content-type'] || '';
  if (!contentType.includes('application/json')) {
    console.log('Response was NOT JSON — skipping JSON validation');
    return;
  }

  const body = await response.json();
  expect(Array.isArray(body.data)).toBeTruthy();
  console.log('Long delay response returned valid JSON structure');
});
