import { Link } from 'react-router-dom'
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

function Home() {
  const { t } = useI18n()
  usePageTitle('home.page_title')
  const [artist, setArtist] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useMeta(
    t('home.meta_title'),
    t('home.meta_description'),
    artist?.heroImageUrl
  )

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

  return (
    <div className="page home-page">
      <section className="hero">
        {artist && artist.heroImageUrl && (
          <img src={artist.heroImageUrl} alt={artist.name} className="hero-image" loading="eager" />
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
                {product.thumbnailUrl ? (
                  <img src={product.thumbnailUrl} alt={product.name} className="featured-product-img" loading="lazy" />
                ) : (
                  <div className="product-image-placeholder"><span>🎨</span></div>
                )}
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
