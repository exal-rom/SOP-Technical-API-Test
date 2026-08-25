# SOP Technical API Test Suite

Automated API test suite built using **Playwright**.  
Covers authentication, user management, pagination, delay handling, and chained request flows.

---

## 📁 Project Structure

```
tests/
  auth.spec.ts
  users.spec.ts
  users_edge_cases.spec.ts
  pagination.spec.ts
  delay.spec.ts
  chained.spec.ts

Docs/
  Test Plan.md
  Test Plan.pdf

playwright.config.ts
```

- **tests/** – All API test suites grouped by functionality  
- **Docs/** – Test Plan (Markdown + PDF)  
- **playwright.config.ts** – Global configuration (baseURL, reporters, parallelism)

---

## 🧪 Test Suites

### `auth.spec.ts`
Authentication scenarios and input validation.

### `users.spec.ts`
User retrieval and basic CRUD operations.

### `users_edge_cases.spec.ts`
User creation edge cases:
- missing fields  
- invalid types  
- empty strings  
- Unicode input  
- defensive handling of Reqres instability  

### `pagination.spec.ts`
Pagination behavior and data integrity checks.

### `delay.spec.ts`
Delay parameter behavior and throttling responses.

### `chained.spec.ts`
Chained request flows (multi‑step API interactions).

### Bonus Question 2: Theory  
Written response included as part of the technical challenge.

---

## 🚀 Running Tests

### 1. Install dependencies
```bash
npm install
```

### 2. Run all tests
```bash
npx playwright test
```

### 3. Run a specific suite
```bash
npx playwright test tests/auth.spec.ts
```

### 4. Open the HTML report
```bash
npx playwright show-report
```

---

## 📌 Notes

- Test suites are organized according to the Test Plan in `Docs/`  
- All suites run independently and in parallel  
- No authentication token is required (Reqres demo API)  
- Edge‑case tests include defensive logic for non‑deterministic Reqres responses  
