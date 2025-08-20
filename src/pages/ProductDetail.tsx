import { useParams } from 'react-router-dom'

function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()

  return (
    <div className="page product-detail-page">
      <h1>Product: {slug}</h1>
      
      <section className="product-detail">
        <div className="product-image-placeholder large"></div>
        
        <div className="product-info">
          <h2>Product Details</h2>
          <p>
            This is a placeholder for the product detail page. 
            The actual product information will be loaded from the API 
            using the slug: <strong>{slug}</strong>
          </p>
          
          <div className="product-meta">
            <p><strong>Price:</strong> €45.00</p>
            <p><strong>Medium:</strong> Giclée Print</p>
            <p><strong>Size:</strong> A3</p>
            <p><strong>Availability:</strong> In Stock</p>
          </div>
          
          <button className="btn btn-primary">
            Add to Cart
          </button>
        </div>
      </section>

      <section className="product-description">
        <h3>Description</h3>
        <p>
          This is where the detailed product description will appear, 
          loaded from the API. The description will include information 
          about the artwork, materials, and production process.
        </p>
      </section>
    </div>
  )
}

export default ProductDetail
