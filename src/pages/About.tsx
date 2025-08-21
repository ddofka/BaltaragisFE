import { useI18n } from '../contexts/I18nContext'
import { usePageTitle } from '../hooks/usePageTitle'

function About() {
  const { t } = useI18n()
  usePageTitle('about.page_title')
  
  return (
    <div className="page about-page">
      <div className="about-header">
        <div className="about-content">
          <h1>{t('about.title')}</h1>
          <p className="about-intro">
            Contemporary artist exploring the intersection of traditional techniques 
            and modern digital expression through high-quality giclée prints.
          </p>
        </div>
        <div className="about-image">
          <img 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face" 
            alt="Baltaragis - Contemporary Artist"
            loading="eager"
          />
        </div>
      </div>
      
      <section className="artist-statement">
        <h2>{t('about.artist_statement')}</h2>
        <div className="statement-content">
          <p>{t('about.artist_statement_text')}</p>
          <p>
            My journey as an artist began with a fascination for the interplay between 
            light and shadow, color and form. Each piece represents a moment of discovery, 
            where traditional artistic principles meet contemporary digital techniques to 
            create something entirely new.
          </p>
          <p>
            I believe art should be accessible while maintaining its emotional impact. 
            Through carefully curated limited editions, I ensure that each print maintains 
            the integrity and passion of the original work.
          </p>
        </div>
      </section>

      <section className="medium-style">
        <div className="process-grid">
          <div className="process-text">
            <h2>{t('about.medium_style')}</h2>
            <p>{t('about.medium_style_text')}</p>
            <div className="process-details">
              <div className="detail-item">
                <h4>Premium Materials</h4>
                <p>Museum-quality archival papers and inks ensure longevity and color accuracy.</p>
              </div>
              <div className="detail-item">
                <h4>Limited Editions</h4>
                <p>Each artwork is produced in carefully limited quantities to maintain exclusivity.</p>
              </div>
              <div className="detail-item">
                <h4>Hand-Finished</h4>
                <p>Every print is personally inspected and signed to guarantee quality.</p>
              </div>
            </div>
          </div>
          <div className="process-image">
            <img 
              src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500&h=600&fit=crop&crop=center" 
              alt="Art Creation Process"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="achievements">
        <h2>Recognition & Exhibitions</h2>
        <div className="achievements-grid">
          <div className="achievement">
            <h4>2023</h4>
            <p>Featured in Contemporary Art Review's "Emerging Digital Artists"</p>
          </div>
          <div className="achievement">
            <h4>2022</h4>
            <p>Solo Exhibition at Vilnius Modern Art Gallery</p>
          </div>
          <div className="achievement">
            <h4>2021</h4>
            <p>Winner, Baltic Digital Art Prize</p>
          </div>
          <div className="achievement">
            <h4>2020</h4>
            <p>Group Exhibition: "New Voices in Contemporary Art", Riga</p>
          </div>
        </div>
      </section>

      <section className="contact">
        <div className="contact-content">
          <div className="contact-text">
            <h2>{t('about.contact')}</h2>
            <p>{t('about.contact_text')}</p>
            <div className="contact-details">
              <div className="contact-item">
                <strong>Studio Visits</strong>
                <p>By appointment only - contact for scheduling</p>
              </div>
              <div className="contact-item">
                <strong>Commissions</strong>
                <p>Custom artwork available for private and corporate clients</p>
              </div>
              <div className="contact-item">
                <strong>Workshops</strong>
                <p>Digital art techniques and traditional-modern fusion methods</p>
              </div>
            </div>
          </div>
          <div className="studio-image">
            <img 
              src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop&crop=center" 
              alt="Artist Studio"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
