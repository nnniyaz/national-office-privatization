# E2E Tests for Server Backend

## Overview

This directory contains end-to-end tests for the server backend, focusing on:
- MlString type serialization and validation
- Domain model behavior with multilingual support
- Enterprise domain with extended schema

## Running Tests

### Run all E2E tests

```bash
cd server
go test ./tests/e2e/... -v
```

### Run with custom cache (if needed)

```bash
cd server
bash scripts/test_server.sh
```

### Run specific test file

```bash
cd server
go test ./tests/e2e/mlstring_test.go -v
go test ./tests/e2e/enterprise_domain_test.go -v
go test ./tests/e2e/event_domain_test.go -v
```

### Run specific test

```bash
cd server
go test ./tests/e2e/... -run TestMlString_JSONSerialization -v
go test ./tests/e2e/... -run TestEnterprise_NewEnterprise_Success -v
```

## Test Coverage

### MlString Tests (`mlstring_test.go`)
- ✅ JSON serialization (object and backward-compatible string)
- ✅ Get method with language selection
- ✅ Fallback chain (requested lang → kz → ru → en)
- ✅ Validation (at least one language required)
- ✅ Marshal/Unmarshal round-trip

### Enterprise Tests (`enterprise_domain_test.go`)
- ✅ NewEnterprise with all 27 fields
- ✅ Validation (name, location, industry, governmentShare)
- ✅ Update method with all fields
- ✅ All getter methods

### Event Tests (`event_domain_test.go`)
- ✅ NewEvent with MlString name and desc
- ✅ Validation (empty name should fail)
- ✅ Update with new MlString values
- ✅ Language getter and fallback

### News Tests (`news_domain_test.go`)
- ✅ NewNews with MlString title and content
- ✅ Validation (empty title/content should fail)
- ✅ Update with multilingual content
- ✅ Preserve all languages

### Partner Tests (`partner_domain_test.go`)
- ✅ NewPartner with MlString name
- ✅ Validation (empty name/link should fail)
- ✅ Update with new name

### Document Tests (`document_domain_test.go`)
- ✅ NewDocument with MlString title
- ✅ Validation (empty title/filename should fail)
- ✅ Update method

### Mission Tests (`mission_domain_test.go`)
- ✅ NewMission with MlString text
- ✅ Validation (empty text should fail)
- ✅ Update method
- ✅ Partial language support with fallback

### Employee Tests (`employee_domain_test.go`)
- ✅ NewEmployee with MlString name
- ✅ Validation (empty name should fail)
- ✅ Update method

## Test Dependencies

Make sure you have testify installed:

```bash
go get github.com/stretchr/testify
```

## What's Tested

### ✅ Type Safety
- MlString properly handles JSON encoding/decoding
- Backward compatibility with plain strings

### ✅ Validation
- At least one language must be present
- Required fields are validated
- Numeric constraints are enforced (e.g., governmentShare >= 0)

### ✅ Business Logic
- Domain models create with proper defaults
- Update methods work correctly
- Getters return expected values

### ✅ Multilingual Support
- All three languages (kz, ru, en) are preserved
- Fallback chain works as expected
- Partial language support is valid

## Expected Output

```
PASS
ok      github.com/nnniyaz/nop/server/tests/e2e    0.XXXs
```

All tests should pass without errors.

## Adding New Tests

When adding new domain models or modifying existing ones:

1. Create a new test file: `{domain}_domain_test.go`
2. Test creation, validation, updates
3. Test MlString fields specifically
4. Run tests to verify

## CI/CD Integration

These tests can be integrated into your CI pipeline:

```yaml
# Example GitHub Actions
- name: Run E2E Tests
  run: |
    cd server
    go test ./tests/e2e/... -v
```

## Notes

- Tests use in-memory domain objects (no database required)
- Focus on domain logic and type safety
- Database integration tests should be added separately
- HTTP endpoint tests should use httptest package

