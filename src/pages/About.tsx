import { useI18n } from '../contexts/I18nContext'
import { useEffect, useState, useMemo } from 'react'
import { apiClient } from '../api/generated/client'
import { useSeoMeta } from '../hooks/useSeoMeta'
import LoadingSkeleton from '../components/LoadingSkeleton'

const FALLBACK_IMAGE = '/share-fallback.jpg'

function About() {
  const { t, locale } = useI18n()
  const [page, setPage] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const canonical = useMemo(() => {
    const base = window.location.origin
    return `${base}/${locale}/about`
  }, [locale])

  const breadcrumbJsonLd = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('nav.home'),
        item: `${window.location.origin}/${locale}/`
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('nav.about'),
        item: canonical
      }
    ]
  }), [canonical, locale, t])

  useSeoMeta({
    title: t('about.meta_title'),
    description: t('about.meta_description'),
    canonical,
    image: FALLBACK_IMAGE,
    og: {
      title: t('about.meta_title'),
      description: t('about.meta_description'),
      url: canonical,
      type: 'article',
      locale,
      site_name: 'Baltaragis',
      image: FALLBACK_IMAGE,
    },
    twitter: {
      card: 'summary_large_image',
      title: t('about.meta_title'),
      description: t('about.meta_description'),
      image: FALLBACK_IMAGE,
    },
    jsonLd: breadcrumbJsonLd
  })

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)
    apiClient.getPage('about')
      .then((data) => { if (mounted) setPage(data) })
      .catch((err) => { if (mounted) setError(err instanceof Error ? err.message : String(err)) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  return (
    <div className="page about-page">
      <h1>{t('about.title')}</h1>
      <section className="about-content">
        {loading ? (
          <LoadingSkeleton type="page" />
        ) : error ? (
          <div className="error-state">
            <div className="error-icon" aria-hidden="true">⚠️</div>
            <h2>{t('about.error_loading')}</h2>
            <p>{t('about.error_message')}</p>
            <div className="error-actions">
              <button onClick={() => window.location.reload()} className="btn btn-primary">
                {t('common.retry')}
              </button>
              <button onClick={() => window.location.href = '/'} className="btn btn-secondary">
                {t('common.go_home')}
              </button>
            </div>
          </div>
        ) : page ? (
          <div className="about-markdown" dangerouslySetInnerHTML={{ __html: page.contentMd }} />
        ) : (
          <div className="empty-state">
            <div className="empty-icon" aria-hidden="true">📄</div>
            <h2>{t('about.no_content_title')}</h2>
            <p>{t('about.no_content_message')}</p>
            <div className="empty-actions">
              <button onClick={() => window.location.href = '/'} className="btn btn-primary">
                {t('common.go_home')}
              </button>
            </div>
          </div>
        )}
      </section>
      <section className="about-contact">
        <h2>{t('about.contact')}</h2>
        <p>{t('about.contact_text')}</p>
        <a href="mailto:info@baltaragis.com" className="btn btn-primary">{t('about.contact_cta')}</a>
      </section>
    </div>
  )
}

export default About
