import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { apiClient } from '@/api/generated'

// Supported locales
export const SUPPORTED_LOCALES = ['en-US', 'lt-LT'] as const
export type SupportedLocale = typeof SUPPORTED_LOCALES[number]

// Locale display names
export const LOCALE_DISPLAY_NAMES: Record<SupportedLocale, string> = {
  'en-US': 'English',
  'lt-LT': 'Lietuvių'
}

// Locale short names
export const LOCALE_SHORT_NAMES: Record<SupportedLocale, string> = {
  'en-US': 'EN',
  'lt-LT': 'LT'
}

// i18n context interface
interface I18nContextType {
  locale: SupportedLocale
  setLocale: (locale: SupportedLocale) => void
  t: (key: string) => string
  isLoading: boolean
  isInitializing: boolean
  error: string | null
}

// Create context
const I18nContext = createContext<I18nContextType | undefined>(undefined)

// Provider component
interface I18nProviderProps {
  children: ReactNode
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<SupportedLocale>('en-US')
  const [translations, setTranslations] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isInitializing, setIsInitializing] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Determine initial locale on app boot
  useEffect(() => {
    const determineInitialLocale = async () => {
      try {
        // Priority 1: User choice from localStorage
        const savedLocale = localStorage.getItem('baltaragis-locale') as SupportedLocale
        if (savedLocale && SUPPORTED_LOCALES.includes(savedLocale)) {
          setLocaleState(savedLocale)
          setIsInitializing(false)
          return
        }

        // Priority 2: Check backend for IP-based locale
        try {
          const backendLocale = await apiClient.getCurrentLocale()
          if (SUPPORTED_LOCALES.includes(backendLocale as SupportedLocale)) {
            const finalLocale = backendLocale as SupportedLocale
            setLocaleState(finalLocale)
            // Persist the backend-detected locale
            localStorage.setItem('baltaragis-locale', finalLocale)
            setIsInitializing(false)
            return
          }
        } catch (error) {
          console.log('Could not determine backend locale, falling back to Accept-Language')
        }

        // Priority 3: Accept-Language header
        const acceptLanguage = navigator.language
        let detectedLocale: SupportedLocale = 'en-US' // Default fallback
        
        if (acceptLanguage.startsWith('lt')) {
          detectedLocale = 'lt-LT'
        }
        
        setLocaleState(detectedLocale)
        // Persist the Accept-Language detected locale
        localStorage.setItem('baltaragis-locale', detectedLocale)
        setIsInitializing(false)
      } catch (error) {
        console.error('Error determining initial locale:', error)
        setLocaleState('en-US') // Final fallback
        localStorage.setItem('baltaragis-locale', 'en-US')
        setIsInitializing(false)
      }
    }

    determineInitialLocale()
  }, [])

  // Fetch translations when locale changes
  useEffect(() => {
    const fetchTranslations = async () => {
      if (!locale) return

      setIsLoading(true)
      setError(null)

      try {
        const fetchedTranslations = await apiClient.getTranslations(locale)
        setTranslations(fetchedTranslations)
      } catch (error) {
        console.error(`Failed to fetch translations for ${locale}:`, error)
        setError(`Failed to load ${LOCALE_DISPLAY_NAMES[locale]} translations`)
        
        // Fallback to English if current locale fails
        if (locale !== 'en-US') {
          try {
            const fallbackTranslations = await apiClient.getTranslations('en-US')
            setTranslations(fallbackTranslations)
            setLocaleState('en-US')
          } catch (fallbackError) {
            console.error('Failed to load fallback translations:', fallbackError)
            // Use empty translations as last resort
            setTranslations({})
          }
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchTranslations()
  }, [locale])

  // Set locale and persist to localStorage
  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale)
    localStorage.setItem('baltaragis-locale', newLocale)
  }

  // Translation function with fallback
  const t = (key: string): string => {
    // Return translation if available
    if (translations[key]) {
      return translations[key]
    }

    // Fallback to English if not current locale
    if (locale !== 'en-US') {
      console.warn(`Translation key "${key}" not found for locale ${locale}`)
    }

    // Return key as fallback (or could return English fallback if available)
    return key
  }

  const value: I18nContextType = {
    locale,
    setLocale,
    t,
    isLoading,
    isInitializing,
    error
  }

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

// Hook to use i18n context
export function useI18n(): I18nContextType {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}
