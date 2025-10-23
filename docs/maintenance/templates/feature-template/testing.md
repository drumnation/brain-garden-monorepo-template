<!--
Feature Testing Documentation Template v1.0

Instructions:
1. Copy this file when documenting a new feature's testing strategy
2. Replace all [PLACEHOLDER] text with actual content
3. Update YAML frontmatter with appropriate values
4. Fill in all sections completely
5. Link to actual test files using format: `path/to/test.test.ts:line`
6. Update coverage metrics as tests are added
7. Remove this instruction block when done

For reference implementation, see: /docs/features/authentication/testing.md
-->

---
title: "[Feature Name] Testing Documentation"
description: "[Brief description of the testing strategy for this feature]"
keywords: [[feature-name], testing, [test-framework], quality]
last_updated: "YYYY-MM-DD"
---

# [Feature Name] Testing Documentation

## Testing Overview

**Testing Philosophy:** [Brief statement about testing approach for this feature]

**Coverage Goals:**
- Unit Tests: [Percentage or "High/Medium/Low"]
- Integration Tests: [Percentage or "High/Medium/Low"]
- E2E Tests: [Number of critical workflows covered]

**Key Testing Priorities:**
1. [Priority 1 - e.g., "Authentication flow correctness"]
2. [Priority 2 - e.g., "Error handling and recovery"]
3. [Priority 3 - e.g., "Performance under load"]

---

## Test Strategy

### Testing Pyramid

Our testing strategy follows the testing pyramid approach, prioritizing tests from bottom to top:

```
         /\
        /E2E\         [Few] - Critical user workflows
       /------\
      /  INT   \      [Some] - Key integration points
     /----------\
    /    UNIT    \    [Many] - Business logic and components
   /--------------\
```

**Distribution Goal:**
- **Unit Tests:** ~70% - Fast, isolated, test individual functions/components
- **Integration Tests:** ~20% - Test component interactions and API contracts
- **E2E Tests:** ~10% - Test complete user workflows

---

## Unit Tests

### Unit Test Philosophy

**What We Test:**
- Component rendering and behavior
- Business logic and data transformations
- State management (reducers, selectors, actions)
- Utility functions
- Service layer logic
- Repository functions (with mocked database)

**What We Don't Unit Test:**
- External API calls (use integration tests)
- Database queries (use integration tests)
- Complex user workflows (use E2E tests)

### Framework and Tools

**Testing Framework:** [Vitest/Jest]

**Version:** [x.x.x]

**Additional Libraries:**
- [React Testing Library] - [Version] - Component testing
- [Testing Library User Event] - [Version] - User interaction simulation
- [MSW (Mock Service Worker)] - [Version] - API mocking
- [Vitest UI] - [Version] - Visual test runner

### Test File Locations

**Pattern:** Co-located with source files

```
Feature Components:
packages/[package]/src/
├─ components/
│  ├─ [Component]/
│  │  ├─ [Component].tsx
│  │  └─ [Component].unit.test.tsx    ← Unit test
│  └─ [SubComponent]/
│     ├─ [SubComponent].tsx
│     └─ [SubComponent].unit.test.tsx
├─ hooks/
│  ├─ use[Feature].ts
│  └─ use[Feature].unit.test.ts       ← Unit test
└─ services/
   ├─ [feature]Service.ts
   └─ [feature]Service.unit.test.ts   ← Unit test

State Management:
packages/shared-redux/src/
├─ slices/
│  └─ [feature]/
│     ├─ [feature]Slice.ts
│     ├─ [feature]Slice.unit.test.ts  ← Unit test
│     ├─ [feature]Selectors.ts
│     └─ [feature]Selectors.unit.test.ts

Backend:
apps/server/src/
└─ modules/
   └─ [feature]/
      ├─ [feature].service.ts
      ├─ [feature].service.unit.test.ts
      ├─ [feature].repo.ts
      └─ [feature].repo.unit.test.ts
```

### Running Unit Tests

