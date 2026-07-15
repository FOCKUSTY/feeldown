# Feeldown

**Feeldown** — социальная платформа для публикации заметок и статей в формате Markdown с аутентификацией через Google OAuth, серверным рендерингом (Angular SSR) и современным стеком на базе TypeScript.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Angular](https://img.shields.io/badge/Angular-21-red)](https://angular.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-7-blue)](https://www.prisma.io/)
[![Express](https://img.shields.io/badge/Express-5-green)](https://expressjs.com/)

---

## Возможности

- 🔐 **Аутентификация** через Google OAuth 2.0 (Passport.js)
- ✍️ **Создание постов** с поддержкой полного синтаксиса Markdown
- 👁️ **Просмотр постов** с подсветкой синтаксиса (Prism.js)
- 👤 **Профили пользователей** и список их публикаций
- ⚡ **Серверный рендеринг (SSR)** для быстрой загрузки и SEO
- 🎨 **Адаптивный дизайн** на Tailwind CSS (светлая/тёмная тема)
- 🗄️ **PostgreSQL** + **Prisma ORM** с миграциями и адаптером для пула соединений
- 🚀 **Готов к деплою** на Vercel (включая серверные функции)
- 🧩 **Модульная архитектура** с ленивой загрузкой маршрутов

---

## Технологический стек

| Категория       | Технологии                                                                            |
| --------------- | ------------------------------------------------------------------------------------- |
| **Фронтенд**    | Angular 21, TypeScript, Tailwind CSS, ngx-markdown, RxJS, Angular SSR                 |
| **Бэкенд**      | Node.js, Express, Passport.js (Google OAuth), JWT, express-session, express-validator |
| **База данных** | PostgreSQL, Prisma ORM (адаптер @prisma/adapter-pg)                                   |
| **Инструменты** | Angular CLI, pnpm, Vite, ESLint, TypeScript                                           |
| **Деплой**      | Vercel (с конфигурацией vercel.json)                                                  |
| **Прочее**      | dotenv, fenviee (валидация env), uuid, ngx-cookie-service, Prism.js                   |

---

## Требования

- Node.js **20+**
- pnpm (рекомендуется) или npm
- PostgreSQL (локально или облачный сервис, например [Neon](https://neon.tech))

---

## Установка и запуск

### 1. Клонирование репозитория

```bash
git clone https://github.com/FOCKUSTY/feeldown.git
cd feeldown
```

### 2. Установка зависимостей

```bash
pnpm install
```

### 3. Настройка переменных окружения

Создайте файл `.env` в корне проекта со следующим содержимым (замените значения на свои):

```env
# PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/feeldown

# Google OAuth (получить в Google Cloud Console)
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CALLBACK_URL=http://localhost:4200/api/auth/google/callback

# Сессии и JWT
SESSION_SECRET=supersecretkey
HASH_KEY=anothersecretkey

# Редирект после входа
CALLBACK_URL=http://localhost:4200

# Порт (по умолчанию 4200)
PORT=4200

# Срок жизни JWT (например, 7d, 24h, 60m)
TOKEN_EXPIRATION=7d

# Разрешённые хосты (через запятую)
ALLOWED_HOSTS=localhost

# Тип подключения Prisma: adapter или accelerate
PRISMA_CONNECTION_TYPE=adapter
```

> **Важно:** файл `.env` не должен попадать в репозиторий (уже добавлен в `.gitignore`).

### 4. Генерация клиента Prisma и миграции

```bash
pnpm run generate
npx prisma migrate dev --name init
```

### 5. Запуск в режиме разработки

```bash
pnpm start
```

Приложение будет доступно по адресу: [http://localhost:4200](http://localhost:4200).

---

## Сборка для production

```bash
pnpm build
```

Готовые артефакты появятся в папке `dist/feeldown`.

---

## API Endpoints

Все ответы обёрнуты в объект `{ data: ... }`.

### Аутентификация

- `GET /api/auth/google` – редирект на страницу входа Google.
- `GET /api/auth/google/callback` – колбэк OAuth. При успехе редиректит на `CALLBACK_URL?token=<JWT>`.

### Пользователи

- `GET /api/users/@me` – текущий авторизованный пользователь (требуется токен).
- `GET /api/users/:slug` – данные пользователя. `slug` может быть `@username` или `id`.
- `GET /api/users/:slug/posts` – список постов пользователя.

### Посты

- `POST /api/posts` – создать пост (требуется токен). Тело: `{ "content": "Markdown..." }`.
- `GET /api/posts/:id` – получить пост с данными автора.

---

## Структура проекта

```
feeldown/
├── api/                      # Точка входа для Vercel
├── public/                   # Статические файлы
├── src/
│   ├── app/                  # Angular-приложение
│   │   ├── components/       # UI-компоненты
│   │   ├── constants/        # Константы (тестовый Markdown)
│   │   ├── layouts/          # Компоненты layout
│   │   ├── pages/            # Страницы (home, posts, users)
│   │   ├── services/         # Сервисы (Auth, User, Post)
│   │   ├── app.config.ts     # Конфигурация приложения
│   │   ├── app.module.ts     # Маршрутизация
│   │   └── app.ts            # Корневой компонент
│   ├── server/               # Бэкенд (Express + Prisma)
│   │   ├── middlewares/      # Мидлвары
│   │   ├── prisma/           # Схема, клиент, миграции
│   │   ├── routes/           # API-маршруты
│   │   ├── strategies/       # Passport-стратегии
│   │   ├── env.ts            # Валидация env
│   │   └── server.ts         # Главный файл сервера
│   ├── styles/               # Глобальные стили
│   ├── utils/                # Утилиты
│   ├── main.ts               # Точка входа клиента
│   └── main.server.ts        # Точка входа SSR
├── .env                      # Переменные окружения (не в репозитории)
├── angular.json
├── package.json
├── prisma.config.ts
├── tsconfig*.json
├── vercel.json
└── README.md
```

---

## Тестирование

Запуск юнит-тестов (Vitest):

```bash
pnpm test
```

---

## Деплой на Vercel

Проект уже настроен для деплоя на Vercel через `vercel.json`. Для развёртывания:

1. Установите Vercel CLI:

   ```bash
   pnpm add -g vercel
   ```

2. Выполните деплой:

   ```bash
   vercel --prod
   ```

3. Настройте переменные окружения в панели Vercel (те же, что в `.env`).

---

## Лицензия

Проект распространяется под лицензией MIT. Подробности в файле [LICENSE](LICENSE).

---

## Автор

**FOCKUSTY**

- GitHub: [github.com/FOCKUSTY](https://github.com/FOCKUSTY)
- Telegram: [@fockusty](https://t.me/fockusty)

---

## Благодарности

Всем авторам Open Source библиотек, которые сделали этот проект возможным.
