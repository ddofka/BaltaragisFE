import { useParams, useNavigate } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { useEffect, useState } from 'react'
import { apiClient, ApiError } from '../api/generated/client'
import LoadingSpinner from '../components/LoadingSpinner'

function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useI18n()
  const navigate = useNavigate()
  usePageTitle('product.page_title')

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

  if (loading) {
    return (
      <div className="page product-detail-page">
        <div className="loading-container">
          <LoadingSpinner />
          <p>{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="page product-detail-page">
        <h1>{t('product.not_found_title')}</h1>
        <p>{t('product.not_found_message')}</p>
        <button className="btn btn-primary" onClick={() => navigate('/products')}>{t('product.back_to_products')}</button>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page product-detail-page">
        <h1>{t('product.error_loading')}</h1>
        <p>{t('product.error_message')}</p>
        <div className="error-details">{error}</div>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>{t('common.retry')}</button>
        <button className="btn btn-secondary" onClick={() => navigate('/products')}>{t('product.back_to_products')}</button>
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="page product-detail-page">
      <h1>{product.name}</h1>
      <section className="product-detail">
        <div className="product-gallery">
          {product.photos && product.photos.length > 0 ? (
            <div className="gallery-list">
              {product.photos.map((url: string, idx: number) => (
                <img key={idx} src={url} alt={product.name} className="gallery-photo" loading="lazy" />
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
                <div className="order-success">
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
                  {orderError && <div className="form-error">{orderError}</div>}
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
                <div className="waitlist-success">
                  <h3>{t('product.waitlist_success_title')}</h3>
                  <p>{t('product.waitlist_success_message')}</p>
                </div>
              ) : waitlistStatus === 'ALREADY_SUBSCRIBED' ? (
                <div className="waitlist-info">
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
                  {waitlistError && <div className="form-error">{waitlistError}</div>}
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
