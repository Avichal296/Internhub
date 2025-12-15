
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Check if we're using placeholder values (development mode)
const isDevelopmentMode = supabaseUrl?.includes('placeholder');

// Create a mock client for development to prevent connection errors
const createMockClient = () => ({
  from: () => ({
    select: () => ({
      eq: () => ({
        order: () => ({
          limit: () => Promise.resolve({ data: [], error: null }),
        }),
      }),
    }),
    select: () => ({
      eq: () => Promise.resolve({ data: null, error: null, count: 0 }),
    }),
    select: () => ({
      eq: () => Promise.resolve({ data: null, error: null, count: 0 }),
    }),
    select: () => ({
      eq: () => Promise.resolve({ data: null, error: null, count: 0 }),
    }),
  }),
  auth: {
    signUp: () => Promise.resolve({ data: null, error: { message: 'Development mode - auth disabled' } }),
    signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Development mode - auth disabled' } }),
    signOut: () => Promise.resolve({ error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
  },
});

let supabase: any;

if (!supabaseUrl || !supabaseAnonKey || isDevelopmentMode) {
  console.log('Using mock Supabase client for development');
  supabase = createMockClient();
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}


export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey
);

export { supabase };

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          role: 'student' | 'recruiter' | 'admin';
          phone: string | null;
          bio: string | null;
          education: any;
          skills: string[];
          resume_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      companies: {
        Row: {
          id: number;
          recruiter_id: string;
          company_name: string;
          description: string | null;
          website: string | null;
          logo_url: string | null;
          location: string | null;
          industry: string | null;
          company_size: string | null;
          approved: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['companies']['Row'], 'id' | 'created_at' | 'updated_at' | 'approved'>;
        Update: Partial<Database['public']['Tables']['companies']['Insert']>;
      };
      internships: {
        Row: {
          id: number;
          company_id: number;
          title: string;
          category: string;
          description: string;
          responsibilities: string | null;
          stipend_min: number;
          stipend_max: number;
          location: string | null;
          is_wfh: boolean;
          duration: string;
          openings: number;
          perks: string | null;
          skills_required: string[];
          questions: any;
          status: 'pending' | 'approved' | 'rejected';
          start_date: string | null;
          apply_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['internships']['Row'], 'id' | 'created_at' | 'updated_at' | 'status'>;
        Update: Partial<Database['public']['Tables']['internships']['Insert']>;
      };
      applications: {
        Row: {
          id: number;
          internship_id: number;
          user_id: string;
          answers: any;
          cover_letter: string | null;
          status: 'applied' | 'selected' | 'rejected';
          applied_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['applications']['Row'], 'id' | 'applied_at' | 'updated_at' | 'status'>;
        Update: Partial<Database['public']['Tables']['applications']['Insert']>;
      };
      saved_internships: {
        Row: {
          user_id: string;
          internship_id: number;
          saved_at: string;
        };
        Insert: Omit<Database['public']['Tables']['saved_internships']['Row'], 'saved_at'>;
        Update: never;
      };
      notifications: {
        Row: {
          id: number;
          user_id: string;
          title: string;
          message: string;
          type: string;
          read: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at' | 'read'>;
        Update: Partial<Pick<Database['public']['Tables']['notifications']['Row'], 'read'>>;
      };
    };
  };
};