```bash
# Run all unit tests
pnpm test

# Run unit tests for specific package
pnpm --filter @scala-cme/[package-name] test

# Run unit tests in watch mode
pnpm test:watch

# Run unit tests with coverage
pnpm test:coverage

# Run unit tests for specific file
pnpm test [feature].unit.test.ts
```

### Unit Test Examples

#### Frontend Component Test

**File:** `packages/[package]/src/components/[Component]/[Component].unit.test.tsx`

**What It Tests:** [Brief description]

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { [Component] } from './[Component]';

describe('[Component]', () => {
  it('should render with default props', () => {
    render(<[Component] prop1="value" />);

    expect(screen.getByText('[expected text]')).toBeInTheDocument();
  });

  it('should handle user interaction', async () => {
    const mockHandler = vi.fn();
    render(<[Component] onAction={mockHandler} />);

    await userEvent.click(screen.getByRole('button', { name: '[button name]' }));

    expect(mockHandler).toHaveBeenCalledWith([expected args]);
  });

  it('should display error state', () => {
    render(<[Component] error="[error message]" />);

    expect(screen.getByText('[error message]')).toBeInTheDocument();
  });
});
```

**Key Test Cases:**
- ✅ Default rendering
- ✅ User interactions
- ✅ Error states
- ✅ Loading states
- ✅ Conditional rendering

---

#### Redux Slice Test

**File:** `packages/shared-redux/src/slices/[feature]/[feature]Slice.unit.test.ts`

**What It Tests:** [Brief description]

```typescript
import { [feature]Reducer, [action1], [action2] } from './[feature]Slice';
import { [Feature]State } from './types';

describe('[feature]Slice', () => {
  const initialState: [Feature]State = {
    data: null,
    status: 'idle',
    error: null
  };

  it('should handle [action1]', () => {
    const action = [action1]({ [payload] });
    const state = [feature]Reducer(initialState, action);

    expect(state.data).toEqual([expected data]);
    expect(state.status).toBe('success');
  });

  it('should handle [action2] error', () => {
    const action = [action2]({ error: '[error message]' });
    const state = [feature]Reducer(initialState, action);

    expect(state.error).toBe('[error message]');
    expect(state.status).toBe('error');
  });
});
```

**Key Test Cases:**
- ✅ Initial state
- ✅ Action handlers
- ✅ State transitions
- ✅ Error handling
- ✅ Edge cases

---

#### Service Logic Test

**File:** `apps/server/src/modules/[feature]/[feature].service.unit.test.ts`

**What It Tests:** [Brief description]

```typescript
import { make[Feature]Service } from './[feature].service';
import { [Feature]Repository } from './[feature].repo';

