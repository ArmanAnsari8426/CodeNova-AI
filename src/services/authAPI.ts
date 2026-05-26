import { supabase } from "@/lib/supabase";
import type { DbUserProfile } from "@/lib/supabase";

/* ══════════════════════════════════════════════════════════════
   Real Supabase + Resend Auth Service
   ══════════════════════════════════════════════════════════════ */

async function getProfile(userId: string) {
  const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
  return data as DbUserProfile | null;
}

async function upsertProfile(profile: any) {
  const { data } = await supabase.from("profiles").upsert(profile).select().single();
  return data;
}

export const authAPI = {
  async signup(data: any) {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1"}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: data.fullName,
        username: data.username,
        email: data.email,
        password: data.password,
        phone: data.phone,
        role: data.role,
      }),
    });
    const json = await res.json();
    if (!res.ok) throw json;
    return json;
  },

  async login(data: any) {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.identifier,
      password: data.password,
    });
    if (error) throw error;
    return authData;
  },

  async googleLogin() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/#/dashboard" },
    });
    if (error) throw error;
    return data;
  },

  async githubLogin() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: window.location.origin + "/#/dashboard" },
    });
    if (error) throw error;
    return data;
  },

  async sendOtp(email: string, purpose?: string) {
    // We will send OTP via Resend from backend
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1"}/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, purpose }),
    });
    const json = await res.json();
    if (!res.ok) throw json;
    return json;
  },

  async verifyOtp(email: string, otp: string) {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1"}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    const json = await res.json();
    if (!res.ok) throw json;
    return json;
  },

  async forgotPassword(email: string) {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1"}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return res.json();
  },

  async resetPassword(email: string, newPassword: string) {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1"}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword }),
    });
    const json = await res.json();
    if (!res.ok) throw json;
    return json;
  },

  async logout() {
    return supabase.auth.signOut();
  },

  async me() {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return { user: null, profile: null };
    const profile = await getProfile(data.user.id);
    return { user: data.user, profile };
  },

  async session() {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  async refresh() {
    const { data } = await supabase.auth.refreshSession();
    return data.session;
  },

  async updateProfile(data: any) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("No user");
    return upsertProfile({ ...data, id: user.user.id, email: user.user.email });
  },
};
