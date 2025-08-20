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

3. **Start development server:**
   ```bash
   npm run dev
   ```
   The app will be available at http://localhost:5173

4. **Type check:**
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

## Development

### Running the App

- **Development server**: `npm run dev` - Starts at http://localhost:5173
- **Build**: `npm run build` - Creates production build in `dist/`
- **Preview**: `npm run preview` - Preview production build locally
- **Type check**: `npm run type-check` - TypeScript compilation check

### Backend Configuration

The app automatically connects to your backend API using the `VITE_API_BASE_URL` environment variable:

```bash
# .env
VITE_API_BASE_URL=http://localhost:8080/api/v1

# Point to different backend
VITE_API_BASE_URL=https://api.baltaragis.dev/api/v1
```

### API Client Location

The typed API client is located in `src/api/generated/`:
- `types.ts` - TypeScript interfaces for all API models
- `client.ts` - Lightweight HTTP client implementation
- `index.ts` - Export file for easy importing

### Updating the API Client

When the backend API changes:

1. **Re-download the OpenAPI spec:**
   ```bash
   curl -s http://localhost:8080/v3/api-docs > docs/openapi-v0.json
   ```

2. **Update the generated files** in `src/api/generated/` based on the new spec
3. **Test connectivity** - the app will automatically check API endpoints on startup

### CORS Configuration

The backend is already configured to allow requests from:
- Frontend: http://localhost:5173 (Vite dev server)
- Backend: http://localhost:8080

## Available Scripts