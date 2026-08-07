import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppProvider'
import Layout from './components/Layout'
import CatalogPage from './pages/CatalogPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import FavoritesPage from './pages/FavoritesPage'
import ProfilePage from './pages/ProfilePage'

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<CatalogPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="favorites" element={<FavoritesPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppProvider>
  )
}
