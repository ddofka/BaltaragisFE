import { useParams, useNavigate } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import { apiClient, ApiError } from '../api/generated/client'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { useSeoMeta } from '../hooks/useSeoMeta'

const FALLBACK_IMAGE = '/share-fallback.jpg'

function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { t, locale } = useI18n()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [product, setProduct] = useState<any>(null)
  const [orderQty, setOrderQty] = useState(1)
  const [orderEmail, setOrderEmail] = useState('')
  const [orderLoading, setOrderLoading] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [waitlistEmail, setWaitlistEmail] = useState('')
  const [waitlistLoading, setWaitlistLoading] = useState(false)
  const [waitlistError, setWaitlistError] = useState<string | null>(null)
  const [waitlistStatus, setWaitlistStatus] = useState<null | 'ADDED' | 'ALREADY_SUBSCRIBED' | 'NOT_ELIGIBLE'>(null)

  // Gallery state for keyboard navigation
  const [galleryIdx, setGalleryIdx] = useState(0)
  const galleryRef = useRef<HTMLDivElement>(null)

  // Keyboard navigation for gallery
  const handleGalleryKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!product?.photos?.length) return
    if (e.key === 'ArrowRight') {
      setGalleryIdx((idx) => (idx + 1) % product.photos.length)
    } else if (e.key === 'ArrowLeft') {
      setGalleryIdx((idx) => (idx - 1 + product.photos.length) % product.photos.length)
    }
  }, [product])

  // Responsive srcSet for gallery images (simulate @2x if not provided)
  const getSrcSet = (url: string) => `${url} 1x, ${url.replace(/(\.[a-z]+)$/, '@2x$1')} 2x`
  const gallerySizes = '(max-width: 800px) 100vw, 600px'

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setError(null)
    setNotFound(false)
    apiClient.getProduct(slug)
      .then(setProduct)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true)
        } else {
          setError(err instanceof Error ? err.message : String(err))
        }
      })
      .finally(() => setLoading(false))
  }, [slug])

  // SEO meta, OG, Twitter, canonical, JSON-LD
  const canonical = useMemo(() => {
    const base = window.location.origin
    return `${base}/${locale}/products/${slug}`
  }, [locale, slug])

  const image = product?.photos?.[0] || FALLBACK_IMAGE

  const productJsonLd = useMemo(() => {
    if (!product) return undefined
    return {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: product.name,
      image: product.photos && product.photos.length > 0 ? product.photos : [FALLBACK_IMAGE],
      description: product.longDesc,
      sku: product.slug,
      offers: {
        '@type': 'Offer',
        priceCurrency: product.currency,
        price: product.price,
        availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        url: canonical,
      },
    }
  }, [product, canonical])

  const breadcrumbJsonLd = useMemo(() => {
    if (!product) return undefined
    return {
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
          name: t('nav.products'),
          item: `${window.location.origin}/${locale}/products`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: product.name,
          item: canonical
        }
      ]
    }
  }, [product, canonical, locale, t])

  useSeoMeta({
    title: product ? `${product.name} – Baltaragis` : t('product.page_title'),
    description: product ? product.longDesc : t('product.meta_description'),
    canonical,
    image,
    og: {
      title: product ? `${product.name} – Baltaragis` : t('product.page_title'),
      description: product ? product.longDesc : t('product.meta_description'),
      url: canonical,
      type: 'product',
      locale,
      site_name: 'Baltaragis',
      image,
    },
    twitter: {
      card: 'summary_large_image',
      title: product ? `${product.name} – Baltaragis` : t('product.page_title'),
      description: product ? product.longDesc : t('product.meta_description'),
      image,
    },
    jsonLd: [productJsonLd, breadcrumbJsonLd].filter(Boolean)
  })

  if (loading) {
    return (
      <div className="page product-detail-page">
        <LoadingSkeleton type="detail" />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="page product-detail-page">
        <div className="error-state">
          <div className="error-icon" aria-hidden="true">🎨</div>
          <h1>{t('product.not_found_title')}</h1>
          <p>{t('product.not_found_message')}</p>
          <div className="error-actions">
            <button className="btn btn-primary" onClick={() => navigate('/products')}>
              {t('product.back_to_products')}
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/')}>
              {t('common.go_home')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page product-detail-page">
        <div className="error-state">
          <div className="error-icon" aria-hidden="true">⚠️</div>
          <h1>{t('product.error_loading')}</h1>
          <p>{t('product.error_message')}</p>
          {process.env.NODE_ENV === 'development' && (
            <div className="error-details">{error}</div>
          )}
          <div className="error-actions">
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              {t('common.retry')}
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/products')}>
              {t('product.back_to_products')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="page product-detail-page">
      <h1>{product.name}</h1>
      <section className="product-detail">
        <div
          className="product-gallery aspect-ratio-1-1"
          tabIndex={0}
          ref={galleryRef}
          onKeyDown={handleGalleryKeyDown}
          aria-label={t('product.gallery_aria_label') + ' ' + product.name}
        >
          {product.photos && product.photos.length > 0 ? (
            <div className="gallery-list">
              {product.photos.map((url: string, idx: number) => (
                <GalleryImage
                  key={idx}
                  url={url}
                  alt={t('product.gallery_image_alt') + ' ' + product.name + ' ' + (idx + 1)}
                  active={galleryIdx === idx}
                  onClick={() => setGalleryIdx(idx)}
                  srcSet={getSrcSet(url)}
                  sizes={gallerySizes}
                />
              ))}
            </div>
          ) : (
            <div className="product-image-placeholder large"><span role="img" aria-label="Artwork">🎨</span></div>
          )}
        </div>
        <div className="product-info">
          <h2>{t('product.details')}</h2>
          <p>{product.longDesc}</p>
          <div className="product-meta">
            <p><strong>{t('product.price')}:</strong> {product.price} {product.currency}</p>
            <p><strong>{t('product.availability')}:</strong> {product.inStock ? t('product.in_stock') : t('product.out_of_stock')}</p>
          </div>
          {/* In-stock order form */}
          {product.inStock && (
            <div className="order-form">
              {orderSuccess ? (
                <div className="order-success" aria-live="polite">
                  <h3>{t('product.order_success_title')}</h3>
                  <p>{t('product.order_success_message')}</p>
                </div>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault()
                    setOrderLoading(true)
                    setOrderError(null)
                    try {
                      await apiClient.createOrder({
                        productSlug: product.slug,
                        qty: orderQty,
                        email: orderEmail.trim(),
                      })
                      setOrderSuccess(true)
                    } catch (err) {
                      if (err instanceof ApiError && err.data) {
                        if (err.status === 400) {
                          setOrderError(t('product.order_error_400'))
                        } else if (err.status === 409) {
                          setOrderError(t('product.order_error_409'))
                        } else if (err.data.detail) {
                          setOrderError(err.data.detail)
                        } else {
                          setOrderError(t('product.order_error_generic'))
                        }
                      } else {
                        setOrderError(t('product.order_error_generic'))
                      }
                    } finally {
                      setOrderLoading(false)
                    }
                  }}
                  className="order-fields"
                  aria-live="polite"
                >
                  <div className="form-group">
                    <label htmlFor="qty">{t('product.quantity')}</label>
                    <select
                      id="qty"
                      value={orderQty}
                      onChange={e => setOrderQty(Number(e.target.value))}
                      disabled={orderLoading}
                    >
                      {Array.from({ length: product.quantity }, (_, i) => i + 1).map(qty => (
                        <option key={qty} value={qty}>{qty}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">{t('product.email')}</label>
                    <input
                      id="email"
                      type="email"
                      value={orderEmail}
                      onChange={e => setOrderEmail(e.target.value)}
                      required
                      disabled={orderLoading}
                      placeholder={t('product.email_placeholder')}
                    />
                  </div>
                  {orderError && <div className="form-error" aria-live="assertive">{orderError}</div>}
                  <button type="submit" className="btn btn-primary" disabled={orderLoading || !orderEmail}>
                    {orderLoading ? t('common.loading') : t('product.buy_now')}
                  </button>
                </form>
              )}
            </div>
          )}
          {/* Out-of-stock waitlist form */}
          {!product.inStock && (
            <div className="waitlist-form">
              {waitlistStatus === 'ADDED' ? (
                <div className="waitlist-success" aria-live="polite">
                  <h3>{t('product.waitlist_success_title')}</h3>
                  <p>{t('product.waitlist_success_message')}</p>
                </div>
              ) : waitlistStatus === 'ALREADY_SUBSCRIBED' ? (
                <div className="waitlist-info" aria-live="polite">
                  <h3>{t('product.waitlist_already_title')}</h3>
                  <p>{t('product.waitlist_already_message')}</p>
                </div>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault()
                    setWaitlistLoading(true)
                    setWaitlistError(null)
                    setWaitlistStatus(null)
                    try {
                      const status = await apiClient.addToWaitlist(product.slug, { email: waitlistEmail.trim() })
                      setWaitlistStatus(status)
                    } catch (err) {
                      if (err instanceof ApiError && err.data) {
                        if (err.status === 400) {
                          setWaitlistError(t('product.waitlist_error_400'))
                        } else if (err.status === 409) {
                          setWaitlistError(t('product.waitlist_error_409'))
                        } else if (err.data.detail) {
                          setWaitlistError(err.data.detail)
                        } else {
                          setWaitlistError(t('product.waitlist_error_generic'))
                        }
                      } else {
                        setWaitlistError(t('product.waitlist_error_generic'))
                      }
                    } finally {
                      setWaitlistLoading(false)
                    }
                  }}
                  className="waitlist-fields"
                  aria-live="polite"
                >
                  <div className="form-group">
                    <label htmlFor="waitlist-email">{t('product.email')}</label>
                    <input
                      id="waitlist-email"
                      type="email"
                      value={waitlistEmail}
                      onChange={e => setWaitlistEmail(e.target.value)}
                      required
                      disabled={waitlistLoading}
                      placeholder={t('product.email_placeholder')}
                    />
                  </div>
                  {waitlistError && <div className="form-error" aria-live="assertive">{waitlistError}</div>}
                  <button type="submit" className="btn btn-primary" disabled={waitlistLoading || !waitlistEmail}>
                    {waitlistLoading ? t('common.loading') : t('product.waitlist_notify_me')}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default ProductDetail

// GalleryImage subcomponent
function GalleryImage({ url, alt, active, onClick, srcSet, sizes }: { url: string, alt: string, active: boolean, onClick: () => void, srcSet: string, sizes: string }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  return (
    <button
      className={`gallery-image-btn${active ? ' active' : ''}`}
      tabIndex={active ? 0 : -1}
      aria-current={active}
      aria-label={alt}
      onClick={onClick}
      style={{ outline: active ? '2px solid #3498db' : undefined }}
    >
      <div className="gallery-image aspect-ratio-1-1">
        <img
          src={url}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          loading="lazy"
          className={`gallery-img ${imgLoaded ? 'loaded' : 'blur'}`}
          onLoad={() => setImgLoaded(true)}
        />
        {!imgLoaded && <div className="gallery-image-skeleton" aria-hidden="true"></div>}
      </div>
    </button>
  )
}
