# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js project demonstrating a frictionless checkout experience called "Klikk". The application showcases a simplified e-commerce flow with product display, cart management, and a streamlined checkout process that includes:

- Email recognition for returning users
- Verification code authentication
- Simplified payment processing
- Order confirmation

## Commands

### Development

```bash
# Start the development server
npm run dev

# Build the application for production
npm run build

# Start the production server
npm run start

# Run ESLint for code linting
npm run lint
```

## Architecture

The project follows a typical Next.js App Router structure:

### Core Pages

- `/app/page.js` - Product page showing sample items for purchase
- `/app/checkout/page.js` - Multi-step checkout flow
- `/app/confirmation/page.js` - Order confirmation page

### Components

- `KlikkEmailInput` - Email input with user recognition
- `KlikkVerification` - Verification code input with animation
- `KlikkPayment` - Payment method selection and confirmation
- `CheckoutSummary` - Order summary component
- Various UI components from a component library

### Data & Utilities

- `/lib/test-data.js` - Contains mock data including test users and products
- `/lib/utils.js` - Utility functions for formatting, validation, etc.

### Key Features

- Animated UI transitions using Framer Motion
- Multi-step checkout flow with state management
- User recognition for returning customers
- Mobile-responsive design using Tailwind CSS