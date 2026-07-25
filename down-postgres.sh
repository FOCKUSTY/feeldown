#!/usr/bin/env bash

# =======================================================
#  Остановка контейнера PostgreSQL
# =======================================================

CONTAINER_NAME=${CONTAINER_NAME:-feeldown-postgres}

if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "Останавливаем контейнер $CONTAINER_NAME..."
  docker stop $CONTAINER_NAME
  echo "Контейнер остановлен."
else
  echo " Контейнер $CONTAINER_NAME не запущен."
fi
