import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppProvider'
import { useTranslation } from '../i18n/translations'
import './ProductCard.css'

function formatPrice(price, currency = 'RUB') {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency, maximumFractionDigits: 0 }).format(price)
}

function getPriceOptions(product) {
  if (!product.price_options) return []
  return Array.isArray(product.price_options) ? product.price_options : []
}

export default function ProductCard({ product, compact = false }) {
  const { addToCart, toggleFavorite, isFavorite, getProductPrice, t } = useApp()
  const { lang } = useTranslation()
  const [selectedOption, setSelectedOption] = useState(null)
  const [adding, setAdding] = useState(false)

  const options = getPriceOptions(product)
  const price = getProductPrice(product, selectedOption)
  const fav = isFavorite(product.id)
  const currency = t.currency || 'BYN'

  async function handleAdd(e) {
    e.stopPropagation()
    setAdding(true)
    await addToCart(product.id, 1, selectedOption)
    setAdding(false)
  }

  async function handleToggleFav(e) {
    e.stopPropagation()
    await toggleFavorite(product.id)
  }

  const isButtonDisabled = !product.is_available_for_order || adding || (options.length > 0 && !selectedOption)

  return (
    <Link to={`/product/${product.id}`} className={`product-card${compact ? ' compact' : ''}`}>
      <div className="product-image-wrap">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="product-image" loading="lazy" />
        ) : (
          <div className="product-image-placeholder">🌸</div>
        )}
        <button 
          type="button" 
          className={`fav-btn${fav ? ' active' : ''}`} 
          onClick={handleToggleFav}
          aria-label="Избранное"
        >
          {fav ? '♥' : '♡'}
        </button>
        {!product.is_available_for_order && <span className="out-of-stock">{t.outOfStock}</span>}
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
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedOption(label)
                  }}
                >
                  {label} — {formatPrice(opt.price, currency)}
                </button>
              )
            })}
          </div>
        )}

        <div className="product-footer">
          <span className="product-price">{formatPrice(price, currency)}</span>
        </div>
      </div>
    </Link>
  )
}

export { formatPrice }
