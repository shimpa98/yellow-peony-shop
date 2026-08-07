import { useEffect, useState } from 'react'

const DEV_USER = {
  id: 123456789,
  first_name: 'Тест',
  last_name: 'Пользователь',
  username: 'test_user',
}

function getWebApp() {
  if (typeof window === 'undefined') return null
  return window.Telegram?.WebApp ?? null
}

function readUser(webApp) {
  return webApp?.initDataUnsafe?.user ?? null
}

function initWebApp(tg) {
  try {
    tg.ready?.()
    tg.expand?.()
  } catch (error) {
    console.warn('Telegram WebApp init:', error)
  }
}

export function useTelegram() {
  const [webApp, setWebApp] = useState(null)
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    function finish(tg, tgUser) {
      if (cancelled) return
      console.log('Telegram WebApp ready:', { hasWebApp: !!tg, hasUser: !!tgUser })
      setWebApp(tg)
      setUser(tgUser)
      setReady(true)
    }

    const tg = getWebApp()
    if (tg) {
      initWebApp(tg)
      finish(tg, readUser(tg))
      return () => {
        cancelled = true
      }
    }

    if (import.meta.env.DEV) {
      console.log('Using DEV_USER for development')
      finish(null, DEV_USER)
      return () => {
        cancelled = true
      }
    }

    console.log('Telegram WebApp not found, waiting...')
    let attempts = 0
    const timer = window.setInterval(() => {
      attempts += 1
      const lateTg = getWebApp()
      if (lateTg) {
        window.clearInterval(timer)
        initWebApp(lateTg)
        finish(lateTg, readUser(lateTg))
      } else if (attempts >= 20) {
        window.clearInterval(timer)
        console.warn('Telegram WebApp not found after 20 attempts, running without Telegram')
        finish(null, null)
      }
    }, 100)

    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [])

  return {
    webApp,
    user,
    ready,
    isTelegram: Boolean(user),
  }
}
