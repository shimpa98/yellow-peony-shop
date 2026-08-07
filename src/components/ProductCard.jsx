import { useState } from 'react'
import { useApp } from '../context/AppProvider'
import './ProductCard.css'

function formatPrice(price) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(price)
}

function getPriceOptions(product) {
  if (!product.price_options) return []
  return Array.isArray(product.price_options) ? product.price_options : []
}

export default function ProductCard({ product, compact = false }) {
  const { addToCart, toggleFavorite, isFavorite, getProductPrice } = useApp()
  const [selectedOption, setSelectedOption] = useState(null)
  const [adding, setAdding] = useState(false)

  const options = getPriceOptions(product)
  const price = getProductPrice(product, selectedOption)
  const fav = isFavorite(product.id)

  async function handleAdd() {
    setAdding(true)
    await addToCart(product.id, 1, selectedOption)
    setAdding(false)
  }

  async function handleToggleFav(e) {
    e.stopPropagation()
    await toggleFavorite(product.id)
  }

  return (
    <article className={`product-card${compact ? ' compact' : ''}`}>
      <div className="product-image-wrap">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="product-image" loading="lazy" />
        ) : (
          <div className="product-image-placeholder">🌸</div>
        )}
        <button type="button" className={`fav-btn${fav ? ' active' : ''}`} onClick={handleToggleFav} aria-label="Избранное">
          {fav ? '♥' : '♡'}
        </button>
        {!product.in_stock && <span className="out-of-stock">Нет в наличии</span>}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        {!compact && product.description && (
          <p className="product-desc">{product.description.slice(0, 80)}{product.description.length > 80 ? '…' : ''}</p>
        )}

        {options.length > 0 && (
          <div className="price-options">
            {options.map((opt) => {
              const label = opt.label || opt.name
              return (
                <button
                  key={label}
                  type="button"
                  className={`price-option${selectedOption === label ? ' active' : ''}`}
                  onClick={() => setSelectedOption(label)}
                >
                  {label} — {formatPrice(opt.price)}
                </button>
              )
            })}
          </div>
        )}

        <div className="product-footer">
          <span className="product-price">{formatPrice(price)}</span>
          <button
            type="button"
            className="btn-add"
            onClick={handleAdd}
            disabled={!product.in_stock || adding || (options.length > 0 && !selectedOption)}
          >
            {adding ? '...' : 'В корзину'}
          </button>
        </div>
      </div>
    </article>
  )
}

export { formatPrice }
