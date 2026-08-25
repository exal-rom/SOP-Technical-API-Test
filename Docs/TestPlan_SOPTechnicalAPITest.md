

# SOP Technical API Test Plan

## 1. Scope
   This plan covers functional API testing for the SOP service, focusing on authentication, user management, data integrity, pagination, delay handling, and chained request behavior.

## 2. Objectives
   - Validate core API functionality and stability
   - Ensure correct handling of valid and invalid inputs
   - Confirm consistent response structures and error contracts
   - Assess CRUD operations for user resources
   - Verify pagination logic and metadata
   - Evaluate system behavior under delay parameters
   - Demonstrate ability to chain requests and validate dependent flows
   
## 3. Test Suites & Coverage Overview
   
### Suite 1: Authentication & Input Validation
    Covers:
API availability
* Authentication enforcement
* Valid and invalid login attempts
* Input validation rules
* Error response consistency

### Suite 2: User Retrieval & CRUD Operations
  Covers:
* Fetching specific users
* JSON structure and field validation
* User creation, update, and deletion workflows

### Suite 3: User Creation Edge Cases
  Covers:
* Required field validation
* Type validation
* Handling of long, special, and Unicode characters
  
### Suite 4: Pagination & Data Integrity
  Covers:
* Pagination metadata
* Page size accuracy
* Cross‑page consistency

### Suite 5: Delay Parameter Behavior
  Covers:
* Delay handling
* Valid and invalid delay values
* Impact on response time

### Suite 6: Chained Requests
  Covers:
* Retrieving user lists
* Fetching details of selected users
* Schema validation
* Handling invalid IDs

### Bonus Question 2: Theory
If the token returned was meant to be used for authentication, how would you structure your tests to

    • Store and reuse tokens securely
    As in the resolution of this test, I decided to use a login fixture so the token is:
        - Generated only once per test run
        - Not duplicated across tests
        - Keeps the token in memory only

    • Add auth headers automatically
    To avoid manually adding headers in every test, that could lead to mistakes. I created a fixture to automatically inject the token:
    Retrieve the token with the fixture and include it in every request with:
        Authorization: Bearer <token>
        
    • Handle token expiration or reuse  
        - Detect 401/403 responses that indicate expiration
        - Automatically refresh the token using a refresh endpoint
        - Retry the failed request with the new token
        - Write explicit tests for expired, invalid, or missing tokens


## 4. Out of Scope
- Performance testing
- Security penetration testing
- Load or stress testing
- UI validation

## 5. Test Execution
   Tests will be implemented using Playwright API testing capabilities, organized by suite, and executed via the Playwright test runner.
