import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.tsx'
import Home from './pages/Home.tsx'
import About from './pages/About.tsx'
import Products from './pages/Products.tsx'
import ProductDetail from './pages/ProductDetail.tsx'
import GenericPage from './pages/GenericPage.tsx'
import NotFound from './pages/NotFound.tsx'
import ConnectivityCheck from './components/ConnectivityCheck.tsx'

function App() {
  return (
    <Layout>
      <ConnectivityCheck />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/pages/:slug" element={<GenericPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}

export default App
