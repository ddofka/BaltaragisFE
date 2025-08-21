import { useEffect } from 'react'

export interface SeoMeta {
  title: string
  description?: string
  canonical?: string
  image?: string
  og?: Record<string, string>
  twitter?: Record<string, string>
  jsonLd?: object | object[]
}

export function useSeoMeta({ title, description, canonical, image, og, twitter, jsonLd }: SeoMeta) {
  useEffect(() => {
    // Title
    if (title) document.title = title
    // Description
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null
      if (!metaDesc) {
        metaDesc = document.createElement('meta')
        metaDesc.setAttribute('name', 'description')
        document.head.appendChild(metaDesc)
      }
      metaDesc.setAttribute('content', description)
    }
    // Canonical
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
      if (!link) {
        link = document.createElement('link')
        link.setAttribute('rel', 'canonical')
        document.head.appendChild(link)
      }
      link.setAttribute('href', canonical)
    }
    // OpenGraph
    if (og) {
      Object.entries(og).forEach(([key, value]) => {
        let meta = document.querySelector(`meta[property='og:${key}']`) as HTMLMetaElement | null
        if (!meta) {
          meta = document.createElement('meta')
          meta.setAttribute('property', `og:${key}`)
          document.head.appendChild(meta)
        }
        meta.setAttribute('content', value)
      })
    }
    // Twitter
    if (twitter) {
      Object.entries(twitter).forEach(([key, value]) => {
        let meta = document.querySelector(`meta[name='twitter:${key}']`) as HTMLMetaElement | null
        if (!meta) {
          meta = document.createElement('meta')
          meta.setAttribute('name', `twitter:${key}`)
          document.head.appendChild(meta)
        }
        meta.setAttribute('content', value)
      })
    }
    // Image fallback for OG/Twitter
    if (image) {
      let ogImg = document.querySelector('meta[property="og:image"]') as HTMLMetaElement | null
      if (!ogImg) {
        ogImg = document.createElement('meta')
        ogImg.setAttribute('property', 'og:image')
        document.head.appendChild(ogImg)
      }
      ogImg.setAttribute('content', image)
      let twImg = document.querySelector('meta[name="twitter:image"]') as HTMLMetaElement | null
      if (!twImg) {
        twImg = document.createElement('meta')
        twImg.setAttribute('name', 'twitter:image')
        document.head.appendChild(twImg)
      }
      twImg.setAttribute('content', image)
    }
    // JSON-LD
    let scriptEl: HTMLScriptElement | null = null
    if (jsonLd) {
      scriptEl = document.createElement('script')
      scriptEl.type = 'application/ld+json'
      scriptEl.text = JSON.stringify(jsonLd)
      scriptEl.setAttribute('data-seo-jsonld', 'true')
      document.head.appendChild(scriptEl)
    }
    return () => {
      // Clean up JSON-LD script
      if (scriptEl) {
        document.head.removeChild(scriptEl)
      }
    }
  }, [title, description, canonical, image, JSON.stringify(og), JSON.stringify(twitter), JSON.stringify(jsonLd)])
}
