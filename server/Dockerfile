# Build
FROM golang:1.22.1-alpine AS builder

ENV GO111MODULE=on
ENV GOPATH=/

COPY . .

RUN go run cmd/i18n/gen.go --csv errors.csv --out pkg/core/i18ngen.go --pkg core

RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -trimpath -o /nop-backend cmd/api/main.go

# Deploy
FROM alpine

# Essentials
RUN apk add -U tzdata

COPY --from=builder nop-backend .

EXPOSE 8080

CMD ["./nop-backend"]
