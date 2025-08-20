function Products() {
  return (
    <div className="page products-page">
      <h1>Our Artwork</h1>
      
      <section className="products-intro">
        <p>
          Discover our collection of contemporary artwork, available as 
          high-quality giclée prints. Each piece is carefully selected 
          and produced to the highest standards.
        </p>
      </section>

      <section className="products-grid">
        <div className="product-card placeholder">
          <div className="product-image-placeholder"></div>
          <h3>Sunset Print</h3>
          <p>A3 giclée print</p>
          <p className="price">€45.00</p>
        </div>
        
        <div className="product-card placeholder">
          <div className="product-image-placeholder"></div>
          <h3>More Artwork Coming Soon</h3>
          <p>Additional pieces will be available shortly</p>
        </div>
      </section>

      <section className="products-cta">
        <p>
          Interested in a specific piece? Contact us for availability 
          and custom sizing options.
        </p>
      </section>
    </div>
  )
}

export default Products
