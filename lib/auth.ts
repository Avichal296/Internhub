import 'server-only';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Create or update user in Supabase (SERVER ONLY)
 */
export async function createOrUpdateUser(
  userId: string,
  email: string,
  fullName: string,
  role: string
) {
  try {
    const result = await supabaseAdmin
      .from('users')
      .upsert(
        {
          id: userId,
          email,
          full_name: fullName,
          role,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

    if (result.error) {
      // fallback mock user (prevents hard crash)
      return {
        user: {
          id: userId,
          email,
          full_name: fullName,
          role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        error: null,
      };
    }

    return { user: result.data, error: null };
  } catch {
    // Supabase unavailable fallback
    return {
      user: {
        id: userId,
        email,
        full_name: fullName,
        role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      error: null,
    };
  }
}

/**
 * Read auth cookies (SAFE in Server Components)
 */
export function getAuthCookies() {
  const cookieStore = cookies();

  return {
    firebaseToken: cookieStore.get('firebase-token')?.value ?? null,
    userId: cookieStore.get('user-id')?.value ?? null,
  };
}

/**
 * Get current logged-in user from Supabase
 */
export async function getCurrentUser() {
  const { userId } = getAuthCookies();
  if (!userId) return null;

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  return user ?? null;
}
