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
      setError(null)
      const data = await apiClient.getArtist()
      setArtist(data)
      setFormData({
        name: data.name,
        bio: data.bio,
        heroImageUrl: data.heroImageUrl,
        socials: data.socials
      })
    } catch (err) {
      console.error('Error fetching artist:', err)
      
      // Mock artist data for development
      const mockArtist: ArtistDto = {
        name: 'Baltaragis',
        bio: 'Contemporary artist exploring the intersection of traditional techniques and modern digital expression. Known for vibrant color palettes and emotive landscapes that capture the essence of Lithuanian countryside and urban life.',
        heroImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
        socials: JSON.stringify({
          website: 'https://baltaragis.art',
          instagram: 'https://instagram.com/baltaragis_art',
          facebook: 'https://facebook.com/baltaragis.gallery'
        }),
        updatedAt: '2024-01-15T14:30:00Z'
      }
      
      setArtist(mockArtist)
      setFormData({
        name: mockArtist.name,
        bio: mockArtist.bio,
        heroImageUrl: mockArtist.heroImageUrl,
        socials: mockArtist.socials
      })
      setError('Using development artist data. API connection failed.')
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

      <div style={{ maxWidth: '800px' }}>
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

        {success && (
          <div style={{
            backgroundColor: '#d1fae5',
            border: '1px solid #34d399',
            color: '#065f46',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '24px',
            fontSize: '14px'
          }}>
            ✅ {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <label htmlFor="name" style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Artist Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#2563eb'
                e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db'
                e.target.style.boxShadow = 'none'
              }}
              placeholder="Enter your artist name"
              required
            />
          </div>

          <div>
            <label htmlFor="bio" style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Artist Bio
            </label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              rows={6}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#2563eb'
                e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db'
                e.target.style.boxShadow = 'none'
              }}
              placeholder="Tell your story, describe your artistic journey, style, and inspiration..."
            />
            <p style={{
              fontSize: '12px',
              color: '#6b7280',
              marginTop: '4px',
              margin: '4px 0 0 0'
            }}>
              This will be displayed on your about page and artist profile
            </p>
          </div>

          <div>
            <label htmlFor="heroImageUrl" style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Hero Image URL
            </label>
            <input
              type="url"
              id="heroImageUrl"
              value={formData.heroImageUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, heroImageUrl: e.target.value }))}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#2563eb'
                e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db'
                e.target.style.boxShadow = 'none'
              }}
              placeholder="https://example.com/hero-image.jpg"
            />
            {formData.heroImageUrl && (
              <div style={{ marginTop: '12px' }}>
                <p style={{
                  fontSize: '14px',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Preview:
                </p>
                <img
                  src={formData.heroImageUrl}
                  alt="Hero image preview"
                  style={{
                    width: '100%',
                    maxWidth: '384px',
                    height: '128px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="socials" style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Social Media Links (JSON)
            </label>
            <textarea
              id="socials"
              value={formatSocials(formData.socials)}
              onChange={(e) => handleSocialsChange(e.target.value)}
              rows={8}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '14px',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#2563eb'
                e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db'
                e.target.style.boxShadow = 'none'
              }}
              placeholder={`{
  "website": "https://example.com",
  "instagram": "https://instagram.com/artist",
  "twitter": "https://twitter.com/artist",
  "facebook": "https://facebook.com/artist",
  "youtube": "https://youtube.com/artist"
}`}
            />
            <p style={{
              fontSize: '12px',
              color: '#6b7280',
              marginTop: '4px',
              margin: '4px 0 0 0'
            }}>
              Enter social media links as JSON. These will be displayed on your artist profile.
            </p>
          </div>

          {artist && (
            <div style={{
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Current Profile Info
              </h3>
              <div style={{
                fontSize: '14px',
                color: '#4b5563',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                <div><strong>Last Updated:</strong> {new Date(artist.updatedAt).toLocaleString()}</div>
                <div><strong>Bio Length:</strong> {artist.bio.length} characters</div>
                <div><strong>Has Hero Image:</strong> {artist.heroImageUrl ? 'Yes' : 'No'}</div>
              </div>
            </div>
          )}

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '16px',
            paddingTop: '24px',
            borderTop: '1px solid #e5e7eb'
          }}>
            <button
              type="button"
              onClick={() => window.history.back()}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                backgroundColor: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#f9fafb'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'white'}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500',
                color: 'white',
                backgroundColor: '#2563eb',
                border: 'none',
                borderRadius: '6px',
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.5 : 1,
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!saving) {
                  (e.target as HTMLElement).style.backgroundColor = '#1d4ed8'
                }
              }}
              onMouseLeave={(e) => {
                if (!saving) {
                  (e.target as HTMLElement).style.backgroundColor = '#2563eb'
                }
              }}
            >
              {saving && (
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid white',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginRight: '8px'
                }} />
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
