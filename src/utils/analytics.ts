// Analytics utilities with privacy-first approach
// This module is only loaded after explicit user consent

// Configuration
const ANALYTICS_CONFIG = {
  // Set your analytics provider and config here
  provider: (import.meta as any).env?.VITE_ANALYTICS_PROVIDER || 'none', // 'ga4', 'plausible', or 'none'
  
  // Google Analytics 4
  ga4MeasurementId: (import.meta as any).env?.VITE_GA4_MEASUREMENT_ID,
  
  // Plausible
  plausibleDomain: (import.meta as any).env?.VITE_PLAUSIBLE_DOMAIN,
  plausibleApiHost: (import.meta as any).env?.VITE_PLAUSIBLE_API_HOST || 'https://plausible.io',
}

// Track page views
export function trackPageView(path: string, title?: string) {
  if (ANALYTICS_CONFIG.provider === 'ga4' && (window as any).gtag) {
    (window as any).gtag('config', ANALYTICS_CONFIG.ga4MeasurementId, {
      page_path: path,
      page_title: title,
    })
  } else if (ANALYTICS_CONFIG.provider === 'plausible' && (window as any).plausible) {
    (window as any).plausible('pageview', {
      u: window.location.origin + path
    })
  }
}

// Track custom events
export function trackEvent(eventName: string, parameters: Record<string, any> = {}) {
  if (ANALYTICS_CONFIG.provider === 'ga4' && (window as any).gtag) {
    (window as any).gtag('event', eventName, parameters)
  } else if (ANALYTICS_CONFIG.provider === 'plausible' && (window as any).plausible) {
    (window as any).plausible(eventName, { props: parameters })
  }
}

// Initialize analytics after consent
export async function initializeAnalytics() {
  console.log('🔒 Initializing analytics after user consent...')
  
  try {
    if (ANALYTICS_CONFIG.provider === 'ga4' && ANALYTICS_CONFIG.ga4MeasurementId) {
      await loadGoogleAnalytics()
    } else if (ANALYTICS_CONFIG.provider === 'plausible' && ANALYTICS_CONFIG.plausibleDomain) {
      await loadPlausible()
    } else {
      console.log('📊 No analytics provider configured or analytics disabled')
    }
  } catch (error) {
    console.error('❌ Error initializing analytics:', error)
  }
}

// Load Google Analytics 4
async function loadGoogleAnalytics() {
  return new Promise<void>((resolve, reject) => {
    try {
      // Load gtag script
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.ga4MeasurementId}`
      script.onload = () => {
        // Initialize gtag
        ;(window as any).dataLayer = (window as any).dataLayer || []
        ;(window as any).gtag = function() {
          ;(window as any).dataLayer.push(arguments)
        }
        ;(window as any).gtag('js', new Date())
        ;(window as any).gtag('config', ANALYTICS_CONFIG.ga4MeasurementId, {
          anonymize_ip: true,
          cookie_flags: 'SameSite=None;Secure'
        })
        
        console.log('✅ Google Analytics 4 loaded')
        resolve()
      }
      script.onerror = reject
      document.head.appendChild(script)
    } catch (error) {
      reject(error)
    }
  })
}

// Load Plausible Analytics
async function loadPlausible() {
  return new Promise<void>((resolve, reject) => {
    try {
      const script = document.createElement('script')
      script.defer = true
      script.setAttribute('data-domain', ANALYTICS_CONFIG.plausibleDomain!)
      script.src = `${ANALYTICS_CONFIG.plausibleApiHost}/js/plausible.js`
      script.onload = () => {
        console.log('✅ Plausible Analytics loaded')
        resolve()
      }
      script.onerror = reject
      document.head.appendChild(script)
    } catch (error) {
      reject(error)
    }
  })
}

// Export config for documentation
export { ANALYTICS_CONFIG }
