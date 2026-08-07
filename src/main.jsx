import { Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Clean Telegram query parameters from URL
if (window.location.hash.includes('tgWebAppData')) {
  const cleanHash = window.location.hash.split('&')[0] || '#/'
  window.history.replaceState(null, '', cleanHash)
}

class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
          <h1>Ошибка загрузки</h1>
          <p>{this.state.error.message}</p>
        </div>
      )
    }

    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
)
