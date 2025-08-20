import { useEffect, useState } from 'react'
import { apiClient } from '@/api/generated'

interface ConnectivityStatus {
  artist: boolean
  products: boolean
  loading: boolean
}

function ConnectivityCheck() {
  const [status, setStatus] = useState<ConnectivityStatus>({
    artist: false,
    products: false,
    loading: true
  })

  useEffect(() => {
    const checkConnectivity = async () => {
      try {
        console.log('🔌 Checking API connectivity...')
        
        // Check artist endpoint
        try {
          const artist = await apiClient.getArtist()
          console.log('✅ Artist endpoint working:', artist.name)
          setStatus(prev => ({ ...prev, artist: true }))
        } catch (error) {
          console.error('❌ Artist endpoint failed:', error)
        }

        // Check products endpoint
        try {
          const products = await apiClient.getProducts({ page: 0, size: 1 })
          console.log('✅ Products endpoint working:', products.totalElements, 'total products')
          setStatus(prev => ({ ...prev, products: true }))
        } catch (error) {
          console.error('❌ Products endpoint failed:', error)
        }

      } catch (error) {
        console.error('❌ Connectivity check failed:', error)
      } finally {
        setStatus(prev => ({ ...prev, loading: false }))
      }
    }

    checkConnectivity()
  }, [])

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="connectivity-check">
      <details>
        <summary>🔌 API Connectivity Status</summary>
        <div className="connectivity-status">
          {status.loading ? (
            <p>Checking connectivity...</p>
          ) : (
            <>
              <p>
                Artist API: {status.artist ? '✅ Connected' : '❌ Failed'}
              </p>
              <p>
                Products API: {status.products ? '✅ Connected' : '❌ Failed'}
              </p>
              <p>
                Base URL: {(import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'}
              </p>
              <p>
                Environment: {process.env.NODE_ENV}
              </p>
              <p>
                VITE_API_BASE_URL: {(import.meta as any).env?.VITE_API_BASE_URL || 'NOT SET'}
              </p>
            </>
          )}
        </div>
      </details>
    </div>
  )
}

export default ConnectivityCheck
