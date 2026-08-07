import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppProvider'
import { formatPrice } from '../components/ProductCard'
import './Checkout.css'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { cart, cartTotal, dbUser, placeOrder, getProductPrice } = useApp()
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState(dbUser?.phone ?? '')
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (cart.length === 0) {
    navigate('/cart', { replace: true })
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!address.trim()) {
      setError('Укажите адрес доставки')
      return
    }
    if (!phone.trim()) {
      setError('Укажите номер телефона')
      return
    }

    setSubmitting(true)
    const result = await placeOrder({
      deliveryAddress: address.trim(),
      phone: phone.trim(),
      comment: comment.trim() || null,
    })
    setSubmitting(false)

    if (result.error) {
      setError(result.error)
    } else {
      navigate('/profile', { replace: true, state: { orderSuccess: true } })
    }
  }

  return (
    <div className="page checkout-page">
      <header className="page-header">
        <h1>Оформление заказа</h1>
      </header>

      <div className="checkout-summary">
        <h2>Ваш заказ</h2>
        {cart.map((item) => {
          const product = item.products
          if (!product) return null
          const price = getProductPrice(product, item.price_option)
          return (
            <div key={item.product_id} className="checkout-item">
              <span>{product.name} × {item.quantity}</span>
              <span>{formatPrice(price * item.quantity)}</span>
            </div>
          )
        })}
        <div className="checkout-total">
          <span>Итого</span>
          <span>{formatPrice(cartTotal)}</span>
        </div>
      </div>

      <form className="checkout-form" onSubmit={handleSubmit}>
        <label>
          Адрес доставки *
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Город, улица, дом, квартира"
            rows={3}
            required
          />
        </label>

        <label>
          Телефон *
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+7 (999) 123-45-67"
            required
          />
        </label>

        <label>
          Комментарий к заказу
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Пожелания к букету, время доставки..."
            rows={2}
          />
        </label>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="btn-primary btn-full" disabled={submitting}>
          {submitting ? 'Отправка...' : 'Подтвердить заказ'}
        </button>
      </form>
    </div>
  )
}
