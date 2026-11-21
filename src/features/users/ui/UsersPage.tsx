import { useEffect, useState } from "react";
import type { Profile } from "../../auth/api";
import { listUsers } from "../api";

export default function UsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadUsers() {
      try {
        const rows = await listUsers(controller.signal);
        if (!controller.signal.aborted) setUsers(rows);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "تعذّر تحميل المستخدمين");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadUsers();
    return () => controller.abort();
  }, []);

  return (
    <main className="mx-auto max-w-6xl p-6 md:p-10">
      <h1 className="mb-6 text-3xl font-bold">إدارة المستخدمين</h1>

      {loading ? (
        <p role="status">جارٍ تحميل المستخدمين…</p>
      ) : error ? (
        <p role="alert" className="text-amber-300">{error}</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#303846] bg-[#15191f]">
          <table className="w-full text-start">
            <thead className="bg-[#1b2028] text-slate-300">
              <tr>
                <th scope="col" className="p-4 text-start">الاسم</th>
                <th scope="col" className="p-4 text-start">بريد الدخول</th>
                <th scope="col" className="p-4 text-start">الدور</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-[#303846]">
                  <td className="p-4">{user.name}</td>
                  <td className="p-4"><bdi dir="ltr">{user.email}</bdi></td>
                  <td className="p-4">
                    {user.role === "admin" ? "أدمن" : "موظف"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}