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
      setError('Failed to load translations')
      console.error('Error fetching translations:', err)
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
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="new.translation.key"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && addNewKey()}
              />
              <button
                onClick={addNewKey}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Key
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter translations..."
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={exportTranslations}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Export
            </button>
            <button
              onClick={() => setShowBulkImport(!showBulkImport)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Import
            </button>
          </div>
        </div>

        {/* Bulk Import */}
        {showBulkImport && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Bulk Import</h3>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
            />
            <div className="flex justify-end space-x-2 mt-3">
              <button
                onClick={() => setShowBulkImport(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkImport}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Import
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Translation Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredKeys.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No translations found</h3>
            <p className="mt-1 text-sm text-gray-500">Add translation keys to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Translation Key
                  </th>
                  {LOCALES.map(locale => (
                    <th key={locale.code} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {locale.flag} {locale.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredKeys.map(key => (
                  <tr key={key} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 font-mono">{key}</div>
                    </td>
                    {LOCALES.map(locale => {
                      const translation = translations[key][locale.code]
                      const saveKey = `${key}-${locale.code}`
                      const isSaving = saving === saveKey

                      return (
                        <td key={locale.code} className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <textarea
                              value={translation?.value || ''}
                              onChange={(e) => {
                                const value = e.target.value
                                if (value !== (translation?.value || '')) {
                                  updateTranslation(key, locale.code, value)
                                }
                              }}
                              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                              rows={2}
                              placeholder={`Enter ${locale.name} translation...`}
                            />
                            {isSaving && (
                              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            )}
                            {translation && (
                              <button
                                onClick={() => deleteTranslation(key, locale.code)}
                                className="p-1 text-red-400 hover:text-red-600 transition-colors"
                                title="Delete translation"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
