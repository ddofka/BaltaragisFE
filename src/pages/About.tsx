import { useI18n } from '../contexts/I18nContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { useEffect, useState } from 'react'
import { apiClient } from '../api/generated/client'

function useMeta(title: string, description: string, image?: string) {
  useEffect(() => {
    document.title = title
    const metaDesc = document.querySelector('meta[name="description"]') || document.createElement('meta')
    metaDesc.setAttribute('name', 'description')
    metaDesc.setAttribute('content', description)
    document.head.appendChild(metaDesc)
    // OpenGraph
    const ogTitle = document.querySelector('meta[property="og:title"]') || document.createElement('meta')
    ogTitle.setAttribute('property', 'og:title')
    ogTitle.setAttribute('content', title)
    document.head.appendChild(ogTitle)
    const ogDesc = document.querySelector('meta[property="og:description"]') || document.createElement('meta')
    ogDesc.setAttribute('property', 'og:description')
    ogDesc.setAttribute('content', description)
    document.head.appendChild(ogDesc)
    if (image) {
      const ogImg = document.querySelector('meta[property="og:image"]') || document.createElement('meta')
      ogImg.setAttribute('property', 'og:image')
      ogImg.setAttribute('content', image)
      document.head.appendChild(ogImg)
    }
    return () => {
      // Optionally clean up
    }
  }, [title, description, image])
}

function About() {
  const { t } = useI18n()
  usePageTitle('about.page_title')
  const [page, setPage] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useMeta(
    t('about.meta_title'),
    t('about.meta_description')
  )

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
          <div>{t('common.loading')}</div>
        ) : error ? (
          <div className="form-error">{t('about.error_loading')}</div>
        ) : page ? (
          <div className="about-markdown" dangerouslySetInnerHTML={{ __html: page.contentMd }} />
        ) : null}
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
