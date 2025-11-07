#!/usr/bin/env bash
set -euo pipefail

mkdir -p .cache/go-build .cache/gomod .gopath

export GOCACHE="$PWD/.cache/go-build"
export GOMODCACHE="${GOMODCACHE:-$PWD/.cache/gomod}"
export GOPATH="$PWD/.gopath"

# если у вас есть vendor, можно поменять на -mod=vendor
go test -count=1 ./...