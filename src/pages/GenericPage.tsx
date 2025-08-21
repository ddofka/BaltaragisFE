import { useParams } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import { usePageTitle } from '../hooks/usePageTitle'

function GenericPage() {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useI18n()
  usePageTitle('page.page_title')

  return (
    <div className="page generic-page">
      <h1>{t('page.title')}: {slug}</h1>
      
      <section className="page-content">
        <p>
          {t('page.placeholder_text')} <strong>{slug}</strong>
        </p>
        
        <p>
          {t('page.api_description')} <code>/api/v1/pages/{slug}</code> {t('page.api_description_end')}
        </p>
        
        <div className="page-placeholder">
          <h2>{t('page.sample_content')}</h2>
          <p>{t('page.sample_content_text')}</p>
          
          <h3>{t('page.features')}</h3>
          <ul>
            <li>{t('page.feature_dynamic')}</li>
            <li>{t('page.feature_seo')}</li>
            <li>{t('page.feature_cms')}</li>
            <li>{t('page.feature_responsive')}</li>
          </ul>
        </div>
      </section>
    </div>
  )
}

export default GenericPage
