import { NavLink, Outlet } from 'react-router-dom'
import { useApp } from '../context/AppProvider'
import './Layout.css'

const navItems = [
  { to: '/', label: 'Каталог', icon: '🌸' },
  { to: '/favorites', label: 'Избранное', icon: '♥' },
  { to: '/cart', label: 'Корзина', icon: '🛒', badge: 'cart' },
  { to: '/profile', label: 'Профиль', icon: '👤' },
]

export default function Layout() {
  const { cartCount, loading } = useApp()

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-flower">🌷</div>
        <p>Загрузка...</p>
      </div>
    )
  }

  return (
    <div className="app-layout">
      <main className="app-main">
        <Outlet />
      </main>
      <nav className="bottom-nav">
        {navItems.map(({ to, label, icon, badge }) => (
          <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            <span className="nav-icon">
              {icon}
              {badge === 'cart' && cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
            </span>
            <span className="nav-label">{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
