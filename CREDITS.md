# Благодарности и сторонние библиотеки

Проект **Feeldown** использует множество замечательных Open Source библиотек. Мы выражаем глубокую благодарность всем авторам и сообществам, которые сделали эти инструменты доступными.

---

## Фреймворки и ядро

| Библиотека                                       | Версия | Лицензия | Описание                 |
| ------------------------------------------------ | ------ | -------- | ------------------------ |
| [@angular/common](https://angular.io/)           | 21.1.0 | MIT      | Основные утилиты Angular |
| [@angular/core](https://angular.io/)             | 21.1.0 | MIT      | Ядро Angular             |
| [@angular/forms](https://angular.io/)            | 21.1.0 | MIT      | Работа с формами         |
| [@angular/platform-browser](https://angular.io/) | 21.1.0 | MIT      | Рендеринг в браузере     |
| [@angular/platform-server](https://angular.io/)  | 21.1.0 | MIT      | Серверный рендеринг      |
| [@angular/router](https://angular.io/)           | 21.1.0 | MIT      | Маршрутизация            |
| [@angular/ssr](https://angular.io/)              | 21.1.2 | MIT      | Инструменты для SSR      |
| [express](https://expressjs.com/)                | 5.1.0  | MIT      | Веб-фреймворк Node.js    |

---

## Аутентификация и безопасность

| Библиотека                                                                        | Версия | Лицензия | Описание                     |
| --------------------------------------------------------------------------------- | ------ | -------- | ---------------------------- |
| [passport](http://passportjs.org/)                                                | 0.7.0  | MIT      | Универсальная аутентификация |
| [passport-google-oauth20](https://github.com/jaredhanson/passport-google-oauth20) | 2.0.0  | MIT      | Стратегия Google OAuth 2.0   |
| [passport-oauth2](https://github.com/jaredhanson/passport-oauth2)                 | 1.8.0  | MIT      | Базовый OAuth 2.0            |
| [express-session](https://github.com/expressjs/session)                           | 1.19.0 | MIT      | Управление сессиями          |
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)                        | 9.0.3  | MIT      | JWT (токены)                 |

---

## База данных

| Библиотека                               | Версия | Лицензия   | Описание                   |
| ---------------------------------------- | ------ | ---------- | -------------------------- |
| [@prisma/client](https://prisma.io/)     | 7.8.0  | Apache-2.0 | ORM-клиент                 |
| [@prisma/adapter-pg](https://prisma.io/) | 7.8.0  | Apache-2.0 | Адаптер PostgreSQL с пулом |
| [prisma](https://prisma.io/)             | 7.8.0  | Apache-2.0 | CLI и миграции             |
| [pg](https://node-postgres.com/)         | 8.22.0 | MIT        | PostgreSQL драйвер         |

---

## UI и стили

| Библиотека                                       | Версия | Лицензия | Описание             |
| ------------------------------------------------ | ------ | -------- | -------------------- |
| [tailwindcss](https://tailwindcss.com/)          | 4.1.12 | MIT      | CSS-фреймворк        |
| [@tailwindcss/postcss](https://tailwindcss.com/) | 4.1.12 | MIT      | Интеграция с PostCSS |
| [postcss](https://postcss.org/)                  | 8.5.3  | MIT      | Трансформация CSS    |
| [prismjs](https://prismjs.com/)                  | 1.30.0 | MIT      | Подсветка синтаксиса |

---

## Markdown и контент

| Библиотека                                             | Версия | Лицензия | Описание                     |
| ------------------------------------------------------ | ------ | -------- | ---------------------------- |
| [ngx-markdown](https://github.com/jfcere/ngx-markdown) | 22.0.0 | MIT      | Рендеринг Markdown в Angular |
| (транзитивно: marked, markdown-it и др.)               | –      | MIT      | Парсеры Markdown             |

---

## Утилиты и вспомогательные библиотеки

| Библиотека                                                                | Версия | Лицензия   | Описание                                   |
| ------------------------------------------------------------------------- | ------ | ---------- | ------------------------------------------ |
| [rxjs](https://rxjs.dev/)                                                 | 7.8.0  | Apache-2.0 | Реактивные потоки                          |
| [tslib](https://github.com/Microsoft/tslib)                               | 2.3.0  | 0BSD       | Runtime для TypeScript                     |
| [uuid](https://github.com/uuidjs/uuid)                                    | 14.0.1 | MIT        | Генерация уникальных ID                    |
| [ngx-cookie-service](https://github.com/stevermeister/ngx-cookie-service) | 22.0.0 | MIT        | Работа с куками в Angular                  |
| [express-validator](https://express-validator.github.io)                  | 7.3.2  | MIT        | Валидация запросов                         |
| [fenviee](https://github.com/FOCKUSTY/fenviee)                            | 0.1.2  | MIT        | Валидация переменных окружения (авторская) |

---

## Инструменты разработки (DevDependencies)

| Библиотека                                    | Версия | Лицензия     | Описание                      |
| --------------------------------------------- | ------ | ------------ | ----------------------------- |
| [@angular/cli](https://angular.dev/tools/cli) | 21.1.2 | MIT          | CLI Angular                   |
| [@angular/build](https://angular.dev/)        | 21.1.2 | MIT          | Сборка приложения (Vite)      |
| [typescript](https://www.typescriptlang.org/) | 5.9.2  | Apache-2.0   | Язык программирования         |
| [vitest](https://vitest.dev/)                 | 4.0.8  | MIT          | Тестовый раннер               |
| [jsdom](https://github.com/jsdom/jsdom)       | 27.1.0 | MIT          | DOM-эмуляция для тестов       |
| [dotenv](https://github.com/motdotla/dotenv)  | 17.4.2 | BSD-2-Clause | Загрузка переменных окружения |
| [@types/\*](https://definitelytyped.org/)     | разные | MIT          | TypeScript-типы               |

---

## Особые благодарности

- **Команде Angular** за надёжный и производительный фреймворк.
- **Авторам Prisma** за интуитивную и безопасную работу с БД.
- **Разработчикам Passport.js** за простую и расширяемую аутентификацию.
- **Всем мейнтейнерам Open Source проектов**, которые делают разработку доступнее.

---

## Лицензии

Все библиотеки распространяются под свободными лицензиями, совместимыми с MIT-лицензией проекта Feeldown. Полные тексты лицензий доступны в соответствующих репозиториях.

---

_Если вы считаете, что мы упустили какую-то библиотеку, пожалуйста, создайте Issue или Pull Request._
