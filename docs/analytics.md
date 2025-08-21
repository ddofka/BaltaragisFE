# Analytics Integration Guide

This project implements privacy-first analytics with explicit user consent, complying with GDPR and other privacy regulations.

## Overview

- **No tracking by default** - Analytics only load after explicit user consent
- **Deferred loading** - Analytics scripts are loaded asynchronously after consent
- **Cookie banner** - Fully i18n-aware consent banner with Accept/Decline options
- **Consent management** - Users can change preferences via footer link
- **Multiple providers** - Support for Google Analytics 4 and Plausible

## Supported Analytics Providers

### Google Analytics 4 (GA4)

**Environment Variables:**
```bash
VITE_ANALYTICS_PROVIDER=ga4
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Features:**
- Privacy-enhanced measurement
- IP anonymization enabled
- Cookie flags set for security
- Page views and custom events

### Plausible Analytics

**Environment Variables:**
```bash
VITE_ANALYTICS_PROVIDER=plausible
VITE_PLAUSIBLE_DOMAIN=yourdomain.com
VITE_PLAUSIBLE_API_HOST=https://plausible.io  # Optional, defaults to plausible.io
```

**Features:**
- Privacy-focused by design
- No cookies required
- Lightweight script
- Page views and custom events

### No Analytics (Default)

**Environment Variables:**
```bash
VITE_ANALYTICS_PROVIDER=none
# or simply omit analytics variables
```

## Implementation Details

### Consent Flow

1. **Initial Load**: No analytics scripts are loaded
2. **Banner Display**: Cookie banner appears for new users
3. **User Choice**: 
   - **Accept**: Analytics scripts load immediately
   - **Decline**: No scripts load, choice is saved
4. **Persistence**: Choice is saved in localStorage with version tracking
5. **Management**: Users can reopen banner via footer link

### Technical Implementation

```typescript
// Consent is checked before any analytics calls
import { useConsent } from '../contexts/ConsentContext'

function MyComponent() {
  const { hasAnalytics } = useConsent()
  
  if (hasAnalytics) {
    // Analytics is loaded and ready
    trackEvent('button_click', { component: 'MyComponent' })
  }
}
```

### Privacy Features

- **No network requests** before consent
- **Dynamic imports** prevent script loading until needed
- **Version tracking** to re-prompt for updated policies
- **localStorage** for consent persistence (not cookies)
- **IP anonymization** for GA4
- **Secure cookie flags** when applicable

## Configuration

### Environment Variables

Copy `.env.example` to `.env` and set your analytics provider:

```bash
# For Google Analytics 4
VITE_ANALYTICS_PROVIDER=ga4
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX

# For Plausible Analytics  
VITE_ANALYTICS_PROVIDER=plausible
VITE_PLAUSIBLE_DOMAIN=yourdomain.com

# For no analytics (default)
VITE_ANALYTICS_PROVIDER=none
```

### Consent Banner Translations

Add these keys to your translation files:

```json
{
  "cookies": {
    "banner_title": "Cookie Preferences",
    "banner_description": "We use cookies to improve your experience and analyze site usage.",
    "privacy_policy": "Privacy Policy",
    "accept": "Accept",
    "decline": "Decline", 
    "accept_aria": "Accept cookies and enable analytics",
    "decline_aria": "Decline cookies and disable analytics",
    "manage_cookies": "Manage Cookies",
    "manage_preferences": "Manage cookie preferences"
  }
}
```

## Usage Examples

### Page View Tracking

```typescript
import { trackPageView } from '../utils/analytics'

// Track page view (only if consent given)
useEffect(() => {
  trackPageView(location.pathname, document.title)
}, [location])
```

### Event Tracking

```typescript
import { trackEvent } from '../utils/analytics'

// Track custom events (only if consent given)
const handlePurchase = () => {
  trackEvent('purchase', {
    product_id: productId,
    value: price,
    currency: 'EUR'
  })
}
```

### Consent Status

```typescript
import { useConsent } from '../contexts/ConsentContext'

function AnalyticsComponent() {
  const { consentStatus, hasAnalytics, reopenBanner } = useConsent()
  
  if (consentStatus === 'pending') {
    return <div>Waiting for consent...</div>
  }
  
  if (!hasAnalytics) {
    return (
      <div>
        Analytics disabled. 
        <button onClick={reopenBanner}>Change preferences</button>
      </div>
    )
  }
  
  return <div>Analytics active and tracking events</div>
}
```

## Compliance Notes

### GDPR Compliance

- ✅ No tracking before explicit consent
- ✅ Clear, understandable consent banner
- ✅ Easy way to withdraw consent
- ✅ Granular consent (can decline analytics)
- ✅ Privacy policy link provided

### CCPA Compliance

- ✅ Opt-out mechanism available
- ✅ No sale of personal data
- ✅ Transparent data usage

### Cookie Policy

- ✅ No cookies set before consent
- ✅ Analytics cookies only after acceptance
- ✅ Consent stored in localStorage (not cookies)

## Testing

### Verify No Tracking Before Consent

1. Open developer tools → Network tab
2. Clear storage and reload page
3. Verify no requests to analytics domains
4. Click "Decline" on banner
5. Verify still no analytics requests

### Verify Tracking After Consent

1. Open developer tools → Network tab
2. Clear storage and reload page  
3. Click "Accept" on banner
4. Verify analytics script loads
5. Navigate pages and verify tracking calls

### Verify Consent Persistence

1. Accept/decline consent
2. Reload page
3. Verify banner doesn't show again
4. Check localStorage for consent data

## Migration from Other Analytics

### From Universal Analytics (GA3)

1. Get GA4 Measurement ID from Google Analytics
2. Set `VITE_ANALYTICS_PROVIDER=ga4`
3. Set `VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX`
4. Remove old gtag.js script tags

### From Other Providers

1. Choose provider (`ga4` or `plausible`)
2. Set appropriate environment variables
3. Remove old analytics scripts
4. Test consent flow works correctly

## Troubleshooting

### Analytics Not Loading

- Check environment variables are set correctly
- Verify console for any loading errors
- Ensure consent has been accepted
- Check network tab for blocked requests

### Banner Not Showing

- Clear localStorage and reload
- Check if consent was previously given
- Verify translations are loaded
- Check browser console for errors

### Events Not Tracking

- Verify consent status with `hasAnalytics`
- Check analytics provider is configured
- Ensure events are called after script loads
- Use browser developer tools to verify calls
