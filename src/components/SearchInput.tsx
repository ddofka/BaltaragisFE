import { useState, useEffect, useCallback } from 'react'
import { useI18n } from '../contexts/I18nContext'

interface SearchInputProps {
  value: string
  onSearch: (query: string) => void
  placeholder?: string
  debounceMs?: number
}

function SearchInput({ 
  value, 
  onSearch, 
  placeholder = 'Search...', 
  debounceMs = 300 
}: SearchInputProps) {
  const { t } = useI18n()
  const [inputValue, setInputValue] = useState(value)
  
  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== value) {
        onSearch(inputValue)
      }
    }, debounceMs)
    
    return () => clearTimeout(timer)
  }, [inputValue, value, onSearch, debounceMs])
  
  // Update input value when external value changes
  useEffect(() => {
    setInputValue(value)
  }, [value])
  
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }, [])
  
  const handleClear = useCallback(() => {
    setInputValue('')
    onSearch('')
  }, [onSearch])
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear()
    }
  }, [handleClear])
  
  return (
    <div className="search-input-container">
      <div className="search-input-wrapper">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="search-input"
          aria-label={t('products.search_products')}
        />
        
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="search-clear-btn"
            aria-label={t('common.clear_search')}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}

export default SearchInput
