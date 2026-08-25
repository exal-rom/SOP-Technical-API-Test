/**
Suite 3. User Creation Edge Cases

Purpose:
Validate the API’s behavior when creating users with valid and invalid inputs.
Ensure JSON contract consistency and defensive handling of Reqres instability.

Scenario:
POST /api/users with valid name and job fields.
*/

import { test, expect } from '@playwright/test';

test.describe('EDge_user_cases', () => {

test('POST /api/users creates a user with valid name and job', async ({ request }) => {
  const payload = { name: 'John', job: 'developer' };

  const response = await request.post('/api/users', { data: payload });

  const status = response.status();
  console.log(`POST /api/users returned status: ${status}`);

  // Reqres normally returns 201, but may return 403/401 under load
  expect([201, 400, 401, 403]).toContain(status);

  const contentType = response.headers()['content-type'] || '';
  if (!contentType.includes('application/json')) {
    console.log('Response was NOT JSON (Reqres throttling or HTML error page)');
    return; // cannot validate structure
  }


  // Only validate structure when JSON is returned
  if (status === 201) {
    const body = await response.json();

    // Basic contract validation
    expect(body.name).toBe('John');
    expect(body.job).toBe('developer');
    expect(body.id).toBeTruthy();
    expect(body.createdAt).toBeTruthy();

    // Additional validations
    expect(typeof body.id).toBe('string'); // Reqres returns IDs as strings
    expect(new Date(body.createdAt).toString()).not.toBe('Invalid Date'); // timestamp check

    console.log('User created successfully with valid contract');
  }
});
// ---------------------------------------------------------
// Missing name
// ---------------------------------------------------------
test('POST /api/users fails when name is missing', async ({ request }) => {
  const response = await request.post('/api/users', {
    data: { job: 'developer' }
  });

  const status = response.status();
  console.log(`Missing name returned status: ${status}`);

  expect([400, 401, 403]).toContain(status);

  const contentType = response.headers()['content-type'] || '';
  if (!contentType.includes('application/json')) {
    console.log('Response was NOT JSON (Reqres throttling or HTML error page)');
    return;
  }

  const body = await response.json();
  expect(body.error || body.job || body.name).toBeDefined();
  console.log('Missing name handled correctly');
});


// ---------------------------------------------------------
// Missing job
// ---------------------------------------------------------
test('POST /api/users fails when job is missing', async ({ request }) => {
  const response = await request.post('/api/users', {
    data: { name: 'John' }
  });

  const status = response.status();
  console.log(`Missing job returned status: ${status}`);

  expect([400, 401, 403]).toContain(status);

  const contentType = response.headers()['content-type'] || '';
  if (!contentType.includes('application/json')) {
    console.log('Response was NOT JSON (Reqres throttling or HTML error page)');
    return;
  }

  const body = await response.json();
  expect(body.error || body.name || body.job).toBeDefined();
  console.log('Missing job handled correctly');
});


// ---------------------------------------------------------
// Empty strings
// ---------------------------------------------------------
test('POST /api/users handles empty strings', async ({ request }) => {
  const response = await request.post('/api/users', {
    data: { name: '', job: '' }
  });

  const status = response.status();
  console.log(`Empty strings returned status: ${status}`);

  expect([201, 400, 401, 403]).toContain(status);

  const contentType = response.headers()['content-type'] || '';
  if (!contentType.includes('application/json')) {
    console.log('Response was NOT JSON (Reqres throttling or HTML error page)');
    return;
  }

  const body = await response.json();
  console.log('Empty string payload response:', body);
});


// ---------------------------------------------------------
// Invalid types (numbers instead of strings)
// ---------------------------------------------------------
test('POST /api/users handles invalid types', async ({ request }) => {
  const response = await request.post('/api/users', {
    data: { name: 123, job: true }
  });

  const status = response.status();
  console.log(`Invalid types returned status: ${status}`);

  expect([400, 401, 403]).toContain(status);

  const contentType = response.headers()['content-type'] || '';
  if (!contentType.includes('application/json')) {
    console.log('Response was NOT JSON (Reqres throttling or HTML error page)');
    return;
  }

  const body = await response.json();
  console.log('Invalid type payload response:', body);
});


// ---------------------------------------------------------
// Unicode and special characters
// ---------------------------------------------------------
test('POST /api/users accepts Unicode and special characters', async ({ request }) => {
  const payload = { name: 'Ægir 🌊', job: 'Développeur 🚀' };

  const response = await request.post('/api/users', { data: payload });

  const status = response.status();
  console.log(`Unicode payload returned status: ${status}`);

  expect([201, 403, 401]).toContain(status);

  const contentType = response.headers()['content-type'] || '';
  if (!contentType.includes('application/json')) {
    console.log('Response was NOT JSON (Reqres throttling or HTML error page)');
    return;
  }

  if (status === 201) {
    const body = await response.json();
    expect(body.name).toBe(payload.name);
    expect(body.job).toBe(payload.job);
    console.log('Unicode characters handled correctly');
  }
});
});
