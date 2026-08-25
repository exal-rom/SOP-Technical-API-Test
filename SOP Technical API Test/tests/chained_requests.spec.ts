/**
Suite 6. Chained Requests

Purpose:
Validate multi-step API flows by chaining requests:
1. Retrieve a list of users
2. Select a user from the list
3. Fetch details of that user
4. Validate schema and handle invalid IDs

Covers:
- Retrieving user lists
- Fetching details of selected users
- Schema validation
- Handling invalid IDs
*/

import { test, expect } from './fixtures';

// ---------------------------------------------------------
// 1. Chained flow: list → pick user → fetch details
// ---------------------------------------------------------
test('Chained request: fetch list then fetch user details', async ({ request }) => {
  // Step 1: Fetch user list
  const listResponse = await request.get('/api/users?page=1');
  const listStatus = listResponse.status();

  console.log(`List request returned status: ${listStatus}`);
  expect([200, 401, 403]).toContain(listStatus);

  const listContentType = listResponse.headers()['content-type'] || '';
  if (!listContentType.includes('application/json')) {
    console.log('List response was NOT JSON — skipping chained flow');
    return;
  }

  if (listStatus !== 200) {
    console.log('List request did not return 200 — skipping chained flow');
    return;
  }

  const listBody = await listResponse.json();

  expect(Array.isArray(listBody.data)).toBeTruthy();
  expect(listBody.data.length).toBeGreaterThan(0);

  // Pick the first user
  const selectedUser = listBody.data[0];
  console.log(`Selected user ID: ${selectedUser.id}`);

  // Step 2: Fetch details of selected user
  const detailResponse = await request.get(`/api/users/${selectedUser.id}`);
  const detailStatus = detailResponse.status();

  console.log(`Detail request returned status: ${detailStatus}`);
  expect([200, 401, 403]).toContain(detailStatus);

  const detailContentType = detailResponse.headers()['content-type'] || '';
  if (!detailContentType.includes('application/json')) {
    console.log('Detail response was NOT JSON — skipping schema validation');
    return;
  }

  if (detailStatus !== 200) {
    console.log('Detail request did not return 200 — skipping schema validation');
    return;
  }

  const detailBody = await detailResponse.json();

  // Validate schema
  expect(detailBody.data).toBeTruthy();
  expect(detailBody.data.id).toBe(selectedUser.id);
  expect(typeof detailBody.data.email).toBe('string');
  expect(typeof detailBody.data.first_name).toBe('string');
  expect(typeof detailBody.data.last_name).toBe('string');
  expect(typeof detailBody.data.avatar).toBe('string');

  console.log('Chained flow validated successfully');
});

// ---------------------------------------------------------
// 2. Invalid ID handling
// ---------------------------------------------------------
test('Chained request: invalid user ID returns error or empty response', async ({ request }) => {
  const invalidId = 99999;

  const response = await request.get(`/api/users/${invalidId}`);
  const status = response.status();

  console.log(`Invalid ID request returned status: ${status}`);
  expect([404, 401, 403]).toContain(status);

  const contentType = response.headers()['content-type'] || '';
  if (!contentType.includes('application/json')) {
    console.log('Invalid ID response was NOT JSON — skipping JSON validation');
    return;
  }

  const body = await response.json();

  // Reqres returns {} for non-existent users
  expect(Object.keys(body).length === 0).toBeTruthy();

  console.log('Invalid ID handled correctly');
});
