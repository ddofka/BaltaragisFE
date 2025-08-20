import { useI18n, SUPPORTED_LOCALES, LOCALE_DISPLAY_NAMES, LOCALE_SHORT_NAMES } from '../contexts/I18nContext'

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
          >
            {LOCALE_SHORT_NAMES[supportedLocale]}
          </button>
        ))}
      </div>
    </div>
  )
}

export default LanguageSwitcher
