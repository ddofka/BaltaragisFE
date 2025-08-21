import { useI18n, SUPPORTED_LOCALES, LOCALE_DISPLAY_NAMES } from '../contexts/I18nContext'

// Flag emoji mapping for supported locales
const LOCALE_FLAGS = {
  'en-US': '🇺🇸',
  'lt-LT': '🇱🇹'
} as const

function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()

  const handleLocaleChange = (newLocale: string) => {
    if (newLocale !== locale) {
      setLocale(newLocale as any)
    }
  }

  return (
    <div className="language-switcher">
      <div className="language-options">
        {SUPPORTED_LOCALES.map((supportedLocale) => (
          <button
            key={supportedLocale}
            onClick={() => handleLocaleChange(supportedLocale)}
            className={`language-option ${locale === supportedLocale ? 'active' : ''}`}
            title={LOCALE_DISPLAY_NAMES[supportedLocale]}
            aria-label={`Switch to ${LOCALE_DISPLAY_NAMES[supportedLocale]}`}
          >
            <span className="flag-icon" role="img" aria-hidden="true">
              {LOCALE_FLAGS[supportedLocale as keyof typeof LOCALE_FLAGS]}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default LanguageSwitcher
