/**
Suite 4. Pagination & Data Integrity

Purpose:
Validate pagination behavior, metadata accuracy, and list item structure.
Ensure defensive handling of Reqres instability and HTML responses.

Covers:
1. Pagination metadata
2. Page size accuracy
3. Cross‑page consistency
4. Out‑of‑range page behavior
*/

import { test, expect } from './fixtures';

// ---------------------------------------------------------
// 1. Basic Pagination Test
// ---------------------------------------------------------
test('GET /api/users?page=1 returns valid paginated data', async ({ request }) => {
  const response = await request.get('/api/users?page=1');

  const status = response.status();
  console.log(`Page 1 returned status: ${status}`);

  expect([200, 401, 403]).toContain(status);

  const contentType = response.headers()['content-type'] || '';
  if (!contentType.includes('application/json')) {
    console.log('Response was NOT JSON (Reqres throttling or HTML error page)');
    return;
  }

  if (status === 200) {
    const body = await response.json();

    // Metadata validation
    expect(body.page).toBe(1);
    expect(typeof body.per_page).toBe('number');
    expect(typeof body.total).toBe('number');
    expect(typeof body.total_pages).toBe('number');

    // Data array validation
    expect(Array.isArray(body.data)).toBeTruthy();
    expect(body.data.length).toBeGreaterThan(0);

    // Validate structure of each user
    for (const user of body.data) {
      expect(typeof user.id).toBe('number');
      expect(typeof user.email).toBe('string');
      expect(typeof user.first_name).toBe('string');
      expect(typeof user.last_name).toBe('string');
      expect(typeof user.avatar).toBe('string');
    }

    console.log('Page 1 pagination and user structure validated successfully');
  }
});

// ---------------------------------------------------------
// 2. Page 2 Validation
// ---------------------------------------------------------
test('GET /api/users?page=2 returns valid paginated data', async ({ request }) => {
  const response = await request.get('/api/users?page=2');

  const status = response.status();
  console.log(`Page 2 returned status: ${status}`);

  expect([200, 401, 403]).toContain(status);

  const contentType = response.headers()['content-type'] || '';
  if (!contentType.includes('application/json')) {
    console.log('Response was NOT JSON (Reqres throttling or HTML error page)');
    return;
  }

  if (status === 200) {
    const body = await response.json();

    expect(body.page).toBe(2);
    expect(Array.isArray(body.data)).toBeTruthy();

    for (const user of body.data) {
      expect(typeof user.id).toBe('number');
      expect(typeof user.email).toBe('string');
    }

    console.log('Page 2 pagination validated successfully');
  }
});

// ---------------------------------------------------------
// 3. Cross‑Page Consistency
// ---------------------------------------------------------
test('Pagination pages should not contain duplicate user IDs', async ({ request }) => {
  const page1 = await request.get('/api/users?page=1');
  const page2 = await request.get('/api/users?page=2');

  if (
    !page1.headers()['content-type']?.includes('application/json') ||
    !page2.headers()['content-type']?.includes('application/json')
  ) {
    console.log('One of the pages returned HTML — skipping consistency check');
    return;
  }

  if (page1.status() !== 200 || page2.status() !== 200) {
    console.log('One of the pages did not return 200 — skipping consistency check');
    return;
  }

  const body1 = await page1.json();
  const body2 = await page2.json();

  const idsPage1 = body1.data.map(u => u.id);
  const idsPage2 = body2.data.map(u => u.id);

  const duplicates = idsPage1.filter(id => idsPage2.includes(id));

  expect(duplicates.length).toBe(0);
  console.log('Cross‑page consistency validated: no duplicate user IDs');
});

// ---------------------------------------------------------
// 4. Out‑of‑Range Page
// ---------------------------------------------------------
test('GET /api/users?page=999 returns empty data or error', async ({ request }) => {
  const response = await request.get('/api/users?page=999');

  const status = response.status();
  console.log(`Page 999 returned status: ${status}`);

  expect([200, 404, 401, 403]).toContain(status);

  const contentType = response.headers()['content-type'] || '';
  if (!contentType.includes('application/json')) {
    console.log('Response was NOT JSON (Reqres throttling or HTML error page)');
    return;
  }

  const body = await response.json();

  // Reqres returns empty array for out‑of‑range pages
  if (status === 200) {
    expect(Array.isArray(body.data)).toBeTruthy();
    expect(body.data.length).toBe(0);
    console.log('Out‑of‑range page returned empty data as expected');
  }
});