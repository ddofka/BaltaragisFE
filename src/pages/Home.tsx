import { Link } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import { usePageTitle } from '../hooks/usePageTitle'

function Home() {
  const { t } = useI18n()
  usePageTitle('home.page_title')
  
  const featuredArtworks = [
    {
      id: 1,
      title: "Ethereal Sunset",
      description: "A mesmerizing blend of warm colors capturing the essence of golden hour",
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop&crop=center",
      price: "€125.00"
    },
    {
      id: 2,
      title: "Urban Dreams",
      description: "Contemporary cityscape with abstract elements and vibrant energy",
      image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=400&fit=crop&crop=center",
      price: "€85.00"
    },
    {
      id: 3,
      title: "Ocean Waves",
      description: "Fluid motion captured in brilliant blues and whites",
      image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=400&h=400&fit=crop&crop=center",
      price: "€95.00"
    }
  ]

  return (
    <div className="page home-page">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
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
          </div>
          <div className="hero-image">
            <img 
              src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&crop=center" 
              alt="Featured Contemporary Artwork"
              loading="eager"
            />
          </div>
        </div>
      </section>

      <section className="featured">
        <div className="featured-header">
          <h2>{t('home.featured_works')}</h2>
          <p>{t('home.featured_description')}</p>
        </div>
        
        <div className="featured-grid">
          {featuredArtworks.map((artwork) => (
            <div key={artwork.id} className="featured-item">
              <div className="featured-image">
                <img 
                  src={artwork.image} 
                  alt={artwork.title}
                  loading="lazy"
                />
                <div className="featured-overlay">
                  <div className="featured-price">{artwork.price}</div>
                </div>
              </div>
              <div className="featured-info">
                <h3>{artwork.title}</h3>
                <p>{artwork.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="featured-actions">
          <Link to="/products" className="btn btn-outline">
            {t('home.browse_all')}
          </Link>
        </div>
      </section>

      <section className="testimonials">
        <div className="testimonials-content">
          <h2>What Collectors Say</h2>
          <div className="testimonial-grid">
            <div className="testimonial">
              <blockquote>
                "The quality and emotional depth of these prints are extraordinary. 
                Each piece tells a story that resonates long after you've seen it."
              </blockquote>
              <cite>— Sarah M., Art Collector</cite>
            </div>
            <div className="testimonial">
              <blockquote>
                "Baltaragis has a unique ability to capture both classical beauty 
                and contemporary innovation in every piece."
              </blockquote>
              <cite>— James R., Gallery Owner</cite>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
