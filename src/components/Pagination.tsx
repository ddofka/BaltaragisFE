import { useI18n } from '../contexts/I18nContext'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onSizeChange: (size: number) => void
  currentSize: number
  availableSizes: number[]
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  onSizeChange,
  currentSize,
  availableSizes
}: PaginationProps) {
  const { t } = useI18n()
  
  // Calculate visible page numbers
  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []
    
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }
    
    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }
    
    rangeWithDots.push(...range)
    
    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }
    
    return rangeWithDots
  }
  
  const visiblePages = getVisiblePages()
  
  const handlePageClick = (page: number) => {
    if (page !== currentPage && page >= 0 && page < totalPages) {
      onPageChange(page)
    }
  }
  
  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value)
    onSizeChange(newSize)
  }
  
  if (totalPages <= 1) {
    return null
  }
  
  return (
    <div className="pagination-container" role="navigation" aria-label={t('common.pagination')}>
      <div className="pagination-controls">
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 0}
          className="pagination-btn pagination-prev"
          aria-label={t('common.previous_page')}
        >
          ← {t('common.previous')}
        </button>
        
        <div className="pagination-pages">
          {visiblePages.map((page, index) => (
            <span key={index}>
              {page === '...' ? (
                <span className="pagination-ellipsis">...</span>
              ) : (
                <button
                  onClick={() => handlePageClick(page as number - 1)}
                  className={`pagination-btn pagination-page ${
                    page === currentPage + 1 ? 'active' : ''
                  }`}
                  aria-label={`${t('common.go_to_page')} ${page}`}
                  aria-current={page === currentPage + 1 ? 'page' : undefined}
                >
                  {page}
                </button>
              )}
            </span>
          ))}
        </div>
        
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className="pagination-btn pagination-next"
          aria-label={t('common.next_page')}
        >
          {t('common.next')} →
        </button>
      </div>
      
      <div className="pagination-size-selector">
        <label htmlFor="page-size" className="size-label">
          {t('common.items_per_page')}:
        </label>
        <select
          id="page-size"
          value={currentSize}
          onChange={handleSizeChange}
          className="size-select"
          aria-label={t('common.select_items_per_page')}
        >
          {availableSizes.map(size => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default Pagination
