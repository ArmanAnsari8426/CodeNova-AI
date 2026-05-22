import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://your-project.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const looksLikePublishable = (key) =>
  typeof key === "string" && key.startsWith("sb_publishable_");

const hasRealServiceRole =
  !!SUPABASE_SERVICE_ROLE_KEY &&
  SUPABASE_SERVICE_ROLE_KEY !== "service-role-key" &&
  !looksLikePublishable(SUPABASE_SERVICE_ROLE_KEY);

export const supabasePublic = createClient(SUPABASE_URL, SUPABASE_ANON_KEY || SUPABASE_SERVICE_ROLE_KEY || "placeholder_public_key");

export const supabaseAdmin = hasRealServiceRole
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

export function getSupabaseStatus() {
  return {
    url: SUPABASE_URL,
    hasAnonKey: !!SUPABASE_ANON_KEY,
    hasServiceRoleKey: !!SUPABASE_SERVICE_ROLE_KEY,
    serviceRoleUsable: hasRealServiceRole,
    warning: hasRealServiceRole
      ? null
      : "Service role key is missing or a publishable key was provided. Backend admin DB operations are disabled until a real service-role key is added.",
  };
}
