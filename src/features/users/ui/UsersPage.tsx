import { useQuery } from "@tanstack/react-query";

import { queryClient, usersQueryKey } from "../../../shared/queryClient";
import { listUsers } from "../api";

type UsersPageProps = {
  accountId: string;
};

export default function UsersPage({ accountId }: UsersPageProps) {
  const usersQuery = useQuery(
    {
      queryKey: usersQueryKey(accountId),
      queryFn: ({ signal }) => listUsers(signal),
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: false,
    },
    queryClient
  );

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <header className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">إدارة المستخدمين</h1>

        <button
          type="button"
          disabled={usersQuery.isFetching}
          onClick={() => void usersQuery.refetch()}
          className="rounded-lg border border-[#303846] px-4 py-2 text-sm text-slate-200 hover:bg-[#1b222c] disabled:opacity-50"
        >
          {usersQuery.isFetching ? "جارٍ التحديث…" : "تحديث القائمة"}
        </button>
      </header>

      {usersQuery.isPending ? (
        <p role="status" className="text-slate-300">
          جارٍ تحميل المستخدمين…
        </p>
      ) : usersQuery.isError ? (
        <p role="alert" className="rounded-lg bg-[#211c16] p-4 text-amber-300">
          {usersQuery.error.message}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#303846] bg-[#15191f]">
          <table className="w-full text-start">
            <thead className="bg-[#1b2028] text-sm text-slate-300">
              <tr>
                <th scope="col" className="px-5 py-4 text-start">الاسم</th>
                <th scope="col" className="px-5 py-4 text-start">بريد الدخول</th>
                <th scope="col" className="px-5 py-4 text-start">الدور</th>
              </tr>
            </thead>

            <tbody>
              {usersQuery.data.map((user) => (
                <tr key={user.id} className="border-t border-[#303846]">
                  <td className="px-5 py-4 font-medium">{user.name}</td>
                  <td className="px-5 py-4 text-slate-300">
                    <bdi dir="ltr">{user.email}</bdi>
                  </td>
                  <td className="px-5 py-4">
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