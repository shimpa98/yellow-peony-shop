import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useTelegram } from '../hooks/useTelegram'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const { user: tgUser, webApp, isTelegram } = useTelegram()
  const [dbUser, setDbUser] = useState(null)
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [favorites, setFavorites] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const userId = tgUser?.id

  const syncUser = useCallback(async () => {
    if (!userId) return null

    const { data, error } = await supabase
      .from('users')
      .upsert(
        {
          telegram_id: userId,
          username: tgUser.username ?? null,
          first_name: tgUser.first_name ?? null,
          last_name: tgUser.last_name ?? null,
          photo_url: tgUser.photo_url ?? null,
        },
        { onConflict: 'telegram_id' },
      )
      .select()
      .single()

    if (error) {
      console.error('User sync error:', error)
      return null
    }

    setDbUser(data)
    return data
  }, [userId, tgUser])

  const loadCatalog = useCallback(async () => {
    const [{ data: cats }, { data: prods }] = await Promise.all([
      supabase.from('categories').select('*').order('sort_order'),
      supabase.from('products').select('*').order('name'),
    ])
    setCategories(cats ?? [])
    setProducts(prods ?? [])
  }, [])

  const loadCart = useCallback(async () => {
    if (!userId) return
    const { data } = await supabase
      .from('cart')
      .select('*, products(*)')
      .eq('user_id', userId)
    setCart(data ?? [])
  }, [userId])

  const loadFavorites = useCallback(async () => {
    if (!userId) return
    const { data } = await supabase
      .from('favorites')
      .select('product_id, products(*)')
      .eq('user_id', userId)
    setFavorites((data ?? []).map((f) => f.products).filter(Boolean))
  }, [userId])

  const loadOrders = useCallback(async () => {
    if (!userId) return
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    setOrders(data ?? [])
  }, [userId])

  useEffect(() => {
    let cancelled = false

    async function init() {
      setLoading(true)
      try {
        await loadCatalog()
      } catch (error) {
        console.error('Catalog load error:', error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    init()

    return () => {
      cancelled = true
    }
  }, [loadCatalog])

  useEffect(() => {
    if (!userId) return

    async function syncUserData() {
      try {
        await syncUser()
        await Promise.all([loadCart(), loadFavorites(), loadOrders()])
      } catch (error) {
        console.error('User sync error:', error)
      }
    }

    syncUserData()
  }, [userId, syncUser, loadCart, loadFavorites, loadOrders])

  const addToCart = useCallback(
    async (productId, quantity = 1, priceOption = null) => {
      if (!userId) return { error: 'Не авторизован' }

      const { error } = await supabase.from('cart').upsert(
        {
          user_id: userId,
          product_id: productId,
          quantity,
          price_option: priceOption,
        },
        { onConflict: 'user_id,product_id' },
      )

      if (!error) await loadCart()
      webApp?.HapticFeedback?.impactOccurred('light')
      return { error: error?.message }
    },
    [userId, loadCart, webApp],
  )

  const updateCartQuantity = useCallback(
    async (productId, quantity) => {
      if (!userId) return
      if (quantity <= 0) {
        await supabase.from('cart').delete().eq('user_id', userId).eq('product_id', productId)
      } else {
        await supabase.from('cart').update({ quantity }).eq('user_id', userId).eq('product_id', productId)
      }
      await loadCart()
    },
    [userId, loadCart],
  )

  const removeFromCart = useCallback(
    async (productId) => {
      if (!userId) return
      await supabase.from('cart').delete().eq('user_id', userId).eq('product_id', productId)
      await loadCart()
      webApp?.HapticFeedback?.impactOccurred('light')
    },
    [userId, loadCart, webApp],
  )

  const toggleFavorite = useCallback(
    async (productId) => {
      if (!userId) return { error: 'Не авторизован' }

      const isFav = favorites.some((p) => p.id === productId)

      if (isFav) {
        await supabase.from('favorites').delete().eq('user_id', userId).eq('product_id', productId)
      } else {
        await supabase.from('favorites').insert({ user_id: userId, product_id: productId })
      }

      await loadFavorites()
      webApp?.HapticFeedback?.impactOccurred('medium')
      return { isFav: !isFav }
    },
    [userId, favorites, loadFavorites, webApp],
  )

  const isFavorite = useCallback(
    (productId) => favorites.some((p) => p.id === productId),
    [favorites],
  )

  const getProductPrice = useCallback((product, priceOption) => {
    if (priceOption && product.price_options) {
      const options = Array.isArray(product.price_options) ? product.price_options : []
      const opt = options.find((o) => o.label === priceOption || o.name === priceOption)
      if (opt?.price) return Number(opt.price)
    }
    return Number(product.price ?? 0)
  }, [])

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = getProductPrice(item.products, item.price_option)
      return sum + price * item.quantity
    }, 0)
  }, [cart, getProductPrice])

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart])

  const placeOrder = useCallback(
    async ({ deliveryAddress, phone, comment }) => {
      if (!userId || cart.length === 0) return { error: 'Корзина пуста' }

      const items = cart.map((item) => ({
        product_id: item.product_id,
        name: item.products?.name,
        quantity: item.quantity,
        price: getProductPrice(item.products, item.price_option),
        price_option: item.price_option,
      }))

      const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

      const { error } = await supabase.from('orders').insert({
        user_id: userId,
        items,
        total,
        delivery_address: deliveryAddress,
        phone,
        comment,
        status: 'new',
      })

      if (error) return { error: error.message }

      if (phone && phone !== dbUser?.phone) {
        await supabase.from('users').update({ phone }).eq('telegram_id', userId)
        setDbUser((u) => (u ? { ...u, phone } : u))
      }

      await supabase.from('cart').delete().eq('user_id', userId)
      await Promise.all([loadCart(), loadOrders()])
      webApp?.HapticFeedback?.notificationOccurred('success')
      return { error: null }
    },
    [userId, cart, getProductPrice, dbUser, loadCart, loadOrders, webApp],
  )

  const updatePhone = useCallback(
    async (phone) => {
      if (!userId) return { error: 'Не авторизован' }
      const { error } = await supabase.from('users').update({ phone }).eq('telegram_id', userId)
      if (!error) setDbUser((u) => (u ? { ...u, phone } : u))
      return { error: error?.message }
    },
    [userId],
  )

  const value = {
    tgUser,
    dbUser,
    webApp,
    isTelegram,
    loading,
    categories,
    products,
    cart,
    favorites,
    orders,
    cartTotal,
    cartCount,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    toggleFavorite,
    isFavorite,
    getProductPrice,
    placeOrder,
    updatePhone,
    refreshOrders: loadOrders,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
