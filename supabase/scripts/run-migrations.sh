#!/bin/bash

# Exit on error
set -e

# Directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCKER_DIR="$SCRIPT_DIR/../docker"
MIGRATIONS_DIR="$SCRIPT_DIR/../migrations"
ENV_FILE="$DOCKER_DIR/.env"

# Source the environment variables
source "$ENV_FILE"

# Function to run SQL file
run_sql_file() {
  local file=$1
  echo "Running migration: $file"
  
  # Use docker exec to run PSQL inside the container
  docker exec supabase-db psql \
    -U postgres \
    -d $POSTGRES_DB \
    -f "/docker-entrypoint-initdb.d/migrations/$(basename $file)"
}

# Check if Supabase is running
if ! docker ps | grep -q "supabase-db"; then
  echo "Error: Supabase is not running. Please start it first with ./supabase/scripts/start-local-supabase.sh"
  exit 1
fi

# Copy migrations to the container's init directory
echo "Copying migrations to container..."
mkdir -p "$DOCKER_DIR/volumes/db/init/migrations"

# Copy all SQL files from migrations directory
cp "$MIGRATIONS_DIR"/*.sql "$DOCKER_DIR/volumes/db/init/migrations/"

# Run migrations in order (numerically)
echo "Running migrations..."
for file in $(ls -v "$MIGRATIONS_DIR"/*.sql); do
  run_sql_file "$file"
done

echo "Migrations completed successfully!"