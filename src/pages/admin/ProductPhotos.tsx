import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiClient } from '../../api/generated'
import { ProductPhoto, Product } from '../../api/generated/types'
import LoadingSpinner from '../../components/LoadingSpinner'

function ProductPhotos() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [photos, setPhotos] = useState<ProductPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  useEffect(() => {
    if (id) {
      fetchData(parseInt(id))
    }
  }, [id])

  const fetchData = async (productId: number) => {
    try {
      setLoading(true)
      const [productData, photosData] = await Promise.all([
        apiClient.getProductByIdAdmin(productId),
        apiClient.getPhotosByProductId(productId)
      ])
      setProduct(productData)
      setPhotos(photosData.sort((a, b) => a.sortOrder - b.sortOrder))
    } catch (err) {
      setError('Failed to load product photos')
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || !id) return

    const validFiles = Array.from(files).filter(file => {
      const isImage = file.type.startsWith('image/')
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB limit
      return isImage && isValidSize
    })

    if (validFiles.length === 0) {
      setError('Please select valid image files (max 10MB each)')
      return
    }

    setUploading(true)
    setError(null)

    try {
      const uploadPromises = validFiles.map(file => 
        apiClient.uploadProductPhoto(parseInt(id), file)
      )
      
      await Promise.all(uploadPromises)
      await fetchData(parseInt(id)) // Refresh the photos list
    } catch (err) {
      setError('Failed to upload photos')
      console.error('Error uploading photos:', err)
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileUpload(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const updatePhotoOrder = async (photoId: number, newSortOrder: number) => {
    try {
      await apiClient.updateProductPhoto(photoId, { sortOrder: newSortOrder })
      await fetchData(parseInt(id!))
    } catch (err) {
      setError('Failed to update photo order')
      console.error('Error updating photo order:', err)
    }
  }

  const updatePhotoAlt = async (photoId: number, alt: string) => {
    try {
      await apiClient.updateProductPhoto(photoId, { alt })
      setPhotos(photos.map(p => p.id === photoId ? { ...p, alt } : p))
    } catch (err) {
      setError('Failed to update photo alt text')
      console.error('Error updating photo alt:', err)
    }
  }

  const deletePhoto = async (photoId: number) => {
    if (!confirm('Are you sure you want to delete this photo?')) return

    try {
      await apiClient.deleteProductPhoto(photoId)
      setPhotos(photos.filter(p => p.id !== photoId))
    } catch (err) {
      setError('Failed to delete photo')
      console.error('Error deleting photo:', err)
    }
  }

  const movePhoto = async (photoId: number, direction: 'up' | 'down') => {
    const currentIndex = photos.findIndex(p => p.id === photoId)
    if (currentIndex === -1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= photos.length) return

    const newSortOrder = photos[newIndex].sortOrder
    await updatePhotoOrder(photoId, newSortOrder)
  }

  if (loading) return <LoadingSpinner />

  if (!product) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <button
            onClick={() => navigate('/admin/products')}
            className="text-blue-600 hover:text-blue-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-2">
          <button
            onClick={() => navigate('/admin/products')}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Photos for "{product.name}"
          </h1>
        </div>
        <p className="text-gray-600">Manage product photos and their display order</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Upload Area */}
      <div className="mb-8">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-gray-600">Uploading photos...</p>
            </div>
          ) : (
            <>
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-lg font-medium text-gray-900 mb-2">Upload Product Photos</p>
              <p className="text-gray-600 mb-4">Drag and drop photos here, or click to select files</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Select Photos
              </label>
              <p className="text-xs text-gray-500 mt-2">Supports JPEG, PNG, WebP. Max 10MB per file.</p>
            </>
          )}
        </div>
      </div>

      {/* Photos Grid */}
      {photos.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No photos</h3>
          <p className="mt-1 text-sm text-gray-500">Upload photos to showcase this product.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo, index) => (
            <div key={photo.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="aspect-square bg-gray-100 relative">
                <img
                  src={photo.url}
                  alt={photo.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs font-medium">
                  #{photo.sortOrder}
                </div>
              </div>
              
              <div className="p-4">
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Alt Text</label>
                  <input
                    type="text"
                    value={photo.alt}
                    onChange={(e) => updatePhotoAlt(photo.id, e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe the image"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => movePhoto(photo.id, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => movePhoto(photo.id, 'down')}
                      disabled={index === photos.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  
                  <button
                    onClick={() => deletePhoto(photo.id)}
                    className="p-1 text-red-400 hover:text-red-600 transition-colors"
                    title="Delete photo"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductPhotos
