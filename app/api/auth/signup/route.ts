import { NextRequest, NextResponse } from 'next/server';
import { createOrUpdateUser, setAuthCookies } from '@/lib/auth';

export async function POST(request: NextRequest) {
  console.log("API ROUTE HIT");

  try {
    const { userId, email, fullName, role, token } = await request.json();

    const { user, error } = await createOrUpdateUser(userId, email, fullName, role);

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    await setAuthCookies(userId, token);

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
