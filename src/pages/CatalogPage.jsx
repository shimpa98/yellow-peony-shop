import { useState } from 'react'
import { useApp } from '../context/AppProvider'
import ProductCard from '../components/ProductCard'
import './Catalog.css'

export default function CatalogPage() {
  const { products, categories } = useApp()
  const [activeCategory, setActiveCategory] = useState(null)
  const [search, setSearch] = useState('')

  const filtered = products.filter((p) => {
    const matchCategory = !activeCategory || p.category_id === activeCategory
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch && p.is_available_for_order !== false
  })

  return (
    <div className="page catalog-page">
      <header className="page-header">
        <h1>Цветочный магазин</h1>
        <p className="page-subtitle">Свежие букеты с доставкой</p>
      </header>

      <div className="search-bar">
        <input
          type="search"
          placeholder="Поиск цветов..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="category-filter">
        <button
          type="button"
          className={`category-chip${!activeCategory ? ' active' : ''}`}
          onClick={() => setActiveCategory(null)}
        >
          Все
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`category-chip${activeCategory === cat.id ? ' active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <span>🌿</span>
          <p>Товары не найдены</p>
        </div>
      ) : (
        <div className="product-grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
