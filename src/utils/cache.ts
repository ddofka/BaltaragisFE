interface CacheEntry<T> {
  data: T
  timestamp: number
  etag?: string
}

class CacheManager {
  private cache = new Map<string, CacheEntry<any>>()
  private readonly maxAge = 5 * 60 * 1000 // 5 minutes
  private readonly staleWhileRevalidate = 10 * 60 * 1000 // 10 minutes

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key)
    if (!entry) return null

    const now = Date.now()
    const age = now - entry.timestamp

    // Return cached data if fresh
    if (age < this.maxAge) {
      return entry.data
    }

    // Return stale data if within revalidation window
    if (age < this.staleWhileRevalidate) {
      return entry.data
    }

    // Remove expired entry
    this.cache.delete(key)
    return null
  }

  set<T>(key: string, data: T, etag?: string): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      etag
    })
  }

  invalidate(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key)
      }
    }
  }

  clear(): void {
    this.cache.clear()
  }
}

export const cacheManager = new CacheManager()

// Cache key generator
export const generateCacheKey = (endpoint: string, params?: Record<string, any>): string => {
  if (!params) return endpoint
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&')
  return `${endpoint}?${sortedParams}`
}
