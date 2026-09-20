import { getCustomers } from "@/actions/account";

export default async function UsersPage() {
  const customers = await getCustomers();

  return (
    <div>
      <div className="border-b border-[#b38b4d]/20 pb-6">
        <h1 className="text-3xl font-semibold text-[#1a1a1a]">Users</h1>
        <p className="text-base text-[#1a1a1a]/50 mt-1">Registered customers.</p>
      </div>

      <div className="mt-8 rounded-[2rem] border border-[#b38b4d]/20 bg-white/85 overflow-hidden shadow-sm">
        {customers.length === 0 ? (
          <p className="text-center py-12 text-[#1a1a1a]/50 font-semibold">No users yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#b38b4d]/15 text-left text-xs uppercase tracking-wider text-[#1a1a1a]/50">
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 font-semibold">Email</th>
                  <th className="px-5 py-3 font-semibold">Phone</th>
                  <th className="px-5 py-3 font-semibold">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#b38b4d]/10">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-[#1a1a1a]/[0.02]">
                    <td className="px-5 py-3 font-semibold text-[#1a1a1a]">{c.name}</td>
                    <td className="px-5 py-3 text-[#1a1a1a]/70">{c.email}</td>
                    <td className="px-5 py-3 text-[#1a1a1a]/70">{c.phone || "—"}</td>
                    <td className="px-5 py-3 text-[#1a1a1a]/70">{new Date(c.created_at).toLocaleDateString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
