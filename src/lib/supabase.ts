import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://aaiucpotfqpvjxqtarwj.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_hIOlz0pubND4_9gVzYTVzA_QfygPRxX";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type DbUserProfile = {
  id: string;
  full_name: string;
  username: string;
  email: string;
  avatar_url: string | null;
  phone: string | null;
  role: "student" | "teacher" | "admin";
  provider: "local" | "google" | "github";
  is_verified: boolean;
  created_at: string;
};
