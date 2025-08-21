import { useI18n } from '../contexts/I18nContext'
import { usePageTitle } from '../hooks/usePageTitle'

function About() {
  const { t } = useI18n()
  usePageTitle('about.page_title')
  
  return (
    <div className="page about-page">
      <h1>{t('about.title')}</h1>
      
      <section className="about-content">
        <h2>{t('about.artist_statement')}</h2>
        <p>{t('about.artist_statement_text')}</p>

        <h2>{t('about.medium_style')}</h2>
        <p>{t('about.medium_style_text')}</p>

        <h2>{t('about.contact')}</h2>
        <p>{t('about.contact_text')}</p>
      </section>
    </div>
  )
}

export default About
