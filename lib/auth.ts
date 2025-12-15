import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';

export async function createOrUpdateUser(userId: string, email: string, fullName: string, role: string) {
  const result = await supabaseAdmin
    .from('users')
    .upsert({
      id: userId,
      email,
      full_name: fullName,
      role,
    }, {
      onConflict: 'id'
    });

  console.log("SUPABASE INSERT RESULT", result);

  return { user: result.data, error: result.error };
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
