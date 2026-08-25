# SOP Technical API Test Suite

This project contains automated API tests implemented using Playwright.  
The test suite covers authentication, user management, pagination, delay handling, and chained request flows.

## Project Structure

- `tests/` – Contains all API test suites, grouped by functionality
- `Docs/` – Contains the Test Plan (Markdown + PDF)
- `playwright.config.ts` – Global configuration

## Test Suites

- `auth.spec.ts` – Authentication & input validation
- `users.spec.ts` – User retrieval & CRUD operations
- `users_edge_cases.spec.ts` – User creation edge cases
- `pagination.spec.ts` – Pagination & data integrity
- `delay.spec.ts` – Delay parameter behavior
- `chained.spec.ts` – Chained request flows
- `Bonus Question 2: Theory` - Response

## Running Tests

1, Install dependencies:
    npm install

2. Run all tests:
    npx playwright test

3. Run a specific suite:
   npx playwright test tests/auth.spec.ts


## Notes

- Tests are organized to match the Test Plan in `Docs/`
- Each suite runs independently and in parallel
- No authentication token is required for this API


