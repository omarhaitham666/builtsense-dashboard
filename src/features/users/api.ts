import { getAccessToken, type Profile } from "../auth/api";

export async function listUsers(signal: AbortSignal): Promise<Profile[]> {
  const accessToken = await getAccessToken();

  const response = await fetch(import.meta.env.VITE_APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action: "users.list", accessToken }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`تعذّر الاتصال بالخدمة (${response.status})`);
  }

  const result = await response.json();

  if (!result.ok) {
    if (result.error === "FORBIDDEN") {
      throw new Error("حسابك لا يملك صلاحية عرض المستخدمين.");
    }
    if (result.error === "UNAUTHENTICATED") {
      throw new Error("انتهت جلسة الدخول. سجّل الدخول من جديد.");
    }
    throw new Error(`تعذّر تحميل المستخدمين: ${result.error}`);
  }

  return result.data;
}