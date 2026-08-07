# Flowers Shop — Telegram Mini App

React-приложение магазина цветов с Supabase и интеграцией Telegram Web App.

## Возможности

- Каталог с фильтрацией по категориям и поиском
- Корзина с синхронизацией в Supabase
- Оформление заказа
- Избранное
- Профиль пользователя из Telegram

## Запуск

```bash
cd flowers-frontend
npm install
npm run dev
```

В режиме разработки используется тестовый пользователь Telegram.

## Переменные окружения

Создайте `.env` в папке `flowers-frontend`:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

## Telegram Bot

1. Создайте бота через [@BotFather](https://t.me/BotFather)
2. Настройте Web App: `/newapp` или `/setmenubutton`
3. Укажите URL вашего деплоя (например, Vercel/Netlify)
4. Приложение автоматически получит данные пользователя из `Telegram.WebApp.initDataUnsafe.user`

## Деплой

```bash
npm run build
```

Загрузите содержимое `dist/` на хостинг с HTTPS.

## Формат price_options

```json
[
  { "label": "25 см", "price": 1500 },
  { "label": "50 см", "price": 2500 }
]
```
