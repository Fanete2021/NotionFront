# Базовый образ: Node.js 22 на Alpine Linux
FROM node:22-alpine

# Системная библиотека для работы sharp (оптимизация изображений)
RUN apk add --no-cache libc6-compat

# Рабочая директория в контейнере
WORKDIR /app

# Установка pnpm 9.15.0 (стабильная версия для CI/CD)
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Копируем манифесты зависимостей и конфиг pnpm
COPY package.json pnpm-lock.yaml .npmrc ./

# Установка зависимостей
RUN pnpm install --frozen-lockfile

# Копируем исходный код проекта
COPY . .

# Порт для dev-сервера Next.js
EXPOSE 3000

# Запуск: подчистить yaml (баг pnpm), поставить deps из lockfile, поднять dev
CMD ["sh", "-c", "rm -f pnpm-workspace.yaml && pnpm install --frozen-lockfile && pnpm dev"]
