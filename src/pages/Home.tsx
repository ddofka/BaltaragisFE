import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="page home-page">
      <section className="hero">
        <h1>Welcome to Baltaragis</h1>
        <p>Contemporary artist blending traditional forms with modern techniques</p>
        <div className="hero-actions">
          <Link to="/products" className="btn btn-primary">
            View Artwork
          </Link>
          <Link to="/about" className="btn btn-secondary">
            Learn More
          </Link>
        </div>
      </section>

      <section className="featured">
        <h2>Featured Works</h2>
        <p>Discover our latest collection of prints and artwork</p>
        <Link to="/products" className="btn btn-outline">
          Browse All Products
        </Link>
      </section>
    </div>
  )
}

export default Home
