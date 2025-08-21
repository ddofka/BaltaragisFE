import { cacheManager, generateCacheKey } from './cache'
import { apiClient } from '../api/generated'

// Track prefetched routes to avoid duplicate prefetching
const prefetchedRoutes = new Set<string>()

// Prefetch a product detail page
export const prefetchProduct = async (slug: string): Promise<void> => {
  const route = `/products/${slug}`
  
  // Skip if already prefetched
  if (prefetchedRoutes.has(route)) return
  
  try {
    // Prefetch the product data
    const cacheKey = generateCacheKey('product', { slug })
    const cached = await cacheManager.get(cacheKey)
    
    if (!cached) {
      // Fetch and cache the product data
      const product = await apiClient.getProduct(slug)
      cacheManager.set(cacheKey, product)
    }
    
    // Mark as prefetched
    prefetchedRoutes.add(route)
    
    // Prefetch the route component (React Router will handle this)
    // This is a lightweight operation that just ensures the route is ready
    await import('../pages/ProductDetail')
    
    console.debug(`Prefetched product: ${slug}`)
  } catch (error) {
    console.debug(`Prefetch failed for product: ${slug}`, error)
  }
}

// Prefetch multiple products (useful for pagination)
export const prefetchProducts = async (slugs: string[]): Promise<void> => {
  const promises = slugs.map(slug => prefetchProduct(slug))
  await Promise.allSettled(promises)
}

// Clear prefetch cache (useful for testing or memory management)
export const clearPrefetchCache = (): void => {
  prefetchedRoutes.clear()
}
