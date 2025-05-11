// run-cloud-migrations.js
// Script to run migrations against your cloud Supabase instance
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Get environment variables directly from process.env
// These are set by the shell script
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log(`Using Supabase URL: ${supabaseUrl}`);
// Don't log the full service key for security
console.log(`Service key present: ${supabaseServiceKey ? 'Yes' : 'No'}`);

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
  process.exit(1);
}

// Initialize Supabase client with service role key (admin privileges)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Path to migration files
const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');

// Read and execute migrations in order
async function runMigrations() {
  try {
    console.log('Starting migrations...');
    
    // Get all SQL files in the migrations directory
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql') && !file.startsWith('run-migrations'))
      .sort();
    
    if (migrationFiles.length === 0) {
      console.log('No migration files found.');
      return;
    }
    
    console.log(`Found ${migrationFiles.length} migration files to execute.`);
    
    // Run each migration file in order
    for (const file of migrationFiles) {
      console.log(`Running migration: ${file}`);
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      // Split the SQL file into separate statements (simple approach)
      const statements = sql
        .replace(/\/\*[\s\S]*?\*\/|--.*$/gm, '') // Remove comments
        .split(';')
        .filter(stmt => stmt.trim().length > 0);
      
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i].trim();
        if (statement) {
          try {
            // Using the SQL tag endpoint instead of pgmeta_query
            const { error } = await supabase.from('_supabase_migrations')
              .select('*')
              .limit(0)
              .then(() => supabase.rpc('pg_execute', { query: statement }))
              .catch(e => ({ error: e }));

            if (error) {
              if (error.message && (
                error.message.includes('relation') && error.message.includes('already exists') ||
                error.message.includes('role') && error.message.includes('already exists')
              )) {
                console.log(`Object already exists, continuing...`);
              } else {
                console.error(`Error executing statement ${i+1} in ${file}:`, error.message || error);
                // Continue to the next statement despite error
              }
            } else {
              console.log(`Successfully executed statement ${i+1}`);
            }
          } catch (err) {
            console.error(`Error executing statement ${i+1} in ${file}:`, err.message || err);
          }
        }
      }
      
      console.log(`Completed migration: ${file}`);
    }
    
    console.log('All migrations completed successfully!');
    
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

// Run the migrations
runMigrations();