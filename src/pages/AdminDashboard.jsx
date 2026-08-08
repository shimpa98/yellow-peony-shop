import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import './AdminDashboard.css'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    pendingOrders: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    try {
      const [products, orders, pendingOrders] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'new'),
      ])

      setStats({
        products: products.count || 0,
        orders: orders.count || 0,
        pendingOrders: pendingOrders.count || 0,
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  if (loading) {
    return <div className="admin-dashboard">Загрузка...</div>
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Админ-панель</h1>
        <button onClick={handleLogout} className="btn-logout">Выйти</button>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Товары</h3>
          <p className="stat-value">{stats.products}</p>
          <button onClick={() => navigate('/admin/products')}>Управление</button>
        </div>
        <div className="stat-card">
          <h3>Заказы</h3>
          <p className="stat-value">{stats.orders}</p>
          <button onClick={() => navigate('/admin/orders')}>Управление</button>
        </div>
        <div className="stat-card pending">
          <h3>Новые заказы</h3>
          <p className="stat-value">{stats.pendingOrders}</p>
          <button onClick={() => navigate('/admin/orders')}>Обработать</button>
        </div>
      </div>
    </div>
  )
}
