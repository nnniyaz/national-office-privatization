# NOP: Национальный офис приватизации

Монорепозиторий: `server/` (Go 1.26, chi, MongoDB Atlas, DigitalOcean Spaces, SMTP),
`admin/` (React + Vite, панель управления), `client/` (Next.js 14, публичный сайт),
`shared/` (типы и справочники, которые импортируют оба фронта).

Домены: клиент `https://azrk.nop.kz`, админка `https://admin.nop.kz`,
API `https://api.nop.kz/api` (сервер слушает `:8080`, маршруты под `/api`, `/healthz`,
`/swagger/`), файлы `https://files.nop.kz/nop` (DO Spaces).

## Локальный запуск

- `server/`: `.env` по списку ключей из `.k8s/prod-backend.yml` (см. также
  `apps/nop/.env.example` в репозитории infra-azure), затем `make run`.
  Тесты: `bash scripts/test_server.sh` (`go test ./...` с локальным кэшем).
- `admin/`: `npm install && npm start` (порт 3000, `.env.development` с `VITE_*`).
- `client/`: `npm install && npm run dev` (порт 3001, `NEXT_PUBLIC_*`).

В dev-режиме (`IS_DEV_MODE=true`) CORS разрешает `localhost:3000` и `localhost:3001`.

## Деплой

### Текущая схема (Azure VM + Vercel)

- Бэкенд: образ `ghcr.io/nnniyaz/nop-backend` собирается workflow'ом
  `.github/workflows/backend-image.yml` при push в `main` (пути `server/**`) и по тегу
  `v*`; теги `latest`, `<sha>`, `<semver>`. VM в Azure подтягивает `latest` таймером
  systemd каждые 5 минут и запускает `docker compose` из `/opt/nop` (порт
  `127.0.0.1:8083`, наружу через Cloudflare Tunnel как `api.nop.kz`).
- Фронты: проекты Vercel `nop-admin` (Root Directory `admin`, `admin/vercel.json`) и
  `nop-client` (Root Directory `client`, `client/vercel.json`). У обоих включена
  настройка «Include source files outside of the Root Directory», потому что
  `admin/src/shared/i18n/types.ts` и `client/src/shared/i18n/types.ts` реэкспортируют
  `../../../../shared/i18n/types`. Env: `VITE_API_URL`, `VITE_SPACE_HOST`,
  `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SPACE_HOST`.
- Инфраструктура, cutover и откат описаны в репозитории `infra-azure`
  (`docs/nop-migration.md`).

### Legacy (k3s на Hetzner)

`.k8s/prod-{admin,backend,client}.yml`, `.k8s/nginx/nginx.conf` и workflows
`.github/workflows/prod-nop-{admin,backend,client}.yml` (self-hosted runner, приватный
registry, `kubectl apply`) остаются до завершения переезда как путь отката. После cutover
их нужно удалить вместе с `admin/Dockerfile` и `client/Dockerfile`.

## Прочее

`MIGRATION_GUIDE.md`, `I18N_README.md`, `CHANGES_SUMMARY.md`,
`COMPLETE_PROJECT_SUMMARY.md`: история миграции на мультиязычные поля (MlString) и
расширенную схему Enterprise.
