import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log("API ROUTE HIT");

    const { uid, email, full_name, role } = await request.json();

    if (!uid || !email || !full_name || !role) {
      return NextResponse.json(
        { error: 'Missing required fields: uid, email, full_name, role' },
        { status: 400 }
      );
    }

    const result = await supabaseAdmin
      .from('users')
      .insert({
        id: uid,
        email,
        full_name,
        role
      });
    console.log("SUPABASE INSERT RESULT", result);

    const { data, error } = result;

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: 'Failed to create user in database' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, user: data });
  } catch (error) {
    console.error('Create user API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
