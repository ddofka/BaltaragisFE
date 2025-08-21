import { useI18n } from '../contexts/I18nContext'

interface LoadingSkeletonProps {
  type: 'grid' | 'detail' | 'page' | 'card'
  count?: number
}

function LoadingSkeleton({ type, count = 1 }: LoadingSkeletonProps) {
  const { t } = useI18n()

  if (type === 'grid') {
    return (
      <div className="loading-skeleton-grid" aria-label={t('common.loading')}>
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-image aspect-ratio-1-1"></div>
            <div className="skeleton-content">
              <div className="skeleton-line skeleton-title"></div>
              <div className="skeleton-line skeleton-price"></div>
              <div className="skeleton-line skeleton-status"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'detail') {
    return (
      <div className="loading-skeleton-detail" aria-label={t('common.loading')}>
        <div className="skeleton-gallery">
          <div className="skeleton-image aspect-ratio-1-1"></div>
        </div>
        <div className="skeleton-info">
          <div className="skeleton-line skeleton-title-large"></div>
          <div className="skeleton-line skeleton-description"></div>
          <div className="skeleton-line skeleton-description"></div>
          <div className="skeleton-line skeleton-price"></div>
          <div className="skeleton-button"></div>
        </div>
      </div>
    )
  }

  if (type === 'page') {
    return (
      <div className="loading-skeleton-page" aria-label={t('common.loading')}>
        <div className="skeleton-line skeleton-title-large"></div>
        <div className="skeleton-line skeleton-description"></div>
        <div className="skeleton-line skeleton-description"></div>
        <div className="skeleton-line skeleton-description short"></div>
      </div>
    )
  }

  if (type === 'card') {
    return (
      <div className="skeleton-card" aria-label={t('common.loading')}>
        <div className="skeleton-image aspect-ratio-1-1"></div>
        <div className="skeleton-content">
          <div className="skeleton-line skeleton-title"></div>
          <div className="skeleton-line skeleton-price"></div>
          <div className="skeleton-line skeleton-status"></div>
        </div>
      </div>
    )
  }

  return null
}

export default LoadingSkeleton
