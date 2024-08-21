# Build
FROM golang:1.19.0-alpine AS builder

ENV GO111MODULE=on
ENV GOPATH=/

COPY . .

RUN go run cmd/i18n/gen.go --csv errors.csv --out pkg/core/i18ngen.go --pkg core

RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -trimpath -o /ardo-backend cmd/api/main.go

# Deploy
FROM alpine

# Essentials
RUN apk add -U tzdata

COPY --from=builder ardo-backend .

EXPOSE 8080

CMD ["./ardo-backend"]