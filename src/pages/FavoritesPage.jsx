import { Link } from 'react-router-dom'
import { useApp } from '../context/AppProvider'
import ProductCard from '../components/ProductCard'
import './Favorites.css'

export default function FavoritesPage() {
  const { favorites, t } = useApp()

  return (
    <div className="page favorites-page">
      <header className="page-header">
        <h1>{t.favoritesTitle}</h1>
        <p className="page-subtitle">{t.favoritesSubtitle}</p>
      </header>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <span>♡</span>
          <p>{t.favoritesEmpty}</p>
          <Link to="/" className="btn-primary">{t.viewCatalog}</Link>
        </div>
      ) : (
        <div className="product-grid">
          {favorites.map((product) => (
            <ProductCard key={product.id} product={product} compact />
          ))}
        </div>
      )}
    </div>
  )
}
