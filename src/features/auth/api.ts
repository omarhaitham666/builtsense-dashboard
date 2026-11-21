import { createClient } from "@supabase/supabase-js";
import type { Role } from "../../app/navigation";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

export type Profile = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

async function fetchProfile(accessToken: string): Promise<Profile> {
  const response = await fetch(import.meta.env.VITE_APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action: "auth.me", accessToken }),
  });

  if (!response.ok) {
    throw new Error(`تعذّر الاتصال بالخدمة (${response.status})`);
  }

  const result = await response.json();

  if (!result.ok) {
    throw new Error(`تعذّر تحميل بيانات الحساب: ${result.error}`);
  }

  const profile = result.data;
  if (profile?.role !== "admin" && profile?.role !== "employee") {
    throw new Error("الدور المسجّل للحساب غير صحيح.");
  }

  return profile;
}

export async function login(email: string, password: string): Promise<Profile> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error || !data.session) {
    throw new Error("تعذّر تسجيل الدخول. راجع الإيميل وكلمة المرور.");
  }

  return fetchProfile(data.session.access_token);
}

export async function restoreProfile(): Promise<Profile | null> {
  const { data, error } = await supabase.auth.getSession();

  if (error) throw error;
  if (!data.session) return null;

  return fetchProfile(data.session.access_token);
}

export async function getAccessToken(): Promise<string> {
  const { data, error } = await supabase.auth.getSession();

  if (error || !data.session) {
    throw new Error("انتهت جلسة الدخول. سجّل الدخول من جديد.");
  }

  return data.session.access_token;
}

export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut({ scope: "local" });
  if (error) throw error;
}

export async function signOutEverywhere(): Promise<void> {
  const { error } = await supabase.auth.signOut({ scope: "global" });
  if (error) throw error;
}

export function onSignedOut(callback: () => void) {
  const { data } = supabase.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_OUT") callback();
  });

  return () => data.subscription.unsubscribe();
}