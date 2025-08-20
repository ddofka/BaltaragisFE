# OpenAPI Integration

This document explains how to work with the OpenAPI specification and generated API client.

## Overview

The frontend integrates with the backend API using an OpenAPI specification that is automatically downloaded and used to generate a typed TypeScript client.

## Files

- `docs/openapi-v0.json` - The OpenAPI specification in JSON format
- `docs/openapi-v0.yaml` - The OpenAPI specification in YAML format  
- `src/api/generated/` - Generated TypeScript client and types

## Updating the OpenAPI Specification

When the backend API changes, you need to re-download the specification:

### 1. Ensure Backend is Running

Make sure your backend API is running on `http://localhost:8080`

### 2. Download New Specification

```bash
# Download JSON format
curl -s http://localhost:8080/v3/api-docs > docs/openapi-v0.json

# Download YAML format (optional)
curl -s http://localhost:8080/v3/api-docs.yaml > docs/openapi-v0.yaml
```

### 3. Regenerate the Client

After updating the specification, regenerate the TypeScript client:

```bash
# The client is manually generated based on the spec
# Review the changes in docs/openapi-v0.json and update:
# - src/api/generated/types.ts
# - src/api/generated/client.ts
# - src/api/generated/index.ts
```

## Generated Client Usage

The generated client provides a type-safe way to interact with the API:

```typescript
import { apiClient } from '@/api/generated';

// Get artist profile
const artist = await apiClient.getArtist();

// Get products with pagination
const products = await apiClient.getProducts({
  q: 'print',
  page: 0,
  size: 12
});

// Get specific product
const product = await apiClient.getProduct('sunset-print');

// Add to waitlist
const status = await apiClient.addToWaitlist('sunset-print', {
  email: 'user@example.com'
});

// Create order
const order = await apiClient.createOrder({
  productSlug: 'sunset-print',
  qty: 1,
  email: 'user@example.com'
});

// Get pages
const pages = await apiClient.getPages();
const page = await apiClient.getPage('about');

// Get translations
const translations = await apiClient.getTranslations('en-US');
```

## Configuration

The client automatically reads the `VITE_API_BASE_URL` environment variable:

```bash
# .env
VITE_API_BASE_URL=http://localhost:8080/api/v1

# .env.production  
VITE_API_BASE_URL=https://api.baltaragis.dev/api/v1
```

## Error Handling

The client includes proper error handling with typed error responses:

```typescript
import { ApiError } from '@/api/generated';

try {
  const product = await apiClient.getProduct('non-existent');
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`API Error ${error.status}: ${error.data.detail}`);
  }
}
```

## Available Endpoints

The generated client includes these key endpoints:

- **Artist**: `GET /api/v1/artist`
- **Products**: `GET /api/v1/products`, `GET /api/v1/products/{slug}`
- **Waitlist**: `POST /api/v1/products/{slug}/waitlist`
- **Orders**: `POST /api/v1/orders`, `POST /api/v1/orders/checkout-session`
- **Pages**: `GET /api/v1/pages`, `GET /api/v1/pages/{slug}`
- **Translations**: `GET /api/v1/i18n/{locale}`, `GET /api/v1/i18n/locales`

## Development Workflow

1. **Backend Changes**: Update backend API endpoints/models
2. **Download Spec**: Re-download OpenAPI specification
3. **Review Changes**: Check what's new/changed in the spec
4. **Update Client**: Manually update generated files if needed
5. **Test**: Verify the client works with new endpoints
6. **Commit**: Commit both spec and client changes

## Notes

- The client is manually generated to keep it lightweight and focused
- All types are automatically exported for use throughout the app
- The client handles common HTTP scenarios (errors, empty responses, etc.)
- Environment-based configuration allows easy switching between dev/prod
