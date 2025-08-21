import { Link } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import { useEffect, useState, useMemo } from 'react'
import { apiClient } from '../api/generated/client'
import { useSeoMeta } from '../hooks/useSeoMeta'

const FALLBACK_IMAGE = '/share-fallback.jpg'

function Home() {
  const { t, locale } = useI18n()
  const [artist, setArtist] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const canonical = useMemo(() => {
    const base = window.location.origin
    return `${base}/${locale}/`
  }, [locale])

  const breadcrumbJsonLd = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('nav.home'),
        item: canonical
      }
    ]
  }), [canonical, t])

  useSeoMeta({
    title: t('home.meta_title'),
    description: t('home.meta_description'),
    canonical,
    image: artist?.heroImageUrl || FALLBACK_IMAGE,
    og: {
      title: t('home.meta_title'),
      description: t('home.meta_description'),
      url: canonical,
      type: 'website',
      locale,
      site_name: 'Baltaragis',
      image: artist?.heroImageUrl || FALLBACK_IMAGE,
    },
    twitter: {
      card: 'summary_large_image',
      title: t('home.meta_title'),
      description: t('home.meta_description'),
      image: artist?.heroImageUrl || FALLBACK_IMAGE,
    },
    jsonLd: breadcrumbJsonLd
  })

  useEffect(() => {
    let mounted = true
    setLoading(true)
    Promise.all([
      apiClient.getArtist(),
      apiClient.getProducts({ page: 0, size: 6 })
    ]).then(([artistData, productsData]) => {
      if (mounted) {
        setArtist(artistData)
        setProducts(productsData.content || [])
      }
    }).finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  // Responsive srcSet for hero image (simulate @2x if not provided)
  const getSrcSet = (url: string) => `${url} 1x, ${url.replace(/(\.[a-z]+)$/, '@2x$1')} 2x`
  const heroSizes = '(max-width: 600px) 100vw, 800px'
  const featuredSizes = '(max-width: 600px) 100vw, 280px'

  return (
    <div className="page home-page">
      <section className="hero">
        {artist && artist.heroImageUrl && (
          <div className="hero-image aspect-ratio-16-9">
            <img
              src={artist.heroImageUrl}
              srcSet={getSrcSet(artist.heroImageUrl)}
              sizes={heroSizes}
              alt={t('home.hero_image_alt') + ' ' + artist.name}
              loading="eager"
              className="hero-img"
            />
          </div>
        )}
        <h1>{artist ? artist.name : t('home.welcome')}</h1>
        <p>{artist ? artist.bio : t('home.subtitle')}</p>
        <div className="hero-actions">
          <Link to="/products" className="btn btn-primary">
            {t('home.view_artwork')}
          </Link>
          <Link to="/about" className="btn btn-secondary">
            {t('home.learn_more')}
          </Link>
        </div>
      </section>
      <section className="featured">
        <h2>{t('home.featured_works')}</h2>
        <p>{t('home.featured_description')}</p>
        <div className="featured-products-grid">
          {loading ? (
            <div>{t('common.loading')}</div>
          ) : products.length > 0 ? (
            products.map(product => (
              <Link to={`/products/${product.slug}`} key={product.id} className="featured-product-card">
                <div className="featured-product-image aspect-ratio-1-1">
                  {product.thumbnailUrl ? (
                    <img
                      src={product.thumbnailUrl}
                      srcSet={getSrcSet(product.thumbnailUrl)}
                      sizes={featuredSizes}
                      alt={t('products.product_image_alt') + ' ' + product.name}
                      loading="lazy"
                      className="featured-product-img"
                    />
                  ) : (
                    <div className="product-image-placeholder"><span>🎨</span></div>
                  )}
                </div>
                <div className="featured-product-info">
                  <div className="featured-product-name">{product.name}</div>
                  <div className="featured-product-price">{product.price} {product.currency}</div>
                </div>
              </Link>
            ))
          ) : (
            <div>{t('home.no_featured_products')}</div>
          )}
        </div>
        <Link to="/products" className="btn btn-outline">
          {t('home.browse_all')}
        </Link>
      </section>
    </div>
  )
}

export default Home
