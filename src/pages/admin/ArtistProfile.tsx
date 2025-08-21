import { useState, useEffect } from 'react'
import { apiClient } from '../../api/generated'
import { ArtistDto, UpdateArtistProfileRequest } from '../../api/generated/types'
import LoadingSpinner from '../../components/LoadingSpinner'

function ArtistProfile() {
  const [artist, setArtist] = useState<ArtistDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    heroImageUrl: '',
    socials: ''
  })

  useEffect(() => {
    fetchArtist()
  }, [])

  const fetchArtist = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getArtist()
      setArtist(data)
      setFormData({
        name: data.name,
        bio: data.bio,
        heroImageUrl: data.heroImageUrl,
        socials: data.socials
      })
    } catch (err) {
      setError('Failed to load artist profile')
      console.error('Error fetching artist:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      setError('Artist name is required')
      return
    }

    try {
      setSaving(true)
      setError(null)
      setSuccess(null)

      const updateData: UpdateArtistProfileRequest = {
        name: formData.name,
        bio: formData.bio || undefined,
        heroImageUrl: formData.heroImageUrl || undefined,
        socials: formData.socials || undefined
      }
      
      await apiClient.updateArtistProfile(updateData)
      setSuccess('Artist profile updated successfully!')
      
      // Refresh the data
      await fetchArtist()
    } catch (err: any) {
      setError('Failed to update artist profile')
      console.error('Error updating artist profile:', err)
    } finally {
      setSaving(false)
    }
  }

  const formatSocials = (socials: string) => {
    try {
      const parsed = JSON.parse(socials)
      return JSON.stringify(parsed, null, 2)
    } catch {
      return socials
    }
  }

  const handleSocialsChange = (value: string) => {
    setFormData(prev => ({ ...prev, socials: value }))
  }

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
          Artist Profile
        </h1>
        <p style={{ 
          color: '#6b7280', 
          fontSize: '14px', 
          margin: 0 
        }}>
          Manage your artist information and branding
        </p>
      </div>

      <div className="max-w-2xl">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Artist Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your artist name"
              required
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
              Artist Bio
            </label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tell your story, describe your artistic journey, style, and inspiration..."
            />
            <p className="text-xs text-gray-500 mt-1">
              This will be displayed on your about page and artist profile
            </p>
          </div>

          <div>
            <label htmlFor="heroImageUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Hero Image URL
            </label>
            <input
              type="url"
              id="heroImageUrl"
              value={formData.heroImageUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, heroImageUrl: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com/hero-image.jpg"
            />
            {formData.heroImageUrl && (
              <div className="mt-3">
                <p className="text-sm text-gray-700 mb-2">Preview:</p>
                <img
                  src={formData.heroImageUrl}
                  alt="Hero image preview"
                  className="w-full max-w-md h-32 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="socials" className="block text-sm font-medium text-gray-700 mb-2">
              Social Media Links (JSON)
            </label>
            <textarea
              id="socials"
              value={formatSocials(formData.socials)}
              onChange={(e) => handleSocialsChange(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              placeholder={`{
  "website": "https://example.com",
  "instagram": "https://instagram.com/artist",
  "twitter": "https://twitter.com/artist",
  "facebook": "https://facebook.com/artist",
  "youtube": "https://youtube.com/artist"
}`}
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter social media links as JSON. These will be displayed on your artist profile.
            </p>
          </div>

          {artist && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Current Profile Info</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Last Updated:</strong> {new Date(artist.updatedAt).toLocaleString()}</p>
                <p><strong>Bio Length:</strong> {artist.bio.length} characters</p>
                <p><strong>Has Hero Image:</strong> {artist.heroImageUrl ? 'Yes' : 'No'}</p>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {saving && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              )}
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ArtistProfile
