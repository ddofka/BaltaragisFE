import { Link } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import { usePageTitle } from '../hooks/usePageTitle'

function Home() {
  const { t } = useI18n()
  usePageTitle('home.page_title')
  return (
    <div className="page home-page">
      <section className="hero">
        <h1>{t('home.welcome')}</h1>
        <p>{t('home.subtitle')}</p>
        <div className="hero-actions">
          <Link to="/products" className="btn btn-primary">
            {t('home.view_artwork')}
          </Link>
          <Link to="/about" className="btn btn-secondary">
            {t('home.learn_more')}
          </Link>
        </div>
      </section>

      <section className="featured">
        <h2>{t('home.featured_works')}</h2>
        <p>{t('home.featured_description')}</p>
        <Link to="/products" className="btn btn-outline">
          {t('home.browse_all')}
        </Link>
      </section>
    </div>
  )
}

export default Home
