# Baltaragis Frontend

Artist portfolio and shop frontend application with OpenAPI integration.

## Project Structure

```
├── docs/
│   ├── openapi-v0.json      # OpenAPI specification (JSON)
│   ├── openapi-v0.yaml      # OpenAPI specification (YAML)
│   └── openapi.md           # OpenAPI integration documentation
├── src/
│   └── api/
│       └── generated/       # Generated TypeScript API client
│           ├── types.ts      # TypeScript interfaces
│           ├── client.ts     # API client implementation
│           └── index.ts      # Export file
├── .env.example             # Environment configuration example
├── package.json             # Project dependencies
└── tsconfig.json            # TypeScript configuration
```

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your API configuration
   ```

3. **Type check:**
   ```bash
   npm run type-check
   ```

## OpenAPI Integration

This project automatically integrates with the backend API using OpenAPI specifications. See [docs/openapi.md](docs/openapi.md) for detailed information on:

- Updating the API specification
- Regenerating the TypeScript client
- Using the generated API client
- Error handling and configuration

## API Client Usage

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
```

## Development

- **TypeScript**: Strict mode enabled with path mapping
- **API Client**: Lightweight, type-safe HTTP client
- **Environment**: Configurable via `VITE_API_BASE_URL`
- **Error Handling**: Comprehensive error handling with typed responses

## Available Scripts

- `npm run type-check` - TypeScript compilation check
- `npm run dev` - Development server (not yet configured)
- `npm run build` - Build process (not yet configured)