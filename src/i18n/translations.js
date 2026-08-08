export const translations = {
  // Always Russian interface
  loading: 'Загрузка...',
  back: 'Назад',
  currency: 'BYN', // Always Belarusian Ruble
  phonePrefix: '+375', // Always Belarus phone
  
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
}

export function useTranslation() {
  // Always use Russian interface with Belarus currency and phone
  return { t: translations, lang: 'ru' }
}
