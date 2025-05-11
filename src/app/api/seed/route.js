import { NextResponse } from 'next/server';
import { seedAllData } from '@/lib/supabase-seed';

/**
 * API route to seed the database with test data
 * Only enabled in development mode for safety
 */
export async function POST(request) {
  // Only allow in development environment
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { success: false, error: 'Seeding is only allowed in development mode' },
      { status: 403 }
    );
  }

  try {
    // Check for optional authorization token
    const { token } = await request.json();
    
    // Optionally require a seed token for extra security
    const seedToken = process.env.SEED_TOKEN;
    if (seedToken && token !== seedToken) {
      return NextResponse.json(
        { success: false, error: 'Invalid seed token' },
        { status: 401 }
      );
    }
    
    // Seed the database
    await seedAllData();
    
    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully'
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed database', details: error.message },
      { status: 500 }
    );
  }
}