import { useEffect } from 'react'
import { useI18n } from '../contexts/I18nContext'

export function usePageTitle(titleKey: string) {
  const { t } = useI18n()

  useEffect(() => {
    const title = t(titleKey)
    if (title && title !== titleKey) {
      document.title = `${title} - Baltaragis`
    } else {
      document.title = 'Baltaragis - Artist Portfolio & Shop'
    }
  }, [t, titleKey])
}
