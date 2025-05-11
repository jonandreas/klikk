#!/bin/bash

# Exit on error
set -e

# Directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MIGRATIONS_DIR="$SCRIPT_DIR/../supabase/migrations"
ENV_FILE="$SCRIPT_DIR/../.env.local"

# Check if .env.local exists
if [ ! -f "$ENV_FILE" ]; then
  echo "Error: .env.local file not found. Please create it with your Supabase credentials."
  exit 1
fi

# Extract variables directly instead of sourcing (which doesn't work well with .env files)
SUPABASE_URL=$(grep "NEXT_PUBLIC_SUPABASE_URL" "$ENV_FILE" | cut -d '=' -f 2- | tr -d '"' | tr -d "'" | tr -d ' ')
SERVICE_KEY=$(grep "SUPABASE_SERVICE_ROLE_KEY" "$ENV_FILE" | cut -d '=' -f 2- | tr -d '"' | tr -d "'" | tr -d ' ')

# Check if required variables are set
if [ -z "$SUPABASE_URL" ] || [ -z "$SERVICE_KEY" ]; then
  echo "Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local"
  exit 1
fi

echo "Running migrations against Supabase URL: $SUPABASE_URL"

# Pass the variables to the Node script via environment
NEXT_PUBLIC_SUPABASE_URL="$SUPABASE_URL" SUPABASE_SERVICE_ROLE_KEY="$SERVICE_KEY" node "$SCRIPT_DIR/run-cloud-migrations.js"

echo "Migrations complete! Now running seed script..."

# Run the seed API endpoint to populate test users
curl -X POST "http://localhost:3000/api/seed" \
  -H "Content-Type: application/json" \
  -d "{}"

echo "Database setup complete!"