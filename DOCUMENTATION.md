# Felldown

## Документация проекта Feeldown

### 📖 О проекте

**Feeldown** — это социальная платформа для публикации заметок и статей в формате Markdown. Проект представляет собой полнофункциональное веб-приложение с серверным рендерингом (SSR), аутентификацией через Google OAuth 2.0, поддержкой Markdown с подсветкой синтаксиса и гибкой системой маршрутизации.

Приложение позволяет пользователям:

- Входить через учётную запись Google
- Создавать посты с форматированием Markdown
- Просматривать посты других пользователей
- Просматривать профили пользователей и их публикации

Проект разработан с использованием **Angular** (v21) на фронтенде, **Express** на бэкенде, **Prisma ORM** для работы с PostgreSQL и **Passport.js** для аутентификации.

---

### 🛠️ Технологический стек

| Категория       | Технологии                                                                            |
| --------------- | ------------------------------------------------------------------------------------- |
| **Фронтенд**    | Angular 21, TypeScript, Tailwind CSS, ngx-markdown, RxJS, Angular SSR                 |
| **Бэкенд**      | Node.js, Express, Passport.js (Google OAuth), JWT, express-session, express-validator |
| **База данных** | PostgreSQL, Prisma ORM (с адаптером @prisma/adapter-pg)                               |
| **Инструменты** | Angular CLI, pnpm, Vite (через @angular/build), ESLint, TypeScript                    |
| **Деплой**      | Vercel (с конфигурацией vercel.json), поддержка серверных функций                     |
| **Прочее**      | dotenv, fenviee (валидация env), uuid, ngx-cookie-service, Prism.js (подсветка кода)  |

---

### 🚀 Быстрый старт

#### Требования

- Node.js (v20 или выше)
- pnpm (рекомендуется) или npm
- PostgreSQL (локально или через облачный сервис, например, Neon)

#### Установка

1. Клонируйте репозиторий:

```bash
git clone https://github.com/FOCKUSTY/feeldown.git
cd feeldown
```

1. Установите зависимости:

```bash
pnpm install
```

1. Настройте переменные окружения (см. раздел **Конфигурация**).

2. Сгенерируйте клиент Prisma и выполните миграции:

```bash
pnpm run generate
npx prisma migrate dev --name init
```

1. Запустите сервер разработки:

```bash
pnpm start
```

После запуска приложение будет доступно по адресу `http://localhost:4200`.

Для сборки production-версии:

```bash
pnpm build
```

---

### ⚙️ Конфигурация

Создайте файл `.env` в корне проекта со следующими переменными:

| Переменная               | Описание                                                                                  |
| ------------------------ | ----------------------------------------------------------------------------------------- |
| `DATABASE_URL`           | URL подключения к PostgreSQL (например, `postgresql://user:pass@localhost:5432/feeldown`) |
| `GOOGLE_CLIENT_ID`       | Client ID из Google Cloud Console                                                         |
| `GOOGLE_CLIENT_SECRET`   | Client Secret из Google Cloud Console                                                     |
| `GOOGLE_CALLBACK_URL`    | URL колбэка Google OAuth (например, `http://localhost:4200/api/auth/google/callback`)     |
| `SESSION_SECRET`         | Секрет для сессий express-session (строка)                                                |
| `HASH_KEY`               | Ключ для подписи JWT (строка)                                                             |
| `CALLBACK_URL`           | URL для редиректа после успешного входа (например, `http://localhost:4200`)               |
| `PORT`                   | Порт сервера (по умолчанию 4200)                                                          |
| `TOKEN_EXPIRATION`       | Срок действия JWT (формат: `1d`, `24h`, `60m` и т.д., по умолчанию `7d`)                  |
| `ALLOWED_HOSTS`          | Разрешённые хосты (через запятую, например `localhost,feeldown.vercel.app`)               |
| `PRISMA_CONNECTION_TYPE` | Тип подключения Prisma (`adapter` или `accelerate`, по умолчанию `adapter`)               |

