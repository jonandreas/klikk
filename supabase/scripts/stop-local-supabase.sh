#!/bin/bash

# Exit on error
set -e

# Directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCKER_DIR="$SCRIPT_DIR/../docker"

# Stop the Supabase stack
echo "Stopping Supabase stack..."
cd "$DOCKER_DIR"
docker-compose down

echo "Supabase has been stopped."