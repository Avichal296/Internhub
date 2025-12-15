import { NextRequest, NextResponse } from 'next/server';
import { setAuthCookies } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { userId, token } = await request.json();

    const { data: user } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await setAuthCookies(userId, token);

    return NextResponse.json({ success: true, role: user.role });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}
