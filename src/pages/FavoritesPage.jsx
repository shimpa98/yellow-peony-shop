import { Link } from 'react-router-dom'
import { useApp } from '../context/AppProvider'
import ProductCard from '../components/ProductCard'
import './Favorites.css'

export default function FavoritesPage() {
  const { favorites } = useApp()

  return (
    <div className="page favorites-page">
      <header className="page-header">
        <h1>Избранное</h1>
        <p className="page-subtitle">Ваши любимые букеты</p>
      </header>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <span>♡</span>
          <p>Пока ничего не добавлено</p>
          <Link to="/" className="btn-primary">Смотреть каталог</Link>
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
