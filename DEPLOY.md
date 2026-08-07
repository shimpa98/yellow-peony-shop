# Деплой через GitHub Pages + @YellowPeonyBot

---

## GitHub Pages

Workflow собирает проект и публикует в ветку **`gh-pages`** (один job — быстрее, без очереди раннеров).

### 1. Секреты Supabase

**Settings** → **Secrets and variables** → **Actions** → **New repository secret**:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | `https://puvzyxvlykeiuomphbqz.supabase.co` |
| `VITE_SUPABASE_KEY` | ключ из `.env` |

### 2. Включите GitHub Pages

1. **Settings** → **Pages**
2. **Source:** **Deploy from a branch**
3. **Branch:** `gh-pages` → **`/ (root)`**
4. Сохраните

### 3. Запустите деплой

```powershell
cd d:\flowers\flowers-frontend
git push
```

Или вручную: **Actions** → **Deploy to GitHub Pages** → **Run workflow**.

Через 1–2 минуты сайт будет доступен:

```
https://shimpa98.github.io/yellow-peony-shop/
```

### 4. URL для @YellowPeonyBot

В [@BotFather](https://t.me/BotFather):

1. `/mybots` → **@YellowPeonyBot**
2. **Menu Button** → URL: `https://shimpa98.github.io/yellow-peony-shop/`

---

## Netlify (альтернатива)

### 1. Подключите репозиторий

1. [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**
2. **GitHub** → репозиторий `shimpa98/yellow-peony-shop`
3. Netlify подхватит `netlify.toml` автоматически:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. **Deploy site**

### 2. Переменные окружения

**Site settings** → **Environment variables** → **Add a variable**:

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | `https://puvzyxvlykeiuomphbqz.supabase.co` |
| `VITE_SUPABASE_KEY` | ключ из `.env` |

После добавления: **Deploys** → **Trigger deploy** → **Clear cache and deploy site**.

### 3. URL для Telegram-бота

После деплоя Netlify даст адрес вида:

```
https://random-name-123.netlify.app
```

Можно переименовать: **Site settings** → **Domain management** → **Options** → **Edit site name** (например `yellow-peony-shop` → `https://yellow-peony-shop.netlify.app`).

В [@BotFather](https://t.me/BotFather):

1. `/mybots` → **@YellowPeonyBot**
2. **Menu Button** → URL: `https://ваш-сайт.netlify.app/`

### 4. Обновление

Каждый `git push` в `main` автоматически пересобирает сайт на Netlify.

---

## Обновление сайта

```powershell
cd d:\flowers\flowers-frontend
git add .
git commit -m "Описание изменений"
git push
```

GitHub Actions автоматически пересоберёт и опубликует сайт.

---

## Частые проблемы

| Проблема | Решение |
|----------|---------|
| Actions падает на Build | Проверьте секреты `VITE_SUPABASE_URL` и `VITE_SUPABASE_KEY` |
| Белый экран, нет стилей | Проверьте `VITE_BASE_PATH` — должен быть `/имя-репозитория/` |
| Pages: сайт не обновляется | Settings → Pages → Branch **`gh-pages`**, folder **`/ (root)`** |
| Каталог пустой | Выполните `supabase-setup.sql` в Supabase |
| BotFather не принимает URL | Только `https://`, не localhost |

---

## Чеклист

- [ ] Код на GitHub
- [ ] Секреты Supabase в Actions
- [ ] Pages: Branch = **gh-pages**, folder = **/ (root)**
- [ ] Actions: deploy зелёный
- [ ] Сайт открывается в браузере
- [ ] BotFather: URL для @YellowPeonyBot
- [ ] Проверка в Telegram с телефона
