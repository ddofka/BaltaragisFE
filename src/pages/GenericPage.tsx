import { useParams } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import { useEffect, useState, useMemo } from 'react'
import { apiClient } from '../api/generated/client'
import { useSeoMeta } from '../hooks/useSeoMeta'

const FALLBACK_IMAGE = '/share-fallback.jpg'

function GenericPage() {
  const { slug } = useParams<{ slug: string }>()
  const { t, locale } = useI18n()
  const [page, setPage] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const canonical = useMemo(() => {
    const base = window.location.origin
    return `${base}/${locale}/pages/${slug}`
  }, [locale, slug])

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
        name: page?.title || slug,
        item: canonical
      }
    ]
  }), [canonical, locale, t, page, slug])

  useSeoMeta({
    title: page?.title ? `${page.title} – Baltaragis` : t('page.page_title'),
    description: page?.contentMd ? page.contentMd.slice(0, 160) : t('page.meta_description'),
    canonical,
    image: FALLBACK_IMAGE,
    og: {
      title: page?.title ? `${page.title} – Baltaragis` : t('page.page_title'),
      description: page?.contentMd ? page.contentMd.slice(0, 160) : t('page.meta_description'),
      url: canonical,
      type: 'article',
      locale,
      site_name: 'Baltaragis',
      image: FALLBACK_IMAGE,
    },
    twitter: {
      card: 'summary_large_image',
      title: page?.title ? `${page.title} – Baltaragis` : t('page.page_title'),
      description: page?.contentMd ? page.contentMd.slice(0, 160) : t('page.meta_description'),
      image: FALLBACK_IMAGE,
    },
    jsonLd: breadcrumbJsonLd
  })

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)
    if (!slug) return
    apiClient.getPage(slug)
      .then((data) => { if (mounted) setPage(data) })
      .catch((err) => { if (mounted) setError(err instanceof Error ? err.message : String(err)) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [slug])

  return (
    <div className="page generic-page">
      <h1>{page?.title || t('page.title')}</h1>
      <section className="page-content">
        {loading ? (
          <div>{t('common.loading')}</div>
        ) : error ? (
          <div className="form-error">{t('page.error_loading')}</div>
        ) : page ? (
          <div className="page-markdown" dangerouslySetInnerHTML={{ __html: page.contentMd }} />
        ) : null}
      </section>
    </div>
  )
}

export default GenericPage