describe('[Feature]Service', () => {
  const mockRepo: [Feature]Repository = {
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn()
  };

  const service = make[Feature]Service({ repo: mockRepo });

  it('should create [resource] successfully', async () => {
    const input = { field1: 'value', field2: 42 };
    mockRepo.create.mockResolvedValue({ id: '123', ...input });

    const result = await service.create[Resource](input);

    expect(result.id).toBe('123');
    expect(mockRepo.create).toHaveBeenCalledWith(input);
  });

  it('should throw error for invalid input', async () => {
    const invalidInput = { field1: '' }; // Invalid

    await expect(service.create[Resource](invalidInput))
      .rejects.toThrow('[Expected error message]');
  });
});
```

**Key Test Cases:**
- ✅ Success paths
- ✅ Error handling
- ✅ Input validation
- ✅ Business logic
- ✅ Edge cases

---

### Unit Test Coverage

**Current Coverage:** [Percentage or "Not yet measured"]

**Coverage Goals by Layer:**

| Layer | Goal | Current | Status |
|-------|------|---------|--------|
| Frontend Components | [%] | [%] | [✅ Met / 🚧 In Progress / ❌ Not Met] |
| Hooks | [%] | [%] | [✅ Met / 🚧 In Progress / ❌ Not Met] |
| Redux Slices | [%] | [%] | [✅ Met / 🚧 In Progress / ❌ Not Met] |
| Backend Services | [%] | [%] | [✅ Met / 🚧 In Progress / ❌ Not Met] |
| Backend Repositories | [%] | [%] | [✅ Met / 🚧 In Progress / ❌ Not Met] |
| Utilities | [%] | [%] | [✅ Met / 🚧 In Progress / ❌ Not Met] |

**Generate Coverage Report:**
```bash
pnpm test:coverage
# Open coverage report: open coverage/index.html
```

---

## Integration Tests

### Integration Test Philosophy

**What We Test:**
- API endpoint contracts (request/response)
- Component integration with state management
- Service integration with repositories
- Database operations
- Authentication/authorization flows
- Error propagation through layers

**Test Scope:**
- Multiple components working together
- Full request/response cycle
- Database transactions
- External service integrations (with mocks)

### Framework and Tools

**Testing Framework:** [Vitest]

**Additional Tools:**
- [Supertest] - [Version] - HTTP API testing
- [Test Containers] - [Version] - Database testing (if applicable)
- [MSW] - [Version] - External API mocking

### Test File Locations

**Pattern:** Centralized in `testing/integration/` directory

```
apps/[app-name]/testing/integration/
├─ [feature]/
│  ├─ [feature].api.integration.test.ts       ← API integration
│  ├─ [feature].state.integration.test.ts     ← State integration
│  └─ [feature].workflow.integration.test.ts  ← Workflow integration
└─ setup/
   ├─ testServer.ts                            ← Test server setup
   └─ testDatabase.ts                          ← Test DB setup
```

### Running Integration Tests

```bash
# Run all integration tests
pnpm test:integration

# Run integration tests for specific feature
pnpm test:integration [feature]

# Run integration tests in watch mode
pnpm test:integration:watch

# Run integration tests with database
pnpm test:integration:db
```

### Integration Test Examples

#### API Integration Test

**File:** `apps/server/testing/integration/[feature]/[feature].api.integration.test.ts`

**What It Tests:** [Brief description]

```typescript
import request from 'supertest';
import { createTestServer } from '../setup/testServer';
import { createTestDatabase } from '../setup/testDatabase';

