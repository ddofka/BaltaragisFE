import { useState, useEffect } from 'react'
import { apiClient } from '../../api/generated'
import { TranslationResponse, CreateTranslationRequest } from '../../api/generated/types'
import LoadingSpinner from '../../components/LoadingSpinner'

type SupportedLocale = 'en-US' | 'lt-LT'

const LOCALES: { code: SupportedLocale; name: string; flag: string }[] = [
  { code: 'en-US', name: 'English', flag: '🇺🇸' },
  { code: 'lt-LT', name: 'Lithuanian', flag: '🇱🇹' }
]

function TranslationManager() {
  const [translations, setTranslations] = useState<Record<string, Record<SupportedLocale, TranslationResponse | null>>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [newKey, setNewKey] = useState('')
  const [filter, setFilter] = useState('')
  const [bulkImport, setBulkImport] = useState('')
  const [showBulkImport, setShowBulkImport] = useState(false)

  useEffect(() => {
    fetchAllTranslations()
  }, [])

  const fetchAllTranslations = async () => {
    try {
      setLoading(true)
      setError(null)
      const results = await Promise.allSettled(
        LOCALES.map(locale => apiClient.getTranslationsByLocale(locale.code))
      )

      const translationMap: Record<string, Record<SupportedLocale, TranslationResponse | null>> = {}

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const locale = LOCALES[index].code
          result.value.forEach(translation => {
            if (!translationMap[translation.key]) {
              translationMap[translation.key] = {
                'en-US': null,
                'lt-LT': null
              }
            }
            translationMap[translation.key][locale] = translation
          })
        }
      })

      setTranslations(translationMap)
    } catch (err) {
      console.error('Error fetching translations:', err)
      
      // Mock translation data for development
      const mockTranslations: Record<string, Record<SupportedLocale, TranslationResponse | null>> = {
        'home.welcome': {
          'en-US': { id: 1, key: 'home.welcome', locale: 'en-US', value: 'Welcome to Baltaragis Art Gallery', updatedAt: '2024-01-01T00:00:00Z' },
          'lt-LT': { id: 2, key: 'home.welcome', locale: 'lt-LT', value: 'Sveiki atvykę į Baltaragio meno galeriją', updatedAt: '2024-01-01T00:00:00Z' }
        },
        'home.subtitle': {
          'en-US': { id: 3, key: 'home.subtitle', locale: 'en-US', value: 'Discover contemporary art prints and original works', updatedAt: '2024-01-01T00:00:00Z' },
          'lt-LT': { id: 4, key: 'home.subtitle', locale: 'lt-LT', value: 'Atraskite šiuolaikinio meno spaudos darbus ir originalius kūrinius', updatedAt: '2024-01-01T00:00:00Z' }
        },
        'nav.home': {
          'en-US': { id: 5, key: 'nav.home', locale: 'en-US', value: 'Home', updatedAt: '2024-01-01T00:00:00Z' },
          'lt-LT': { id: 6, key: 'nav.home', locale: 'lt-LT', value: 'Pradžia', updatedAt: '2024-01-01T00:00:00Z' }
        },
        'nav.products': {
          'en-US': { id: 7, key: 'nav.products', locale: 'en-US', value: 'Artwork', updatedAt: '2024-01-01T00:00:00Z' },
          'lt-LT': { id: 8, key: 'nav.products', locale: 'lt-LT', value: 'Meno kūriniai', updatedAt: '2024-01-01T00:00:00Z' }
        },
        'nav.about': {
          'en-US': { id: 9, key: 'nav.about', locale: 'en-US', value: 'About', updatedAt: '2024-01-01T00:00:00Z' },
          'lt-LT': { id: 10, key: 'nav.about', locale: 'lt-LT', value: 'Apie', updatedAt: '2024-01-01T00:00:00Z' }
        },
        'cart.title': {
          'en-US': { id: 11, key: 'cart.title', locale: 'en-US', value: 'Shopping Cart', updatedAt: '2024-01-01T00:00:00Z' },
          'lt-LT': { id: 12, key: 'cart.title', locale: 'lt-LT', value: 'Pirkimų krepšelis', updatedAt: '2024-01-01T00:00:00Z' }
        }
      }
      
      setTranslations(mockTranslations)
      setError('Using development translation data. API connection failed.')
    } finally {
      setLoading(false)
    }
  }

  const updateTranslation = async (key: string, locale: SupportedLocale, value: string) => {
    try {
      setSaving(`${key}-${locale}`)
      const data: CreateTranslationRequest = { key, locale, value }
      const result = await apiClient.upsertTranslation(data)
      
      setTranslations(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          [locale]: result
        }
      }))
    } catch (err) {
      setError('Failed to save translation')
      console.error('Error saving translation:', err)
    } finally {
      setSaving(null)
    }
  }

  const deleteTranslation = async (key: string, locale: SupportedLocale) => {
    if (!confirm(`Delete ${locale} translation for "${key}"?`)) return

    try {
      await apiClient.deleteTranslation(key, locale)
      setTranslations(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          [locale]: null
        }
      }))
    } catch (err) {
      setError('Failed to delete translation')
      console.error('Error deleting translation:', err)
    }
  }

  const addNewKey = () => {
    const key = newKey.trim()
    if (!key) return

    if (translations[key]) {
      setError('Translation key already exists')
      return
    }

    setTranslations(prev => ({
      ...prev,
      [key]: {
        'en-US': null,
        'lt-LT': null
      }
    }))
    setNewKey('')
  }

  const handleBulkImport = async () => {
    try {
      const data = JSON.parse(bulkImport)
      await apiClient.bulkUpsertTranslations({ translations: data })
      await fetchAllTranslations()
      setBulkImport('')
      setShowBulkImport(false)
    } catch (err) {
      setError('Failed to import translations. Please check the JSON format.')
      console.error('Error importing translations:', err)
    }
  }

  const exportTranslations = () => {
    const exportData: Record<string, Record<string, string>> = {}
    
    LOCALES.forEach(locale => {
      exportData[locale.code] = {}
      Object.entries(translations).forEach(([key, localeData]) => {
        if (localeData[locale.code]?.value) {
          exportData[locale.code][key] = localeData[locale.code]!.value
        }
      })
    })

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'translations.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const filteredKeys = Object.keys(translations).filter(key =>
    key.toLowerCase().includes(filter.toLowerCase()) ||
    Object.values(translations[key]).some(t => 
      t?.value?.toLowerCase().includes(filter.toLowerCase())
    )
  ).sort()

  if (loading) return <LoadingSpinner />

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '32px 16px' 
    }}>
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: '600', 
          color: '#111827', 
          margin: '0 0 8px 0' 
        }}>
          Translation Manager
        </h1>
        <p style={{ 
          color: '#6b7280', 
          fontSize: '14px', 
          margin: 0 
        }}>
          Manage website translations across multiple languages
        </p>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fef3c7',
          border: '1px solid #fbbf24',
          color: '#92400e',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '24px',
          fontSize: '14px'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Controls */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        padding: '24px',
        marginBottom: '24px'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '12px'
          }}>
            <input
              type="text"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="new.translation.key"
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                width: '200px',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#2563eb'
                e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db'
                e.target.style.boxShadow = 'none'
              }}
              onKeyPress={(e) => e.key === 'Enter' && addNewKey()}
            />
            <button
              onClick={addNewKey}
              style={{
                padding: '8px 16px',
                backgroundColor: '#2563eb',
                color: 'white',
                borderRadius: '6px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#1d4ed8'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#2563eb'}
            >
              Add Key
            </button>
          </div>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '8px'
          }}>
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter translations..."
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                width: '200px',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#2563eb'
                e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db'
                e.target.style.boxShadow = 'none'
              }}
            />
            <button
              onClick={exportTranslations}
              style={{
                padding: '8px 16px',
                backgroundColor: '#059669',
                color: 'white',
                borderRadius: '6px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#047857'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#059669'}
            >
              Export
            </button>
            <button
              onClick={() => setShowBulkImport(!showBulkImport)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#9333ea',
                color: 'white',
                borderRadius: '6px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#7c3aed'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#9333ea'}
            >
              Import
            </button>
          </div>
        </div>

        {/* Bulk Import */}
        {showBulkImport && (
          <div style={{
            marginTop: '24px',
            paddingTop: '24px',
            borderTop: '1px solid #e5e7eb'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '500',
              color: '#111827',
              marginBottom: '12px'
            }}>
              Bulk Import
            </h3>
            <textarea
              value={bulkImport}
              onChange={(e) => setBulkImport(e.target.value)}
              placeholder={`{
  "en-US": {
    "key1": "value1",
    "key2": "value2"
  },
  "lt-LT": {
    "key1": "vertimas1",
    "key2": "vertimas2"
  }
}`}
              rows={8}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '14px',
                outline: 'none',
                resize: 'vertical'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#2563eb'
                e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db'
                e.target.style.boxShadow = 'none'
              }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '8px',
              marginTop: '12px'
            }}>
              <button
                onClick={() => setShowBulkImport(false)}
                style={{
                  padding: '8px 16px',
                  color: '#374151',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#e5e7eb'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#f3f4f6'}
              >
                Cancel
              </button>
              <button
                onClick={handleBulkImport}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#9333ea',
                  color: 'white',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#7c3aed'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#9333ea'}
              >
                Import
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Translation Table */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        overflow: 'hidden'
      }}>
        {filteredKeys.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <svg style={{ 
              width: '48px', 
              height: '48px', 
              color: '#9ca3af', 
              margin: '0 auto 16px auto' 
            }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <h3 style={{ 
              margin: '8px 0 4px 0', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#111827' 
            }}>
              No translations found
            </h3>
            <p style={{ 
              margin: '4px 0 0 0', 
              fontSize: '14px', 
              color: '#6b7280' 
            }}>
              Add translation keys to get started.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse' 
            }}>
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  <th style={{
                    padding: '12px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    Translation Key
                  </th>
                  {LOCALES.map(locale => (
                    <th key={locale.code} style={{
                      padding: '12px 24px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      {locale.flag} {locale.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody style={{ backgroundColor: 'white' }}>
                {filteredKeys.map((key, index) => (
                  <tr 
                    key={key} 
                    style={{
                      borderBottom: index < filteredKeys.length - 1 ? '1px solid #e5e7eb' : 'none',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#f9fafb'}
                    onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                      <div style={{ 
                        fontSize: '14px', 
                        fontWeight: '500', 
                        color: '#111827',
                        fontFamily: 'monospace'
                      }}>
                        {key}
                      </div>
                    </td>
                    {LOCALES.map(locale => {
                      const translation = translations[key][locale.code]
                      const saveKey = `${key}-${locale.code}`
                      const isSaving = saving === saveKey

                      return (
                        <td key={locale.code} style={{ padding: '16px 24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <textarea
                              value={translation?.value || ''}
                              onChange={(e) => {
                                const value = e.target.value
                                if (value !== (translation?.value || '')) {
                                  updateTranslation(key, locale.code, value)
                                }
                              }}
                              style={{
                                flex: 1,
                                padding: '8px 12px',
                                fontSize: '14px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                resize: 'none',
                                outline: 'none'
                              }}
                              onFocus={(e) => {
                                e.target.style.borderColor = '#2563eb'
                                e.target.style.boxShadow = '0 0 0 1px #2563eb'
                              }}
                              onBlur={(e) => {
                                e.target.style.borderColor = '#d1d5db'
                                e.target.style.boxShadow = 'none'
                              }}
                              rows={2}
                              placeholder={`Enter ${locale.name} translation...`}
                            />
                            {isSaving && (
                              <div style={{
                                width: '16px',
                                height: '16px',
                                border: '2px solid #2563eb',
                                borderTop: '2px solid transparent',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                              }} />
                            )}
                            {translation && (
                              <button
                                onClick={() => deleteTranslation(key, locale.code)}
                                style={{
                                  padding: '4px',
                                  color: '#f87171',
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  borderRadius: '4px',
                                  transition: 'color 0.2s'
                                }}
                                title="Delete translation"
                                onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#dc2626'}
                                onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#f87171'}
                              >
                                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-6 text-sm text-gray-500">
        <p>Total translation keys: {filteredKeys.length}</p>
      </div>
    </div>
  )
}

export default TranslationManager
