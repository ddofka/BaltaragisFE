// Performance monitoring utilities
export const measurePerformance = () => {
  // Measure Largest Contentful Paint (LCP)
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      
      if (lastEntry) {
        console.log('LCP:', lastEntry.startTime)
        
        // Send to analytics if available (optional)
        if ((window as any).gtag) {
          (window as any).gtag('event', 'LCP', {
            value: Math.round(lastEntry.startTime),
            event_category: 'Web Vitals'
          })
        }
      }
    })
    
    observer.observe({ entryTypes: ['largest-contentful-paint'] })
  }
  
  // Measure First Input Delay (FID)
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry) => {
        const fidEntry = entry as any
        const fid = fidEntry.processingStart - fidEntry.startTime
        console.log('FID:', fid)
        
        if ((window as any).gtag) {
          (window as any).gtag('event', 'FID', {
            value: Math.round(fid),
            event_category: 'Web Vitals'
          })
        }
      })
    })
    
    observer.observe({ entryTypes: ['first-input'] })
  }
  
  // Measure Cumulative Layout Shift (CLS)
  let clsValue = 0
  let clsEntries: any[] = []
  
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const clsEntry = entry as any
        if (!clsEntry.hadRecentInput) {
          clsValue += clsEntry.value
          clsEntries.push(entry)
        }
      }
      
      console.log('CLS:', clsValue)
      
      if ((window as any).gtag) {
        (window as any).gtag('event', 'CLS', {
          value: clsValue,
          event_category: 'Web Vitals'
        })
      }
    })
    
    observer.observe({ entryTypes: ['layout-shift'] })
  }
}

// Measure route transition performance
export const measureRouteTransition = (route: string) => {
  const start = performance.now()
  
  return () => {
    const duration = performance.now() - start
    console.log(`Route transition to ${route}:`, duration.toFixed(2), 'ms')
    
    if ((window as any).gtag) {
      (window as any).gtag('event', 'route_transition', {
        value: Math.round(duration),
        event_category: 'Navigation',
        event_label: route
      })
    }
  }
}

// Preload critical resources
export const preloadCriticalResources = () => {
  // Preload critical CSS
  const criticalCSS = document.createElement('link')
  criticalCSS.rel = 'preload'
  criticalCSS.as = 'style'
  criticalCSS.href = '/src/index.css'
  document.head.appendChild(criticalCSS)
  
  // Preload critical fonts if any
  // This would be customized based on your font loading strategy
}

// Initialize performance monitoring
export const initPerformanceMonitoring = () => {
  // Only run in production
  if (process.env.NODE_ENV === 'production') {
    measurePerformance()
    preloadCriticalResources()
  }
}
