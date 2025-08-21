import { useEffect } from 'react'

export function usePageTitle(titleKey: string, description?: string, image?: string) {
  useEffect(() => {
    if (titleKey) {
      document.title = titleKey
      // Meta description
      if (description) {
        let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null
        if (!metaDesc) {
          metaDesc = document.createElement('meta')
          metaDesc.setAttribute('name', 'description')
          document.head.appendChild(metaDesc)
        }
        metaDesc.setAttribute('content', description)
      }
      // OpenGraph
      let ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement | null
      if (!ogTitle) {
        ogTitle = document.createElement('meta')
        ogTitle.setAttribute('property', 'og:title')
        document.head.appendChild(ogTitle)
      }
      ogTitle.setAttribute('content', titleKey)
      if (description) {
        let ogDesc = document.querySelector('meta[property="og:description"]') as HTMLMetaElement | null
        if (!ogDesc) {
          ogDesc = document.createElement('meta')
          ogDesc.setAttribute('property', 'og:description')
          document.head.appendChild(ogDesc)
        }
        ogDesc.setAttribute('content', description)
      }
      if (image) {
        let ogImg = document.querySelector('meta[property="og:image"]') as HTMLMetaElement | null
        if (!ogImg) {
          ogImg = document.createElement('meta')
          ogImg.setAttribute('property', 'og:image')
          document.head.appendChild(ogImg)
        }
        ogImg.setAttribute('content', image)
      }
    }
  }, [titleKey, description, image])
}
