import { Link } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import { useSeoMeta } from '../hooks/useSeoMeta'
import { useMemo } from 'react'

const FALLBACK_IMAGE = '/share-fallback.jpg'

function NotFound() {
  const { t, locale } = useI18n()

  const canonical = useMemo(() => {
    const base = window.location.origin
    return `${base}/${locale}/404`
  }, [locale])

  useSeoMeta({
    title: t('notfound.page_title'),
    description: t('notfound.meta_description'),
    canonical,
    image: FALLBACK_IMAGE,
    og: {
      title: t('notfound.page_title'),
      description: t('notfound.meta_description'),
      url: canonical,
      type: 'website',
      locale,
      site_name: 'Baltaragis',
      image: FALLBACK_IMAGE,
    },
    twitter: {
      card: 'summary_large_image',
      title: t('notfound.page_title'),
      description: t('notfound.meta_description'),
      image: FALLBACK_IMAGE,
    }
  })

  return (
    <div className="page notfound-page">
      <div className="error-state">
        <div className="error-icon" aria-hidden="true">🎨</div>
        <h1>{t('notfound.title')}</h1>
        <p>{t('notfound.message')}</p>
        <div className="error-actions">
          <Link to="/" className="btn btn-primary">
            {t('notfound.go_home')}
          </Link>
          <Link to="/products" className="btn btn-secondary">
            {t('notfound.browse_products')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
