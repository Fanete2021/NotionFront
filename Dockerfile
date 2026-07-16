# Базовый образ: Node.js 22 на легком Alpine Linux
FROM node:22-alpine

# Системная библиотека, необходимая для работы sharp (оптимизация картинок в Next.js)
RUN apk add --no-cache libc6-compat

# Рабочая директория внутри контейнера
WORKDIR /app

# Установка стабильной версии pnpm через corepack
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Копируем файлы зависимостей (для кэширования слоя Docker)
COPY package.json pnpm-lock.yaml ./

# Разрешаем сборку нативных модулей (обход блокировки безопасности pnpm 9+ в Docker)
RUN pnpm config set ignore-scripts false
RUN pnpm config set only-built-dependencies "sharp,unrs-resolver"

# Установка зависимостей строго по lock-файлу
RUN pnpm install --frozen-lockfile

# Копируем весь исходный код проекта
COPY . .

# Порт, который слушает dev-сервер Next.js
EXPOSE 3000

# Команда запуска приложения
CMD ["pnpm", "dev"]
