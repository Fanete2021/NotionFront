# Развёртывание фронтенда и CI/CD

Проект публикуется как standalone-образ Next.js в GitHub Container Registry (GHCR). При пуше
в `main` GitHub Actions проверяет код, собирает образ, публикует теги `latest` и короткий SHA,
после чего по SSH запускает деплой на сервере.

## Что находится в репозитории

- `Dockerfile` и `docker-compose.yml` — прежнее локальное окружение разработки с hot reload.
- `Dockerfile.prod` — отдельная multi-stage production-сборка без исходников и
  dev-зависимостей в финальном образе.
- `docker-compose.prod.yml` — запуск опубликованного образа на сервере.
- `deploy.sh` — загрузка образа, ожидание healthcheck и автоматический откат при неудачном
  запуске.
- `.github/workflows/deploy.yml` — проверки, публикация образа и деплой.
- `.github/workflows/cleanup-packages.yml` — еженедельная очистка старых версий образа.
- `app/api/health/route.ts` — endpoint `GET /api/health` для Docker healthcheck.

## Настройки GitHub

В **Settings → Secrets and variables → Actions → Variables** создайте переменную:

| Имя | Пример | Назначение |
| --- | --- | --- |
| `NEXT_PUBLIC_BASE_API_URL` | `https://api.example.com` | URL API, встраиваемый в клиент при сборке |

В **Settings → Secrets and variables → Actions → Secrets** должны быть:

| Имя | Значение |
| --- | --- |
| `SSH_PRIVATE_KEY` | приватный SSH-ключ пользователя деплоя целиком |
| `SSH_KNOWN_HOSTS` | результат `ssh-keyscan -H <host>` |
| `DEPLOY_HOST` | IP-адрес или домен сервера |
| `DEPLOY_USER` | например, `deploy` |
| `DEPLOY_PATH` | каталог фронтенда, например `/home/deploy/front` |

`NEXT_PUBLIC_BASE_API_URL` является build-time переменной Next.js. Изменение серверного `.env`
не меняет URL API в уже собранном браузерном коде — после изменения GitHub Variable нужен новый
пуш или ручная сборка без указанного тега.

## Подготовка сервера

На сервере должны быть установлены Docker Engine и Docker Compose v2. Под пользователем деплоя:

```bash
mkdir -p /home/deploy/front
cd /home/deploy/front
```

Скопируйте в этот каталог `docker-compose.prod.yml` и `deploy.sh`, затем:

```bash
chmod +x deploy.sh
```

Создайте `/home/deploy/front/.env`:

```env
REGISTRY_IMAGE=ghcr.io/fanete2021/notionfront
IMAGE_TAG=latest
BIND_ADDRESS=127.0.0.1
HOST_PORT=3000
```

Защитите файл и войдите в приватный GHCR. Для токена GitHub достаточно права `read:packages`:

```bash
chmod 600 .env
echo '<github-token>' | docker login ghcr.io -u '<github-user>' --password-stdin
```

По умолчанию порт доступен только на `127.0.0.1:3000`; внешний HTTPS следует терминировать в
Nginx, Caddy или другом reverse proxy. Если прямой внешний порт действительно нужен, задайте
`BIND_ADDRESS=0.0.0.0` и ограничьте доступ firewall.

Проверка конфигурации и первый запуск:

```bash
docker compose -f docker-compose.prod.yml config
./deploy.sh latest
curl -i http://127.0.0.1:3000/api/health
```

## Обычный деплой и откат

Пуш или merge в `main` запускает workflow **CI and deploy frontend**. Образ появляется в
**Repository → Packages**, а ход сборки — в **Repository → Actions**.

Для отката откройте **Actions → CI and deploy frontend → Run workflow** и укажите короткий SHA
старого образа в поле `tag`. При заполненном `tag` workflow не пересобирает текущую ветку, а сразу
разворачивает существующий образ. Последний заменённый тег также сохраняется на сервере в
`.image-prev`.

Ручной откат на сервере:

```bash
cat .image-prev
./deploy.sh <старый-тег>
```
