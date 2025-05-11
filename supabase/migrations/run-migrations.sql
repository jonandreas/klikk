-- This script loads and runs all the database migrations
-- It can be executed in the Supabase Database Editor UI or via the PostgreSQL CLI

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Run migration scripts in order

-- 1. Create tables
\i '00001_create_tables.sql'

-- 2. Seed data
\i '00002_seed_data.sql'

-- Note: This approach requires the SQL files to be available in the database server.
-- If you're using the Database Editor UI, you'll need to copy the contents of each file manually.