import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type ConsentStatus = 'pending' | 'accepted' | 'declined'

interface ConsentContextType {
  consentStatus: ConsentStatus
  showBanner: boolean
  acceptConsent: () => void
  declineConsent: () => void
  reopenBanner: () => void
  hasAnalytics: boolean
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined)

const CONSENT_STORAGE_KEY = 'baltaragis-cookie-consent'
const CONSENT_VERSION = '1.0' // Increment to show banner again for policy changes

interface ConsentProviderProps {
  children: ReactNode
}

export function ConsentProvider({ children }: ConsentProviderProps) {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>('pending')
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check for existing consent
    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY)
      if (stored) {
        const consent = JSON.parse(stored)
        if (consent.version === CONSENT_VERSION) {
          setConsentStatus(consent.status)
          setShowBanner(false)
        } else {
          // Version mismatch, show banner again
          setShowBanner(true)
        }
      } else {
        // No stored consent, show banner
        setShowBanner(true)
      }
    } catch (error) {
      console.error('Error reading consent from localStorage:', error)
      setShowBanner(true)
    }
  }, [])

  const saveConsent = (status: ConsentStatus) => {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({
        status,
        version: CONSENT_VERSION,
        timestamp: new Date().toISOString()
      }))
    } catch (error) {
      console.error('Error saving consent to localStorage:', error)
    }
  }

  const acceptConsent = () => {
    setConsentStatus('accepted')
    setShowBanner(false)
    saveConsent('accepted')
    
    // Load analytics after consent
    loadAnalytics()
  }

  const declineConsent = () => {
    setConsentStatus('declined')
    setShowBanner(false)
    saveConsent('declined')
  }

  const reopenBanner = () => {
    setShowBanner(true)
  }

  const loadAnalytics = async () => {
    // Only load analytics if consent is accepted
    if (consentStatus !== 'accepted') return

    try {
      // Dynamically import analytics module
      const { initializeAnalytics } = await import('../utils/analytics')
      initializeAnalytics()
    } catch (error) {
      console.error('Error loading analytics:', error)
    }
  }

  // Load analytics if consent was previously accepted
  useEffect(() => {
    if (consentStatus === 'accepted') {
      loadAnalytics()
    }
  }, [consentStatus])

  const value: ConsentContextType = {
    consentStatus,
    showBanner,
    acceptConsent,
    declineConsent,
    reopenBanner,
    hasAnalytics: consentStatus === 'accepted'
  }

  return (
    <ConsentContext.Provider value={value}>
      {children}
    </ConsentContext.Provider>
  )
}

export function useConsent(): ConsentContextType {
  const context = useContext(ConsentContext)
  if (context === undefined) {
    throw new Error('useConsent must be used within a ConsentProvider')
  }
  return context
}