describe('[Feature] API Integration', () => {
  let app;
  let db;
  let authToken;

  beforeAll(async () => {
    db = await createTestDatabase();
    app = createTestServer({ db });

    // Set up authentication
    authToken = await getTestAuthToken();
  });

  afterAll(async () => {
    await db.cleanup();
  });

  describe('GET /api/[feature]/[resource]', () => {
    it('should return list of resources', async () => {
      const response = await request(app)
        .get('/api/[feature]/[resource]')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeArray();
    });

    it('should return 401 without authentication', async () => {
      await request(app)
        .get('/api/[feature]/[resource]')
        .expect(401);
    });
  });

  describe('POST /api/[feature]/[resource]', () => {
    it('should create new resource', async () => {
      const input = { field1: 'value', field2: 42 };

      const response = await request(app)
        .post('/api/[feature]/[resource]')
        .set('Authorization', `Bearer ${authToken}`)
        .send(input)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.field1).toBe(input.field1);
    });

    it('should return 422 for invalid input', async () => {
      const invalidInput = { field1: '' }; // Invalid

      const response = await request(app)
        .post('/api/[feature]/[resource]')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidInput)
        .expect(422);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});
```

**Key Test Cases:**
- ✅ Successful requests
- ✅ Authentication/authorization
- ✅ Validation errors
- ✅ Not found errors
- ✅ Conflict errors

---

#### Component-State Integration Test

**File:** `packages/[package]/testing/integration/[feature]/[feature].state.integration.test.ts`

**What It Tests:** [Brief description]

```typescript
import { renderWithProviders } from '../setup/testUtils';
import { [MainComponent] } from '../../src/components/[MainComponent]';
import { [feature]Slice } from '@scala-cme/shared-redux';

describe('[Feature] Component-State Integration', () => {
  it('should display data from Redux store', () => {
    const mockData = { id: '123', field1: 'value' };

    const { getByText } = renderWithProviders(
      <[MainComponent] />,
      {
        preloadedState: {
          [feature]: { data: mockData, status: 'success' }
        }
      }
    );

    expect(getByText('value')).toBeInTheDocument();
  });

  it('should dispatch action on user interaction', async () => {
    const { getByRole, store } = renderWithProviders(<[MainComponent] />);

    await userEvent.click(getByRole('button', { name: '[button name]' }));

    const state = store.getState();
    expect(state.[feature].status).toBe('loading');
  });
});
```

**Key Test Cases:**
- ✅ State-to-UI rendering
- ✅ UI-to-state updates
- ✅ Side effects
- ✅ Error handling

---

### Integration Test Coverage

**Key Integration Points Tested:**

| Integration Point | Test File | Status |
|-------------------|-----------|--------|
| [API Endpoint 1] | `[file]:line` | [✅ Tested / 🚧 In Progress / ❌ Not Tested] |
| [API Endpoint 2] | `[file]:line` | [✅ Tested / 🚧 In Progress / ❌ Not Tested] |
| [Component + State] | `[file]:line` | [✅ Tested / 🚧 In Progress / ❌ Not Tested] |
| [Service + Repo] | `[file]:line` | [✅ Tested / 🚧 In Progress / ❌ Not Tested] |
| [Auth Flow] | `[file]:line` | [✅ Tested / 🚧 In Progress / ❌ Not Tested] |

---

## End-to-End (E2E) Tests

### E2E Test Philosophy

**What We Test:**
- Complete user workflows from start to finish
- Critical business processes
- Cross-browser compatibility (if applicable)
- Responsive design (mobile/desktop)
- Real-world user scenarios

**Test Scope:**
- Full application running (frontend + backend + database)
- Real browser interactions
- Network requests and responses
- Visual validation

### Framework and Tools

**Testing Framework:** [Playwright/Cypress]

**Version:** [x.x.x]

**Browser Coverage:**
- Chromium (Desktop)
- [Firefox] (if applicable)
- [WebKit/Safari] (if applicable)
- [Mobile browsers] (if applicable)

### Test File Locations

**Pattern:** Centralized in `testing/e2e/` directory

```
apps/[app-name]/testing/e2e/
├─ [feature]/
│  ├─ [workflow1].e2e.test.ts    ← E2E test for workflow 1
│  ├─ [workflow2].e2e.test.ts    ← E2E test for workflow 2
│  └─ [workflow3].e2e.test.ts
├─ fixtures/
│  └─ [feature]Data.ts            ← Test data
└─ setup/
   └─ e2eSetup.ts                 ← E2E setup and teardown
```

### Running E2E Tests

```bash
# Run all E2E tests
pnpm test:e2e

# Run E2E tests for specific feature
pnpm test:e2e [feature]

# Run E2E tests in headed mode (see browser)
pnpm test:e2e:headed

# Run E2E tests in UI mode (Playwright UI)
pnpm test:e2e:ui

# Run E2E tests for specific browser
pnpm test:e2e --project=chromium
```

### E2E Test Examples

#### Critical Workflow Test

**File:** `apps/[app-name]/testing/e2e/[feature]/[critical-workflow].e2e.test.ts`

**What It Tests:** [Brief description of the workflow]

```typescript
import { test, expect } from '@playwright/test';

test.describe('[Feature] - [Critical Workflow]', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to starting point
    await page.goto('/[feature]');

    // Authenticate if needed
    await page.fill('[data-testid="username"]', 'testuser');
    await page.fill('[data-testid="password"]', 'password');
    await page.click('[data-testid="login-button"]');

    // Wait for navigation
    await page.waitForURL('/dashboard');
  });

  test('should complete [workflow] successfully', async ({ page }) => {
    // Step 1: [Action]
    await page.click('[data-testid="[action-button]"]');

    // Step 2: [Fill form]
    await page.fill('[data-testid="field1"]', 'test value');
    await page.fill('[data-testid="field2"]', '42');

    // Step 3: [Submit]
    await page.click('[data-testid="submit-button"]');

    // Verify: [Expected outcome]
    await expect(page.locator('[data-testid="success-message"]'))
      .toContainText('[expected success message]');

    // Verify: [Data persisted]
    await page.reload();
    await expect(page.locator('[data-testid="[data-display]"]'))
      .toContainText('test value');
  });

  test('should handle error gracefully', async ({ page }) => {
    // Step 1: [Trigger error condition]
    await page.fill('[data-testid="field1"]', ''); // Invalid input

    // Step 2: [Submit]
    await page.click('[data-testid="submit-button"]');

    // Verify: [Error displayed]
    await expect(page.locator('[data-testid="error-message"]'))
      .toContainText('[expected error message]');

    // Verify: [Form still editable]
    await expect(page.locator('[data-testid="field1"]')).toBeEditable();
  });
});
```

**Key Test Cases:**
- ✅ Happy path (successful completion)
- ✅ Error handling
- ✅ Navigation flow
- ✅ Data persistence
- ✅ UI feedback

---

### Critical Workflows Tested

**Workflow 1: [Workflow Name]**

**Test File:** `testing/e2e/[feature]/[workflow1].e2e.test.ts`

**Description:** [Brief description of workflow]

**Steps:**
1. [Step 1 - user action]
2. [Step 2 - user action]
3. [Step 3 - user action]
4. [Step 4 - verification]

**Status:** [✅ Tested / 🚧 In Progress / ❌ Not Tested]

---

**Workflow 2: [Workflow Name]**

**Test File:** `testing/e2e/[feature]/[workflow2].e2e.test.ts`

**Description:** [Brief description of workflow]

**Steps:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Status:** [✅ Tested / 🚧 In Progress / ❌ Not Tested]

---

**Workflow 3: [Workflow Name]**

**Test File:** `testing/e2e/[feature]/[workflow3].e2e.test.ts`

**Description:** [Brief description of workflow]

**Steps:**
1. [Step 1]
2. [Step 2]

**Status:** [✅ Tested / 🚧 In Progress / ❌ Not Tested]

---

---

## Test Data Management

### Test Data Strategy

**Approach:** [Describe approach - fixtures, factories, database seeding]

**Data Isolation:** [How test data is isolated between tests]

**Cleanup Strategy:** [How test data is cleaned up]

### Test Fixtures

**Location:** `testing/fixtures/[feature]Data.ts`

```typescript
export const test[Feature]Data = {
  valid[Resource]: {
    field1: 'test value',
    field2: 42,
    field3: { nestedField: 'nested' }
  },

  invalid[Resource]: {
    field1: '', // Invalid - empty
    field2: -1  // Invalid - negative
  },

  multiple[Resources]: [
    { id: '1', field1: 'value1' },
    { id: '2', field1: 'value2' },
    { id: '3', field1: 'value3' }
  ]
};
```

### Test Database Seeding

```bash
# Seed test database
pnpm test:db:seed

