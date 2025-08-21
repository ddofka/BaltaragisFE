# Deployment Guide

## Environment Variables

### Production Deployment

For production builds, ensure the following environment variable is set:

```bash
VITE_API_BASE_URL=https://api.baltaragis.com/api/v1
```

This ensures the frontend connects to the production API endpoint.

### Development

For local development, the default value is:
```bash
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

## Build Process

1. Set the environment variable:
   ```bash
   export VITE_API_BASE_URL=https://api.baltaragis.com/api/v1
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. The build output will be in the `dist/` directory

## Sitemap and Robots.txt

- `robots.txt` is served from the public directory and references the API sitemap
- `sitemap.xml` contains only static routes; dynamic URLs are managed by the API
- Both files are automatically copied to the build output during the build process

## Static File Serving

The following files are served as static assets:
- `/robots.txt` - Search engine crawling instructions
- `/sitemap.xml` - Static routes sitemap
- `/favicon.ico` - Site favicon
- `/share-fallback.jpg` - Social media fallback image
