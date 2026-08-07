import { Link } from 'react-router-dom'
import { useApp } from '../context/AppProvider'
import { formatPrice } from '../components/ProductCard'
import './Cart.css'

export default function CartPage() {
  const { cart, cartTotal, updateCartQuantity, removeFromCart, getProductPrice, t } = useApp()

  if (cart.length === 0) {
    return (
      <div className="page cart-page">
        <header className="page-header">
          <h1>{t.cartTitle}</h1>
        </header>
        <div className="empty-state">
          <span>🛒</span>
          <p>{t.cartEmpty}</p>
          <Link to="/" className="btn-primary">{t.goToCatalog}</Link>
        </div>
      </div>
    )
  }

  const getItemText = (count) => {
    if (count === 1) return t.item
    if (count < 5) return t.items
    return t.manyItems
  }

  return (
    <div className="page cart-page">
      <header className="page-header">
        <h1>{t.cartTitle}</h1>
        <p className="page-subtitle">{cart.length} {getItemText(cart.length)}</p>
      </header>

      <div className="cart-items">
        {cart.map((item) => {
          const product = item.products
          if (!product) return null
          const price = getProductPrice(product, item.price_option)

          return (
            <div key={item.product_id} className="cart-item">
              <div className="cart-item-image">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} />
                ) : (
                  <span>🌸</span>
                )}
              </div>
              <div className="cart-item-info">
                <h3>{product.name}</h3>
                {item.price_option && <p className="cart-item-option">{item.price_option}</p>}
                <p className="cart-item-price">{formatPrice(price)}</p>
                <div className="cart-item-actions">
                  <div className="quantity-control">
                    <button type="button" onClick={() => updateCartQuantity(item.product_id, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => updateCartQuantity(item.product_id, item.quantity + 1)}>+</button>
                  </div>
                  <button type="button" className="btn-remove" onClick={() => removeFromCart(item.product_id)}>{t.remove}</button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="cart-summary">
        <div className="cart-total">
          <span>{t.total}</span>
          <span>{formatPrice(cartTotal)}</span>
        </div>
        <Link to="/checkout" className="btn-primary btn-full">{t.checkout}</Link>
      </div>
    </div>
  )
}
