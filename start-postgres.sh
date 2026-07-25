#!/usr/bin/env bash

if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

POSTGRES_USER=${POSTGRES_USER:-feeldown}
POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-feeldownpass}
POSTGRES_DB=${POSTGRES_DB:-feeldown}
CONTAINER_NAME=${CONTAINER_NAME:-feeldown-postgres}
POSTGRES_PORT=${POSTGRES_PORT:-5432}
DATABASE_URL=${DATABASE_URL:-postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@localhost:$POSTGRES_PORT/$POSTGRES_DB}

if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "Контейнер $CONTAINER_NAME уже запущен."
  echo "Строка подключения: $DATABASE_URL"
  exit 0
fi

if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "Контейнер $CONTAINER_NAME существует, но остановлен. Запускаем..."
  docker start $CONTAINER_NAME
else
  echo "Запускаем новый контейнер PostgreSQL..."
  docker run --name $CONTAINER_NAME \
    -e POSTGRES_USER=$POSTGRES_USER \
    -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
    -e POSTGRES_DB=$POSTGRES_DB \
    -p $POSTGRES_PORT:5432 \
    -v postgres_data_$CONTAINER_NAME:/var/lib/postgresql/data \
    -d postgres:16-alpine
fi

echo "Ожидаем запуск PostgreSQL..."
sleep 5

if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "PostgreSQL успешно запущен."
  echo "Строка подключения: $DATABASE_URL"

  echo "Применяем миграции Prisma..."
  if command -v npx &> /dev/null; then
    export DATABASE_URL=$DATABASE_URL
    npx prisma migrate deploy --schema ./src/server/prisma/schema.prisma
    if [ $? -eq 0 ]; then
      echo "Миграции применены успешно."
    else
      echo "Ошибка при применении миграций."
      echo "Попробуйте выполнить вручную: npx prisma migrate deploy --schema ./src/server/prisma/schema.prisma"
    fi
  else
    echo "npx не найден. Установите Node.js и npm."
  fi
else
  echo "Не удалось запустить контейнер. Проверьте логи:"
  docker logs $CONTAINER_NAME
  exit 1
fi
