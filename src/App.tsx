import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Layout from './components/Layout.tsx'
import ConnectivityCheck from './components/ConnectivityCheck.tsx'
import LoadingSpinner from './components/LoadingSpinner.tsx'

// Lazy load page components for code splitting
const Home = lazy(() => import('./pages/Home.tsx'))
const About = lazy(() => import('./pages/About.tsx'))
const Products = lazy(() => import('./pages/Products.tsx'))
const ProductDetail = lazy(() => import('./pages/ProductDetail.tsx'))
const GenericPage = lazy(() => import('./pages/GenericPage.tsx'))

function App() {
  return (
    <Layout>
      <ConnectivityCheck />
      <Routes>
        <Route path="/" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Home />
          </Suspense>
        } />
        <Route path="/about" element={
          <Suspense fallback={<LoadingSpinner />}>
            <About />
          </Suspense>
        } />
        <Route path="/products" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Products />
          </Suspense>
        } />
        <Route path="/products/:slug" element={
          <Suspense fallback={<LoadingSpinner />}>
            <ProductDetail />
          </Suspense>
        } />
        <Route path="/pages/:slug" element={
          <Suspense fallback={<LoadingSpinner />}>
            <GenericPage />
          </Suspense>
        } />
      </Routes>
    </Layout>
  )
}

export default App
