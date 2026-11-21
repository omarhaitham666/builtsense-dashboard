import { createClient } from "@supabase/supabase-js";
import type { Role } from "../../app/navigation";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  { auth: { persistSession: false } }
);

export type Profile = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export async function login(email: string, password: string): Promise<Profile> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error || !data.session) {
    throw new Error("تعذّر تسجيل الدخول. راجع الإيميل والباسورد وتأكيد الحساب.");
  }

  const response = await fetch(import.meta.env.VITE_APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      action: "auth.me",
      accessToken: data.session.access_token,
    }),
  });

  if (!response.ok) {
    throw new Error(`تعذّر الاتصال بـ Apps Script (${response.status})`);
  }

  const result = await response.json();

  if (!result.ok) {
    throw new Error(`تعذّر تحميل بيانات الحساب: ${result.error}`);
  }

  const profile = result.data;
  if (profile?.role !== "admin" && profile?.role !== "employee") {
    throw new Error("راجع قيمة role في شيت Users.");
  }

  return profile;
}


export async function getAccessToken(): Promise<string> {
  const { data, error } = await supabase.auth.getSession();

  if (error || !data.session) {
    throw new Error("انتهت جلسة الدخول. سجّل الدخول من جديد.");
  }

  return data.session.access_token;
}