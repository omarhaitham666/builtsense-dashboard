export default function EmployeesPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <h1 className="mb-6 text-3xl font-bold">الموظفون</h1>

      <div className="overflow-hidden rounded-xl border border-[#303846] bg-[#15191f]">
        <table className="w-full text-start">
          <thead className="bg-[#1b2028] text-sm text-[#b8c0cc]">
            <tr>
              <th scope="col" className="px-5 py-4 text-start">اسم الموظف</th>
              <th scope="col" className="px-5 py-4 text-start">بريد الدخول</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td colSpan={2} className="px-5 py-10 text-center text-[#b8c0cc]">
                لا يوجد موظفون لعرضهم حاليًا
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}