#!/bin/bash

# Exit on error
set -e

# Directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCKER_DIR="$SCRIPT_DIR/../docker"
ENV_FILE="$DOCKER_DIR/.env"
ENV_EXAMPLE_FILE="$DOCKER_DIR/.env.example"
KONG_YML="$DOCKER_DIR/volumes/api/kong.yml"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "Error: Docker is not running or not installed. Please start Docker and try again."
  exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f "$ENV_FILE" ]; then
  if [ -f "$ENV_EXAMPLE_FILE" ]; then
    echo "Creating .env file from example..."
    cp "$ENV_EXAMPLE_FILE" "$ENV_FILE"
    
    # Generate secure random values for the .env file
    if command -v openssl > /dev/null; then
      echo "Generating secure random values for passwords and keys..."
      PG_PASS=$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c 32)
      JWT_SECRET=$(openssl rand -base64 48 | tr -dc 'a-zA-Z0-9' | head -c 48)
      REALTIME_KEY=$(openssl rand -base64 48 | tr -dc 'a-zA-Z0-9' | head -c 48)
      
      # Update the .env file with secure values
      sed -i.bak "s/your-super-secret-password/$PG_PASS/g" "$ENV_FILE"
      sed -i.bak "s/your-super-secret-jwt-token-with-at-least-32-characters/$JWT_SECRET/g" "$ENV_FILE"
      sed -i.bak "s/your-super-secret-realtime-key-base-with-at-least-32-characters/$REALTIME_KEY/g" "$ENV_FILE"
      rm -f "$ENV_FILE.bak"
    else
      echo "Warning: openssl not found, using default values from example."
      echo "Please change these values in $ENV_FILE for security before deployment!"
    fi
  else
    echo "Error: Neither .env nor .env.example found in $DOCKER_DIR"
    exit 1
  fi
fi

# Source the environment variables
source "$ENV_FILE"

# Update Kong API keys
echo "Updating Kong API keys..."
sed -i.bak "s/ANON_KEY_PLACEHOLDER/$ANON_KEY/g" "$KONG_YML"
sed -i.bak "s/SERVICE_ROLE_KEY_PLACEHOLDER/$SERVICE_ROLE_KEY/g" "$KONG_YML"
rm -f "$KONG_YML.bak"

# Create required directories
mkdir -p "$DOCKER_DIR/volumes/db/data" "$DOCKER_DIR/volumes/storage"

# Update database init script with proper passwords
echo "Updating database initialization script..."
DB_INIT_SCRIPT="$DOCKER_DIR/volumes/db/init/01-init-db.sql"
sed -i.bak "s/{{POSTGRES_PASSWORD}}/$POSTGRES_PASSWORD/g" "$DB_INIT_SCRIPT"
sed -i.bak "s/{{JWT_SECRET}}/$JWT_SECRET/g" "$DB_INIT_SCRIPT"
rm -f "$DB_INIT_SCRIPT.bak"

# Start the Supabase stack
echo "Starting Supabase stack..."
cd "$DOCKER_DIR"
docker-compose up -d

# Check for healthy status
echo "Waiting for services to be healthy..."
attempts=0
max_attempts=30
while [ $attempts -lt $max_attempts ]; do
  if docker-compose ps | grep -v "healthy" | grep -q "supabase"; then
    echo "Services still starting..."
    sleep 5
    ((attempts++))
  else
    echo "All services are healthy!"
    break
  fi
  
  # If we've waited too long
  if [ $attempts -eq $max_attempts ]; then
    echo "Warning: Some services might not be fully healthy. Check with 'docker-compose ps'."
  fi
done

# Show running services
echo "Supabase is running! Access the dashboard at http://localhost:8000"
echo "Use the following credentials for the API:"
echo "  ANON_KEY: $ANON_KEY"
echo "  SERVICE_ROLE_KEY: $SERVICE_ROLE_KEY"
echo ""
echo "To stop Supabase, run: ./supabase/scripts/stop-local-supabase.sh"