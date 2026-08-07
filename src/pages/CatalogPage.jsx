import { useState } from 'react'
import { useApp } from '../context/AppProvider'
import ProductCard from '../components/ProductCard'
import './Catalog.css'

export default function CatalogPage() {
  const { products, categories, loading, t } = useApp()
  const [activeCategory, setActiveCategory] = useState(null)
  const [search, setSearch] = useState('')

  if (loading) {
    return (
      <div className="page catalog-page">
        <div className="empty-state">
          <span>🌸</span>
          <p>{t.loading}</p>
        </div>
      </div>
    )
  }

  const filtered = products.filter((p) => {
    const matchCategory = !activeCategory || p.category_id === activeCategory
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch && p.is_available_for_order !== false
  })

  return (
    <div className="page catalog-page">
      <header className="page-header">
        <h1>{t.catalogTitle}</h1>
        <p className="page-subtitle">{t.catalogSubtitle}</p>
      </header>

      <div className="search-bar">
        <input
          type="search"
          placeholder={t.searchPlaceholder}
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
          {t.all}
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
          <p>{t.productsNotFound}</p>
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
