# Notion Clone Frontend

Современная система для ведения заметок, документации и управления проектами, вдохновленная Notion.

Frontend приложения построен на **Next.js**, **TypeScript** и **Feature-Sliced Design** с использованием современного production-ready стека.

---

## ✨ Основные возможности

- 🔐 Аутентификация и авторизация
- 📂 Создание проектов
- 📄 Вложенные страницы
- 🔍 Поиск и фильтрация
- 🗑 Корзина
- 📝 Блочный редактор
- 📸 Работа с изображениями
- 🎥 Вставка видео
- ✅ Todo-листы
- 💬 Комментарии
- 👥 Совместное редактирование (Realtime)
- 📚 История изменений
- 🌐 Публичные страницы
- 🚀 SEO оптимизация
- 📅 Календарь
- 🤖 AI генерация текста
- ⚙️ Личный кабинет
- 📲 Интеграция с Telegram

---

# Стек

## Core

- Next.js
- React
- TypeScript
- pnpm

## State Management

- TanStack Query
- Redux Toolkit

## UI

- CSS modules
- shadcn/ui

## Forms

- React Hook Form
- Zod

## Realtime

- Socket.IO Client

## Architecture

- Feature-Sliced Design (FSD)

## Quality

- ESLint
- Prettier
- Husky
- lint-staged

## Testing

- Vitest
- React Testing Library

## Monitoring

- Sentry

## UI Development

- Storybook

---

# Требования

Перед началом работы необходимо установить:

| Инструмент | Версия |
|------------|--------|
| Node.js | >= 20 |
| pnpm | >= 9 |

Проверить установленные версии:

```bash
node -v

pnpm -v

---

## Установка проекта

### Клонирование репозитория:

git clone <repository-url>

### Установка зависимостей:

pnpm install

---

## Запуск проекта
### Development режим

#### Запуск локального сервера разработки:

pnpm dev

#### После запуска приложение будет доступно:

http://localhost:3000
### Production режим

#### Создание production сборки:

pnpm build

#### Запуск production версии:

pnpm start
### Доступные команды

| Команда | Описание |
|---------|----------|
| `pnpm dev` | Запуск проекта в режиме разработки (`development`) |
| `pnpm build` | Сборка проекта для production окружения |
| `pnpm start` | Запуск production версии приложения после сборки |
| `pnpm lint` | Проверка качества кода с помощью ESLint |
