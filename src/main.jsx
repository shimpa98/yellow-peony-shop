import { Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Clean Telegram query parameters from URL hash immediately
if (window.location.hash) {
  const hash = window.location.hash
  if (hash.includes('tgWebAppData') || hash.includes('tgWebAppVersion')) {
    // Force redirect to root
    window.history.replaceState(null, '', '#/')
    console.log('Cleaned Telegram parameters from hash:', hash, '->', '#/')
  }
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
