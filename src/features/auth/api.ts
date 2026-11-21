import { createClient } from "@supabase/supabase-js";
import type { Role } from "../../app/navigation";
import { queryClient, usersQueryKey } from "../../shared/queryClient";

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

function isProfile(value: unknown): value is Profile {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return (
    "id" in value &&
    typeof value.id === "string" &&
    "name" in value &&
    typeof value.name === "string" &&
    "email" in value &&
    typeof value.email === "string" &&
    "role" in value &&
    (value.role === "admin" || value.role === "employee")
  );
}

// يمنع طلبًا بدأ قبل تسجيل الخروج من إعادة بيانات قديمة إلى الكاش.
let sessionVersion = 0;

async function fetchProfile(accessToken: string): Promise<Profile> {
  const requestVersion = sessionVersion;

  const response = await fetch(import.meta.env.VITE_APPS_SCRIPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify({
      action: "auth.me",
      accessToken,
    }),
  });

  if (!response.ok) {
    throw new Error(`تعذّر الاتصال بالخدمة (${response.status})`);
  }

  const result = await response.json();

  if (!result.ok) {
    throw new Error(`تعذّر تحميل بيانات الحساب: ${result.error}`);
  }

  const data: unknown = result.data;

  if (!isProfile(data)) {
    throw new Error("بيانات الحساب الراجعة من الخدمة غير مكتملة.");
  }

  if (requestVersion !== sessionVersion) {
    throw new Error("انتهت الجلسة أثناء تحميل الحساب.");
  }

  const cacheKey = usersQueryKey(data.id);

  if (
    data.role === "admin" &&
    "initialUsers" in data &&
    Array.isArray(data.initialUsers) &&
    data.initialUsers.every(isProfile)
  ) {
    queryClient.setQueryData<Profile[]>(cacheKey, data.initialUsers);
  } else {
    // لو الدور اتغيّر أو القائمة مرجعتش، نتخلّص من أي نسخة سابقة.
    queryClient.removeQueries({ queryKey: cacheKey, exact: true });
  }

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role,
  };
}

export async function login(
  email: string,
  password: string
): Promise<Profile> {
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
    if (event === "SIGNED_OUT") {
      sessionVersion += 1;
      queryClient.clear();
      callback();
    }
  });

  return () => data.subscription.unsubscribe();
}