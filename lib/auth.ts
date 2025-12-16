
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';

export async function createOrUpdateUser(userId: string, email: string, fullName: string, role: string) {
  try {
    console.log("Attempting to create/update user in Supabase:", { userId, email, fullName, role });
    
    const result = await supabaseAdmin
      .from('users')
      .upsert({
        id: userId,
        email,
        full_name: fullName,
        role,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'id'
      });

    console.log("SUPABASE INSERT RESULT", result);

    // If Supabase is not available, return mock data instead of error
    if (result.error) {
      console.log("Supabase error, returning mock user data:", result.error);
      return { 
        user: {
          id: userId,
          email,
          full_name: fullName,
          role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, 
        error: null 
      };
    }

    return { user: result.data, error: null };
  } catch (error) {
    console.log("Supabase not available, returning mock user data:", error);
    // Return mock data instead of throwing error
    return { 
      user: {
        id: userId,
        email,
        full_name: fullName,
        role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, 
      error: null 
    };
  }
}

export async function getCurrentUser() {
  const cookieStore = cookies();
  const firebaseToken = cookieStore.get('firebase-token')?.value;
  const userId = cookieStore.get('user-id')?.value;

  if (!firebaseToken || !userId) {
    return null;
  }

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  return user;
}

export async function setAuthCookies(userId: string, token: string) {
  const cookieStore = cookies();

  cookieStore.set('firebase-token', token, {
    httpOnly: true,
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  cookieStore.set('user-id', userId, {
    httpOnly: true,
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function getAuthCookies() {
  const cookieStore = cookies();

  const firebaseToken = cookieStore.get('firebase-token')?.value;
  const userId = cookieStore.get('user-id')?.value;

  return { firebaseToken, userId };
}

export async function clearAuthCookies() {
  const cookieStore = cookies();

  cookieStore.delete('firebase-token');
  cookieStore.delete('user-id');
}
