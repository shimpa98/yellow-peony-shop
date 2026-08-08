import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useApp } from '../context/AppProvider'
import { formatPrice } from '../components/ProductCard'
import './Profile.css'

export default function ProfilePage() {
  const location = useLocation()
  const { tgUser, dbUser, orders, updatePhone, isTelegram, loading, t } = useApp()
  const [phone, setPhone] = useState(dbUser?.phone ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showSuccess, setShowSuccess] = useState(location.state?.orderSuccess ?? false)
  const currency = t.currency || 'BYN'

  const STATUS_LABELS = {
    new: t.statusNew,
    processing: t.statusProcessing,
    delivering: t.statusProcessing,
    completed: t.statusCompleted,
    cancelled: t.statusCancelled,
  }

  useEffect(() => {
    if (dbUser?.phone) setPhone(dbUser.phone)
  }, [dbUser?.phone])

  useEffect(() => {
    if (showSuccess) {
      const t = setTimeout(() => setShowSuccess(false), 4000)
      return () => clearTimeout(t)
    }
  }, [showSuccess])

  async function handleSavePhone(e) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    const result = await updatePhone(phone.trim())
    setSaving(false)
    if (!result.error) setSaved(true)
  }

  const displayName =
    [tgUser?.first_name ?? dbUser?.first_name, tgUser?.last_name ?? dbUser?.last_name]
      .filter(Boolean)
      .join(' ') || 'Пользователь'

  const username = tgUser?.username ?? dbUser?.username
  const telegramId = tgUser?.id ?? dbUser?.telegram_id
  const avatarUrl = tgUser?.photo_url ?? dbUser?.photo_url

  if (!loading && !isTelegram) {
    return (
      <div className="page profile-page">
        <header className="page-header">
          <h1>{t.profileTitle}</h1>
        </header>
        <div className="profile-hint">
          <p>Данные Telegram не получены.</p>
          <p>Откройте магазин через кнопку меню в боте <strong>@YellowPeonyBot</strong> на телефоне — не через браузер и не по обычной ссылке в чате.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page profile-page">
      <header className="page-header">
        <h1>{t.profileTitle}</h1>
      </header>

      {showSuccess && (
        <div className="success-banner">
          ✓ Заказ успешно оформлен!
        </div>
      )}

      <div className="profile-card">
        <div className="profile-avatar">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" />
          ) : (
            <span>{(tgUser?.first_name ?? dbUser?.first_name)?.[0] ?? '?'}</span>
          )}
        </div>
        <div className="profile-info">
          <h2>{displayName}</h2>
          {username && <p className="profile-username">@{username}</p>}
          {telegramId && <p className="profile-id">Telegram ID: {telegramId}</p>}
        </div>
      </div>

      <form className="phone-form" onSubmit={handleSavePhone}>
        <label>
          {t.phone}
          <input
            type="tel"
            value={phone}
            onChange={(e) => { setPhone(e.target.value); setSaved(false) }}
            placeholder={t.phonePlaceholder}
          />
        </label>
        <button type="submit" className="btn-secondary" disabled={saving}>
          {saving ? 'Сохранение...' : saved ? 'Сохранено ✓' : 'Сохранить'}
        </button>
      </form>

      <section className="orders-section">
        <h3>{t.ordersTitle}</h3>
        {orders.length === 0 ? (
          <p className="no-orders">{t.ordersEmpty}</p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <span className="order-date">
                    {new Date(order.created_at).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                  <span className={`order-status status-${order.status}`}>
                    {STATUS_LABELS[order.status] ?? order.status}
                  </span>
                </div>
                <div className="order-items">
                  {(order.items ?? []).map((item, i) => (
                    <span key={i}>{item.name} × {item.quantity}</span>
                  ))}
                </div>
                {order.admin_comment && (
                  <div className="order-admin-comment">
                    <strong>Сообщение:</strong> {order.admin_comment}
                  </div>
                )}
                <div className="order-footer">
                  <span>{formatPrice(order.total, currency)}</span>
                  {order.delivery_address && (
                    <span className="order-address">{order.delivery_address}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
