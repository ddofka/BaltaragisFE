import { useI18n } from '../contexts/I18nContext'
import { useConsent } from '../contexts/ConsentContext'

function CookieBanner() {
  const { t } = useI18n()
  const { showBanner, acceptConsent, declineConsent } = useConsent()

  if (!showBanner) return null

  return (
    <div className="cookie-banner" role="dialog" aria-labelledby="cookie-banner-title" aria-describedby="cookie-banner-description">
      <div className="cookie-banner-content">
        <div className="cookie-banner-text">
          <h3 id="cookie-banner-title">{t('cookies.banner_title')}</h3>
          <p id="cookie-banner-description">
            {t('cookies.banner_description')}
            {' '}
            <a href="/privacy" className="cookie-banner-link">
              {t('cookies.privacy_policy')}
            </a>
          </p>
        </div>
        <div className="cookie-banner-actions">
          <button 
            onClick={declineConsent}
            className="btn btn-secondary cookie-btn-decline"
            aria-label={t('cookies.decline_aria')}
          >
            {t('cookies.decline')}
          </button>
          <button 
            onClick={acceptConsent}
            className="btn btn-primary cookie-btn-accept"
            aria-label={t('cookies.accept_aria')}
          >
            {t('cookies.accept')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CookieBanner
