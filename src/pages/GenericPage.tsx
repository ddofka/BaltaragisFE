import { useParams } from 'react-router-dom'

function GenericPage() {
  const { slug } = useParams<{ slug: string }>()

  return (
    <div className="page generic-page">
      <h1>Page: {slug}</h1>
      
      <section className="page-content">
        <p>
          This is a placeholder for the CMS page: <strong>{slug}</strong>
        </p>
        
        <p>
          The actual page content will be loaded from the API using the 
          <code>/api/v1/pages/{slug}</code> endpoint. This will include 
          the page title, content, and metadata.
        </p>
        
        <div className="page-placeholder">
          <h2>Sample Page Content</h2>
          <p>
            This is where the actual page content would appear. The content 
            will be loaded dynamically from the backend API and can include 
            rich text, images, and other media.
          </p>
          
          <h3>Features</h3>
          <ul>
            <li>Dynamic content loading</li>
            <li>SEO-friendly URLs</li>
            <li>Content management system integration</li>
            <li>Responsive design</li>
          </ul>
        </div>
      </section>
    </div>
  )
}

export default GenericPage
