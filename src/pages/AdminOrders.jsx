import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import './AdminOrders.css'

export default function AdminOrders() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingOrder, setEditingOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    loadOrders()
  }, [])

  async function loadOrders() {
    try {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
      setOrders(data || [])
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdateStatus(orderId, status, adminComment) {
    try {
      await supabase.from('orders').update({
        status,
        admin_comment: adminComment,
      }).eq('id', orderId)
      setShowModal(false)
      setEditingOrder(null)
      loadOrders()
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Ошибка обновления')
    }
  }

  function openModal(order) {
    setEditingOrder(order)
    setShowModal(true)
  }

  const statusLabels = {
    new: 'Новый',
    processing: 'В обработке',
    delivering: 'Доставляется',
    completed: 'Выполнен',
    cancelled: 'Отменён',
  }

  const statusColors = {
    new: '#ff9800',
    processing: '#2196f3',
    delivering: '#9c27b0',
    completed: '#4caf50',
    cancelled: '#f44336',
  }

  if (loading) return <div className="admin-orders">Загрузка...</div>

  return (
    <div className="admin-orders">
      <header className="admin-header">
        <h1>Управление заказами</h1>
        <button onClick={() => navigate('/admin')} className="btn-back">Назад</button>
      </header>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div className="order-info">
                <span className="order-id">#{order.id.slice(0, 8)}</span>
                <span className="order-date">
                  {new Date(order.created_at).toLocaleString('ru-RU')}
                </span>
              </div>
              <span
                className="order-status"
                style={{ background: statusColors[order.status] }}
              >
                {statusLabels[order.status] || order.status}
              </span>
            </div>

            <div className="order-details">
              <div className="order-customer">
                <strong>Клиент:</strong> {order.user_id}
              </div>
              <div className="order-address">
                <strong>Адрес:</strong> {order.delivery_address}
              </div>
              <div className="order-phone">
                <strong>Телефон:</strong> {order.phone}
              </div>
              {order.comment && (
                <div className="order-comment">
                  <strong>Комментарий:</strong> {order.comment}
                </div>
              )}
              {order.admin_comment && (
                <div className="order-admin-comment">
                  <strong>Комментарий админа:</strong> {order.admin_comment}
                </div>
              )}
              <div className="order-total">
                <strong>Сумма:</strong> {order.total} BYN
              </div>
            </div>

            <button onClick={() => openModal(order)} className="btn-update">
              Изменить статус
            </button>
          </div>
        ))}
      </div>

      {showModal && editingOrder && (
        <OrderStatusModal
          order={editingOrder}
          onUpdate={handleUpdateStatus}
          onClose={() => {
            setShowModal(false)
            setEditingOrder(null)
          }}
        />
      )}
    </div>
  )
}

function OrderStatusModal({ order, onUpdate, onClose }) {
  const [status, setStatus] = useState(order.status)
  const [adminComment, setAdminComment] = useState(order.admin_comment || '')

  function handleSubmit(e) {
    e.preventDefault()
    onUpdate(order.id, status, adminComment)
  }

  const statusOptions = [
    { value: 'new', label: 'Новый' },
    { value: 'processing', label: 'В обработке' },
    { value: 'delivering', label: 'Доставляется' },
    { value: 'completed', label: 'Выполнен' },
    { value: 'cancelled', label: 'Отменён' },
  ]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Изменить статус заказа #{order.id.slice(0, 8)}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Статус
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>
          <label>
            Комментарий для клиента (виден в профиле)
            <textarea
              value={adminComment}
              onChange={(e) => setAdminComment(e.target.value)}
              rows={3}
              placeholder="Например: Заказ будет доставлен завтра с 10:00 до 12:00"
            />
          </label>
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Отмена</button>
            <button type="submit">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  )
}
