# Performance Optimization Guide

## Overview

This document outlines the performance optimizations implemented in the Baltaragis Frontend to achieve Lighthouse Performance scores ≥ 90.

## Implemented Optimizations

### 1. Code Splitting

**What it does:**
- Splits the main bundle into smaller, logical chunks
- Loads only the code needed for the current route
- Reduces initial bundle size and improves LCP (Largest Contentful Paint)

**Implementation:**
- Uses React.lazy() for route-based code splitting
- Wraps routes with Suspense for loading states
- Manual chunk splitting for vendor libraries

**Bundle Analysis:**
```
Before: 237.22 kB (gzipped: 75.67 kB)
After:  185.71 kB (gzipped: 59.19 kB) - Main bundle
         + Vendor: 11.87 kB (gzipped: 4.24 kB)
         + Router: 32.67 kB (gzipped: 12.17 kB)
         + Pages: 0.30-8.21 kB each
```

**Improvement:** 22% reduction in main bundle size

### 2. Intelligent Prefetching

**What it does:**
- Prefetches product detail pages on hover
- Reduces perceived loading time for product navigation
- Implements intent-based loading

**Implementation:**
- `onMouseEnter` triggers prefetch for product details
- Prefetches both component and API data
- Avoids duplicate prefetching with tracking

### 3. Stale-While-Revalidate Caching

**What it does:**
- Shows cached data immediately while refreshing in background
- Improves perceived performance
- Reduces API calls for repeated requests

**Cache Strategy:**
- **Fresh:** 0-5 minutes (serve from cache)
- **Stale:** 5-10 minutes (serve from cache + refresh background)
- **Expired:** >10 minutes (fetch fresh data)

**Implementation:**
- Cache manager with TTL-based invalidation
- ETag support for conditional requests
- Background refresh for stale data

### 4. Bundle Optimization

**What it does:**
- Removes unused code (tree shaking)
- Optimizes chunk sizes
- Drops console/debugger in production

**Configuration:**
```typescript
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom'],
        router: ['react-router-dom']
      }
    }
  },
  minify: 'esbuild',
  esbuildOptions: {
    drop: ['console', 'debugger']
  }
}
```

## Performance Monitoring

### Core Web Vitals Tracking

The application automatically tracks:
- **LCP (Largest Contentful Paint)** - Loading performance
- **FID (First Input Delay)** - Interactivity
- **CLS (Cumulative Layout Shift)** - Visual stability

### Route Transition Metrics

- Measures navigation performance
- Tracks time between route changes
- Reports to analytics if available

## Measuring Performance

### 1. Lighthouse Audit

Run Lighthouse in Chrome DevTools:
1. Open DevTools → Lighthouse tab
2. Select "Performance" category
3. Run audit on Products and Product Detail pages
4. Target: Performance score ≥ 90

### 2. Bundle Analysis

```bash
# Build with analysis
npm run build:analyze

# Check bundle sizes
npm run build
# Look for chunk sizes in output
```

### 3. Real User Monitoring

Performance metrics are automatically collected:
- Core Web Vitals
- Route transitions
- Cache hit rates

## Performance Targets

### Lighthouse Scores
- **Performance:** ≥ 90
- **Accessibility:** ≥ 90
- **Best Practices:** ≥ 90
- **SEO:** ≥ 90

### Core Web Vitals
- **LCP:** < 2.5s
- **FID:** < 100ms
- **CLS:** < 0.1

### Bundle Metrics
- **Main Bundle:** < 200kB (gzipped)
- **Total JS:** < 250kB (gzipped)
- **Initial Load:** < 1s on 3G

## Optimization Checklist

- [x] Code splitting implemented
- [x] Route-based lazy loading
- [x] Product prefetching on hover
- [x] Stale-while-revalidate caching
- [x] Bundle optimization
- [x] Performance monitoring
- [x] Core Web Vitals tracking

## Future Optimizations

### Potential Improvements
1. **Image Optimization**
   - WebP format support
   - Responsive images
   - Lazy loading for below-fold images

2. **Service Worker**
   - Offline support
   - Background sync
   - Push notifications

3. **Critical CSS Inlining**
   - Extract above-fold styles
   - Inline critical CSS
   - Defer non-critical styles

4. **HTTP/2 Push**
   - Preload critical resources
   - Server push for dependencies

## Troubleshooting

### Common Issues

1. **Bundle Size Increased**
   - Check for new dependencies
   - Analyze bundle with `npm run build:analyze`
   - Review manual chunks configuration

2. **Performance Regression**
   - Check Core Web Vitals in DevTools
   - Review cache invalidation logic
   - Monitor route transition times

3. **Prefetch Not Working**
   - Verify hover events are firing
   - Check network tab for prefetch requests
   - Ensure prefetch utility is imported

### Debug Mode

Enable debug logging:
```typescript
// In development, prefetch logs are visible
console.debug(`Prefetched product: ${slug}`)
```
