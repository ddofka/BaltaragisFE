import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Layout from './components/Layout'
import AdminLayout from './components/AdminLayout'
import AdminAuth from './components/AdminAuth'
import ConnectivityCheck from './components/ConnectivityCheck'
import LoadingSpinner from './components/LoadingSpinner'

// Lazy load page components for code splitting
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Products = lazy(() => import('./pages/Products'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const GenericPage = lazy(() => import('./pages/GenericPage'))

// Admin components
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const ProductList = lazy(() => import('./pages/admin/ProductList'))
const ProductForm = lazy(() => import('./pages/admin/ProductForm'))
const ProductPhotos = lazy(() => import('./pages/admin/ProductPhotos'))
const PageList = lazy(() => import('./pages/admin/PageList'))
const PageForm = lazy(() => import('./pages/admin/PageForm'))
const TranslationManager = lazy(() => import('./pages/admin/TranslationManager'))
const ArtistProfile = lazy(() => import('./pages/admin/ArtistProfile'))

function App() {
  return (
    <Routes>
      {/* Admin Routes */}
      <Route 
        path="/admin/*" 
        element={
          <AdminAuth>
            <AdminLayout>
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdminDashboard />
                    </Suspense>
                  } 
                />
                
                {/* Products */}
                <Route 
                  path="/products" 
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <ProductList />
                    </Suspense>
                  } 
                />
                <Route 
                  path="/products/new" 
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <ProductForm mode="create" />
                    </Suspense>
                  } 
                />
                <Route 
                  path="/products/:id/edit" 
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <ProductForm mode="edit" />
                    </Suspense>
                  } 
                />
                <Route 
                  path="/products/:id/photos" 
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <ProductPhotos />
                    </Suspense>
                  } 
                />
                
                {/* Pages */}
                <Route 
                  path="/pages" 
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <PageList />
                    </Suspense>
                  } 
                />
                <Route 
                  path="/pages/new" 
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <PageForm mode="create" />
                    </Suspense>
                  } 
                />
                <Route 
                  path="/pages/:id/edit" 
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <PageForm mode="edit" />
                    </Suspense>
                  } 
                />
                
                {/* Translations */}
                <Route 
                  path="/translations" 
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <TranslationManager />
                    </Suspense>
                  } 
                />
                
                {/* Artist Profile */}
                <Route 
                  path="/artist" 
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <ArtistProfile />
                    </Suspense>
                  } 
                />
              </Routes>
            </AdminLayout>
          </AdminAuth>
        } 
      />

      {/* Public Routes */}
      <Route 
        path="/*" 
        element={
          <Layout>
            <ConnectivityCheck />
            <Routes>
              <Route 
                path="/" 
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <Home />
                  </Suspense>
                } 
              />
              <Route 
                path="/about" 
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <About />
                  </Suspense>
                } 
              />
              <Route 
                path="/products" 
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <Products />
                  </Suspense>
                } 
              />
              <Route 
                path="/products/:slug" 
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <ProductDetail />
                  </Suspense>
                } 
              />
              <Route 
                path="/pages/:slug" 
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <GenericPage />
                  </Suspense>
                } 
              />
            </Routes>
          </Layout>
        } 
      />
    </Routes>
  )
}

export default App