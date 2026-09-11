# Контекст сборки: каталог server/ (docker build -f server/Dockerfile server).
# Сборка в GitHub Actions: .github/workflows/backend-image.yml -> ghcr.io/nnniyaz/nop-backend.

# --- build
FROM golang:1.26-alpine AS builder

WORKDIR /src

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go run ./cmd/i18n --csv errors.csv --out pkg/core/i18ngen.go --pkg core
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -trimpath -o /out/nop-backend ./cmd/api

# --- runtime
FROM alpine:3.21

RUN apk add --no-cache ca-certificates tzdata \
    && addgroup -S -g 10001 app \
    && adduser -S -u 10001 -G app -H -s /sbin/nologin app

COPY --from=builder /out/nop-backend /usr/local/bin/nop-backend

USER app:app
EXPOSE 8080

# busybox wget используется healthcheck'ом compose: GET /healthz
ENTRYPOINT ["/usr/local/bin/nop-backend"]
