export const translations = {
  ru: {
    // Common
    loading: 'Загрузка...',
    back: 'Назад',
    
    // Catalog
    catalogTitle: 'Цветочный магазин',
    catalogSubtitle: 'Свежие букеты с доставкой',
    searchPlaceholder: 'Поиск цветов...',
    all: 'Все',
    productsNotFound: 'Товары не найдены',
    
    // Cart
    cartTitle: 'Корзина',
    cartEmpty: 'Корзина пуста',
    goToCatalog: 'Перейти в каталог',
    item: 'товар',
    items: 'товара',
    manyItems: 'товаров',
    total: 'Итого',
    checkout: 'Оформить заказ',
    remove: 'Удалить',
    
    // Checkout
    checkoutTitle: 'Оформление заказа',
    yourOrder: 'Ваш заказ',
    deliveryAddress: 'Адрес доставки',
    addressPlaceholder: 'Город, улица, дом, квартира',
    phone: 'Телефон',
    phonePlaceholder: '+375 (29) 123-45-67',
    comment: 'Комментарий к заказу',
    commentPlaceholder: 'Пожелания к букету, время доставки...',
    submitOrder: 'Подтвердить заказ',
    sending: 'Отправка...',
    addressRequired: 'Укажите адрес доставки',
    phoneRequired: 'Укажите номер телефона',
    
    // Favorites
    favoritesTitle: 'Избранное',
    favoritesSubtitle: 'Ваши любимые букеты',
    favoritesEmpty: 'Пока ничего не добавлено',
    viewCatalog: 'Смотреть каталог',
    
    // Profile
    profileTitle: 'Профиль',
    ordersTitle: 'Мои заказы',
    ordersEmpty: 'У вас пока нет заказов',
    orderStatus: 'Статус',
    orderDate: 'Дата',
    orderTotal: 'Сумма',
    statusNew: 'Новый',
    statusProcessing: 'В обработке',
    statusCompleted: 'Выполнен',
    statusCancelled: 'Отменён',
    
    // Product
    addToCart: 'В корзину',
    inStock: 'В наличии',
    outOfStock: 'Нет в наличии',
  },
  be: {
    // Common
    loading: 'Загрузка...',
    back: 'Назад',
    
    // Catalog
    catalogTitle: 'Кветкавы крам',
    catalogSubtitle: 'Свежыя букеты з дастаўкай',
    searchPlaceholder: 'Пошук кветак...',
    all: 'Усе',
    productsNotFound: 'Тавары не знойдзены',
    
    // Cart
    cartTitle: 'Кошык',
    cartEmpty: 'Кошык пусты',
    goToCatalog: 'Перайсці ў каталог',
    item: 'тавар',
    items: 'тавары',
    manyItems: 'тавараў',
    total: 'Разам',
    checkout: 'Аформіць замову',
    remove: 'Выдаліць',
    
    // Checkout
    checkoutTitle: 'Афармленне замовы',
    yourOrder: 'Ваша замова',
    deliveryAddress: 'Адрас дастаўкі',
    addressPlaceholder: 'Горад, вуліца, дом, кватэра',
    phone: 'Тэлефон',
    phonePlaceholder: '+375 (29) 123-45-67',
    comment: 'Каментар да замовы',
    commentPlaceholder: 'Пажаданні да букета, час дастаўкі...',
    submitOrder: 'Пацвердзіць замову',
    sending: 'Адпраўка...',
    addressRequired: 'Укажыце адрас дастаўкі',
    phoneRequired: 'Укажыце нумар тэлефона',
    
    // Favorites
    favoritesTitle: 'Абранае',
    favoritesSubtitle: 'Вашы любімыя букеты',
    favoritesEmpty: 'Пакуль нічога не дададзена',
    viewCatalog: 'Глядзець каталог',
    
    // Profile
    profileTitle: 'Профіль',
    ordersTitle: 'Мае замовы',
    ordersEmpty: 'У вас пакуль няма замоваў',
    orderStatus: 'Статус',
    orderDate: 'Дата',
    orderTotal: 'Сума',
    statusNew: 'Новы',
    statusProcessing: 'У апрацоўцы',
    statusCompleted: 'Выкананы',
    statusCancelled: 'Адменены',
    
    // Product
    addToCart: 'У кошык',
    inStock: 'Ёсць у наяўнасці',
    outOfStock: 'Няма ў наяўнасці',
  },
}

export function getLanguage() {
  // Detect language from Telegram or browser
  const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user
  if (tgUser?.language_code) {
    if (tgUser.language_code.startsWith('be')) return 'be'
    if (tgUser.language_code.startsWith('ru')) return 'ru'
  }
  
  // Fallback to browser language
  const browserLang = navigator.language || navigator.userLanguage
  if (browserLang.startsWith('be')) return 'be'
  if (browserLang.startsWith('ru')) return 'ru'
  
  return 'ru' // Default to Russian
}

export function useTranslation() {
  const lang = getLanguage()
  const t = translations[lang]
  
  return { t, lang }
}
