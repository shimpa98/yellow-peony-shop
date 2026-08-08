import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppProvider'
import { useTranslation } from '../i18n/translations'
import { formatPrice } from '../components/ProductCard'
import './ProductDetail.css'

function getPriceOptions(product) {
  if (!product.price_options) return []
  return Array.isArray(product.price_options) ? product.price_options : []
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products, addToCart, toggleFavorite, isFavorite, getProductPrice, t } = useApp()
  const [selectedOption, setSelectedOption] = useState(null)
  const [adding, setAdding] = useState(false)
  const currency = t.currency || 'BYN'

  const product = products.find(p => p.id === id)

  useEffect(() => {
    if (!product) {
      navigate('/catalog', { replace: true })
    }
  }, [product, navigate])

  if (!product) return null

  const options = getPriceOptions(product)
  const price = getProductPrice(product, selectedOption)
  const fav = isFavorite(product.id)

  async function handleAdd() {
    setAdding(true)
    await addToCart(product.id, 1, selectedOption)
    setAdding(false)
  }

  async function handleToggleFav() {
    await toggleFavorite(product.id)
  }

  const isButtonDisabled = !product.is_available_for_order || adding || (options.length > 0 && !selectedOption)

  return (
    <div className="page product-detail-page">
      <Link to="/catalog" className="back-link">{t.back}</Link>

      <div className="product-detail">
        <div className="product-detail-image">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} />
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
        </div>

        <div className="product-detail-info">
          <h1 className="product-detail-name">{product.name}</h1>
          
          {product.description && (
            <p className="product-detail-description">{product.description}</p>
          )}

          <div className="product-detail-price">
            <span className="price-value">{formatPrice(price, currency)}</span>
            {product.is_available_for_order ? (
              <span className="stock-status in-stock">{t.inStock}</span>
            ) : (
              <span className="stock-status out-of-stock">{t.outOfStock}</span>
            )}
          </div>

          {options.length > 0 && (
            <div className="product-detail-options">
              <h3>Выберите вариант:</h3>
              {options.map((opt, index) => {
                const label = opt.label || opt.name || opt.option || `Вариант ${index + 1}`
                const isSelected = selectedOption === label
                const optionPrice = opt.price ? formatPrice(opt.price, currency) : 'Цена по запросу'
                
                return (
                  <button
                    key={label}
                    type="button"
                    className={`option-card${isSelected ? ' active' : ''}`}
                    onClick={() => setSelectedOption(label)}
                  >
                    <div className="option-header">
                      <span className="option-name">{label}</span>
                      <span className="option-price">{optionPrice}</span>
                    </div>
                    {opt.description && (
                      <p className="option-description">{opt.description}</p>
                    )}
                  </button>
                )
              })}
            </div>
          )}

          <button
            type="button"
            className="btn-add btn-large"
            onClick={handleAdd}
            disabled={isButtonDisabled}
          >
            {adding ? '...' : t.addToCart}
          </button>
        </div>
      </div>
    </div>
  )
}