Пример `.env`:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/feeldown
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CALLBACK_URL=http://localhost:4200/api/auth/google/callback
SESSION_SECRET=supersecretkey
HASH_KEY=anothersecretkey
CALLBACK_URL=http://localhost:4200
PORT=4200
TOKEN_EXPIRATION=7d
ALLOWED_HOSTS=localhost
PRISMA_CONNECTION_TYPE=adapter
```

---

### 📁 Структура проекта

```
feeldown/
├── api/                      # Вспомогательный код для Vercel
│   └── index.js              # Точка входа для серверной функции Vercel
├── public/                   # Статические файлы
├── src/
│   ├── app/                  # Основной код приложения Angular
│   │   ├── components/       # Переиспользуемые компоненты (FdButton и др.)
│   │   ├── constants/        # Константы (тестовый Markdown)
│   │   ├── layouts/          # Компоненты layout (NoLayout)
│   │   ├── pages/            # Страницы (home, posts, users)
│   │   │   ├── home/         # Главная страница
│   │   │   ├── posts/        # Страницы постов (создание, просмотр)
│   │   │   └── users/        # Страницы пользователей (профиль, посты)
│   │   ├── services/         # Сервисы (Auth, User, Post, HttpBase)
│   │   ├── app.config.ts     # Конфигурация приложения
│   │   ├── app.config.server.ts # Конфигурация для SSR
│   │   ├── app.module.ts     # Маршрутизация
│   │   ├── app.routes.server.ts # Правила рендеринга для SSR
│   │   └── app.ts            # Корневой компонент
│   ├── server/               # Бэкенд-часть (Express + Prisma)
│   │   ├── middlewares/      # Мидлвары (tokenMiddleware)
│   │   ├── prisma/           # Схема Prisma, клиент, миграции
│   │   │   ├── schema.prisma # Определение моделей
│   │   │   ├── migrations/   # SQL-миграции
│   │   │   └── prisma.service.ts # Инициализация PrismaClient
│   │   ├── routes/           # Маршруты API
│   │   │   ├── auth/         # Аутентификация (Google OAuth)
│   │   │   ├── posts/        # Работа с постами
│   │   │   └── users/        # Работа с пользователями
│   │   ├── services/         # Сервисные функции (unit-time, token)
│   │   ├── strategies/       # Стратегии Passport (Google)
│   │   ├── types/            # TypeScript-типы
│   │   ├── env.ts            # Валидация переменных окружения
│   │   └── server.ts         # Главный файл сервера
│   ├── styles/               # Глобальные стили (Tailwind, маркдаун, скролл)
│   ├── utils/                # Утилиты (загрузка модулей, layout)
│   ├── index.html            # HTML-шаблон
│   ├── main.ts               # Точка входа клиента
│   └── main.server.ts        # Точка входа для SSR
├── .env                      # Переменные окружения (не в репозитории)
├── .gitignore
├── angular.json              # Конфигурация Angular
├── package.json
├── prisma.config.ts          # Конфигурация Prisma
├── tsconfig.json             # Основной TS-конфиг
├── tsconfig.app.json
├── tsconfig.spec.json
├── vercel.json               # Конфигурация для Vercel
└── README.md                 # Документация (этот файл)
```

---

### 🌐 API Endpoints

#### Аутентификация

- `GET /api/auth/google` — перенаправляет на страницу входа Google.
- `GET /api/auth/google/callback` — колбэк после аутентификации. При успехе редиректит на `CALLBACK_URL` с параметром `?token=<JWT>`.

#### Пользователи

- `GET /api/users/@me` — возвращает текущего авторизованного пользователя (требуется токен).
- `GET /api/users/:slug` — возвращает данные пользователя. `slug` может быть:
  - `@username` — поиск по имени пользователя
  - `id` — поиск по UUID
- `GET /api/users/:slug/posts` — возвращает список постов пользователя.

#### Посты

- `POST /api/posts` — создаёт новый пост. Требуется авторизация (токен в заголовке `Authorization: Bearer <token>`). Тело: `{ "content": "Markdown-текст" }`. Возвращает созданный пост.
- `GET /api/posts/:id` — возвращает пост по ID вместе с данными автора.

Все API-ответы обёрнуты в объект `{ data: ... }`.

---

### 🧪 Тестирование

Для запуска юнит-тестов (Vitest):

```bash
pnpm test
```

---

### 📦 Сборка и деплой

#### Сборка проекта

```bash
pnpm build
```

Сборка создаёт `dist/feeldown/` с клиентскими и серверными файлами.

#### Деплой на Vercel

Проект уже содержит `vercel.json` для развёртывания серверной функции. Настройте переменные окружения в панели Vercel. Для деплоя:

```bash
vercel --prod
```

---

### 📝 Лицензия

Проект распространяется под лицензией **MIT**. Подробнее в файле [LICENSE](LICENSE).

---

### 👤 Автор

**FOCKUSTY**

- GitHub: [FOCKUSTY](https://github.com/FOCKUSTY)
- Telegram: [@fockusty](https://t.me/fockusty)

---

### 🙏 Благодарности

Проект создан в учебных и исследовательских целях. Используемые Open Source библиотеки и инструменты — спасибо их авторам!
