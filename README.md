# Klikk Demo

A frictionless checkout experience demo built with Next.js, showcasing a simplified e-commerce flow with product display, cart management, and a streamlined checkout process.

## Features

- **Email recognition** for returning users
- **SMS Verification** with Twilio integration
- **Simplified payment processing**
- **Order confirmation**
- **Persistent data storage** with Supabase
- **User authentication** with Supabase Auth
- **Animated UI transitions** using Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Twilio account (for SMS verification)
- A Supabase account (for database and auth)
- Docker and Docker Compose (for self-hosted Supabase)

### Environment Setup

1. Copy the example environment file:

```bash
cp .env.local.example .env.local
```

2. Update `.env.local` with your credentials:

```
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_MESSAGING_SERVICE_SID=your_messaging_service_sid_here

# Supabase Configuration
# Choose either cloud or local Supabase (see below)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
USE_LOCAL_DEVELOPMENT=false
```

### Supabase Setup

You have two options for setting up Supabase: using the cloud service or running it self-hosted.

#### Option 1: Supabase Cloud Service

1. Create a new Supabase project at [supabase.com](https://supabase.com)

2. Get your project credentials from the Supabase dashboard:
   - Project URL (Settings > API > Project URL)
   - API Keys (Settings > API > Project API keys)
   
3. Set up database tables:
   - Execute SQL scripts in the `supabase/migrations` directory:
     - `00001_create_tables.sql`: Creates all required tables with RLS policies
     - `00002_seed_data.sql`: Seeds initial data (countries and products)

4. Seed user data by visiting the development endpoint:
   - Run the development server: `npm run dev`
   - Make a POST request to `/api/seed`

```bash
curl -X POST http://localhost:3000/api/seed -H "Content-Type: application/json" -d "{}"
```

#### Option 2: Self-Hosted Supabase (Docker)

The project includes everything needed to run Supabase locally using Docker.

##### Prerequisites
- Docker and Docker Compose installed
- At least 4GB of RAM allocated to Docker

##### Starting Self-Hosted Supabase

1. Make the setup scripts executable:
```bash
chmod +x supabase/scripts/*.sh
```

2. Start the Supabase stack:
```bash
./supabase/scripts/start-local-supabase.sh
```

3. This script will:
   - Create a `.env` file in the `supabase/docker` directory if it doesn't exist
   - Generate secure random values for passwords and keys
   - Start all Supabase services (PostgreSQL, REST API, Auth, Storage, etc.)
   - Output the URLs and keys needed to connect to the local instance

4. Run database migrations:
```bash
./supabase/scripts/run-migrations.sh
```

5. Access the Supabase Studio at [http://localhost:8000](http://localhost:8000)

6. Configure your application's `.env.local` file to use the local Supabase instance:
```
NEXT_PUBLIC_SUPABASE_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from Docker .env>
SUPABASE_SERVICE_ROLE_KEY=<from Docker .env>
```

##### Stopping Self-Hosted Supabase

To stop the Supabase stack:
```bash
./supabase/scripts/stop-local-supabase.sh
```

##### Development Fallback Mode

If you want to develop without using Supabase (using in-memory storage instead), you can set:
```
USE_LOCAL_DEVELOPMENT=true
```

This will use in-memory storage for verification codes and other data, making it easier to develop without a database.

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `/src/app` - Next.js App Router pages
- `/src/components` - React components
- `/src/lib` - Utility functions and services
- `/supabase` - Supabase migrations and seed data
- `/supabase/docker` - Self-hosted Supabase Docker setup
- `/supabase/scripts` - Helper scripts for local Supabase
- `/public` - Static assets

## Key Components

- `KlikkEmailInput` - Email input with user recognition
- `KlikkVerification` - SMS verification with Twilio
- `KlikkPayment` - Payment method selection and confirmation
- `CheckoutSummary` - Order summary component

## Database Schema

The Supabase database includes the following tables:

- `users` - Customer information
- `products` - Product catalog
- `product_variants` - Product variants (size, color)
- `orders` - Order information
- `order_items` - Items in an order
- `verification_codes` - SMS verification codes
- `payment_methods` - Saved payment methods
- `countries` - Country options for address form

## Development Notes

- The app includes fallback modes for development without Twilio or Supabase
- In development mode, verification codes are logged to the console
- Self-hosted Supabase provides all the same functionality as the cloud version

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Self-Hosting Guide](https://supabase.com/docs/guides/self-hosting/docker)
- [Twilio Documentation](https://www.twilio.com/docs)