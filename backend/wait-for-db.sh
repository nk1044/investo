#!/bin/sh

echo "Waiting for database to be ready..."

# Wait for the database to be ready
until pg_isready -h db -p 5432 -U TestUser; do
  echo "Database not ready yet. Retrying in 2 seconds..."
  sleep 2
done

echo "Database is ready! Running Prisma setup..."

# Run Prisma commands
prisma generate
prisma migrate deploy

echo "Starting backend..."
exec uvicorn main:app --host 0.0.0.0 --port 8000