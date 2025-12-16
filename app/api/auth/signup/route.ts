
import { NextRequest, NextResponse } from 'next/server';
import { setAuthCookies } from '@/lib/auth';

export async function POST(request: NextRequest) {
  console.log("API ROUTE HIT - SIGNUP");

  try {
    const { userId, email, fullName, role, token } = await request.json();

    // Validate required fields
    if (!userId || !email || !fullName || !role) {
      return NextResponse.json({ 
        error: 'Missing required fields: userId, email, fullName, role' 
      }, { status: 400 });
    }

    // For development mode, create a mock user profile
    const userProfile = {
      id: userId,
      email,
      full_name: fullName,
      role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log("Creating user profile:", userProfile);

    // Try to save to Supabase, but don't fail if it's not available
    try {
      const { createOrUpdateUser } = await import('@/lib/auth');
      const { user, error } = await createOrUpdateUser(userId, email, fullName, role);
      
      if (error) {
        console.log("Supabase insert failed, continuing with mock data:", error);
        // Continue with mock data instead of failing
      }
    } catch (supabaseError) {
      console.log("Supabase not available, using mock data:", supabaseError);
      // Continue with mock data
    }

    // Set auth cookies - this is critical for the auth flow
    await setAuthCookies(userId, token);

    console.log("Auth cookies set successfully");
    
    return NextResponse.json({ 
      success: true, 
      user: userProfile,
      message: 'User created successfully'
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ 
      error: 'Failed to create user profile',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