# Reset test database
pnpm test:db:reset
```

**Seed Script:** `testing/setup/seedTestData.ts`

### Mocking External Services

**API Mocking (MSW):**

**Location:** `testing/mocks/[feature]Handlers.ts`

```typescript
import { rest } from 'msw';

export const [feature]Handlers = [
  rest.get('/api/external/[resource]', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ data: [...mockData] })
    );
  }),

  rest.post('/api/external/[resource]', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({ success: true, data: {...mockResponse} })
    );
  })
];
```

---

## Coverage Requirements

### Overall Coverage Goals

**Target Coverage:**
- **Statements:** [%]
- **Branches:** [%]
- **Functions:** [%]
- **Lines:** [%]

**Current Coverage:**
- **Statements:** [%]
- **Branches:** [%]
- **Functions:** [%]
- **Lines:** [%]

### Coverage by Layer

| Layer | Target | Current | Gap | Priority |
|-------|--------|---------|-----|----------|
| Frontend Components | [%] | [%] | [%] | [High/Medium/Low] |
| Frontend Hooks | [%] | [%] | [%] | [High/Medium/Low] |
| Redux State | [%] | [%] | [%] | [High/Medium/Low] |
| Backend Services | [%] | [%] | [%] | [High/Medium/Low] |
| Backend Repos | [%] | [%] | [%] | [High/Medium/Low] |
| API Endpoints | [%] | [%] | [%] | [High/Medium/Low] |

### Minimum Coverage Rules

**CI/CD Enforcement:**
- [ ] Unit test coverage must be ≥ [%]
- [ ] All new code must have tests
- [ ] Critical paths must have E2E tests
- [ ] No decrease in coverage allowed

**Coverage Report:**
```bash
pnpm test:coverage
```

---

## Continuous Integration

### CI Test Pipeline

**Platform:** [GitHub Actions/GitLab CI/Jenkins]

**Pipeline Stages:**

1. **Lint & Type Check**
   ```bash
   pnpm lint
   pnpm typecheck
   ```

2. **Unit Tests**
   ```bash
   pnpm test:unit
   ```

3. **Integration Tests**
   ```bash
   pnpm test:integration
   ```

4. **E2E Tests**
   ```bash
   pnpm test:e2e
   ```

5. **Coverage Report**
   ```bash
   pnpm test:coverage
   ```

**CI Configuration:** `.github/workflows/test.yml` (or equivalent)

### Quality Gates

**Required Checks:**
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] Critical E2E tests pass
- [ ] Coverage meets minimum threshold
- [ ] No TypeScript errors
- [ ] No ESLint errors

**PR Requirements:**
- All quality gates must pass before merge
- Coverage cannot decrease
- New features must include tests

---

## Testing Best Practices

### General Principles

1. **Test Behavior, Not Implementation**
   - Focus on what the code does, not how it does it
   - Avoid testing internal state

2. **Arrange-Act-Assert Pattern**
   ```typescript
   // Arrange: Set up test data and conditions
   const input = { field: 'value' };

   // Act: Execute the code being tested
   const result = functionUnderTest(input);

   // Assert: Verify the outcome
   expect(result).toBe(expectedValue);
   ```

3. **Keep Tests Focused**
   - One test should test one thing
   - Use descriptive test names

4. **Avoid Test Interdependence**
   - Each test should be independent
   - Tests should pass in any order

5. **Use Data-Testid Attributes**
   ```tsx
   <button data-testid="submit-button">Submit</button>
   ```

### Testing Anti-Patterns to Avoid

❌ **Don't:**
- Test implementation details
- Write tests that depend on other tests
- Use generic test names like "it works"
- Mock everything (over-mocking)
- Write flaky tests (tests that sometimes fail)
- Skip writing tests for "simple" code

✅ **Do:**
- Test user-facing behavior
- Keep tests isolated and independent
- Use descriptive test names explaining what and why
- Mock only external dependencies
- Fix flaky tests immediately
- Write tests for all code paths

---

## Cross-References

### Related Documentation
- [Requirements](./requirements.md) - Feature requirements and acceptance criteria
- [Architecture](./architecture.md) - Technical design and implementation details
- [API Documentation](./api.md) - API endpoints being tested
- [Feature README](./README.md) - Feature overview

### Testing Infrastructure
- [Testing Setup Guide](/docs/guides/testing-setup.md) - [If applicable]
- [CI/CD Documentation](/docs/guides/ci-cd.md) - [If applicable]

### Related Features
- [Related Feature 1 Testing](/docs/features/[feature]/testing.md) - [If tests interact]
- [Related Feature 2 Testing](/docs/features/[feature]/testing.md) - [If tests interact]

---

**Example Implementation:** See [/docs/features/authentication/testing.md](/docs/features/authentication/testing.md) for a complete reference implementation of this template.
