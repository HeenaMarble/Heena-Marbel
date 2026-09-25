import { getCustomers } from "@/actions/account";
import { Users, IndianRupee, RefreshCcw, UserPlus } from "lucide-react";

function formatINR(amount) {
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function UsersPage() {
  const customers = await getCustomers();

  // ── Stats ──────────────────────────────────────────────────────
  const totalUsers = customers.length;
  const totalSpend = customers.reduce((sum, c) => sum + (c.total_spend || 0), 0);
  const repeatBuyers = customers.filter((c) => c.order_count > 1).length;

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const newThisMonth = customers.filter(
    (c) => new Date(c.created_at) >= oneMonthAgo
  ).length;
  // ──────────────────────────────────────────────────────────────

  const statCards = [
    {
      icon: <Users className="h-6 w-6 text-[#b38b4d]" />,
      value: totalUsers,
      label: "Total Users",
    },
    {
      icon: <IndianRupee className="h-6 w-6 text-[#b38b4d]" />,
      value: formatINR(totalSpend),
      label: "Total Spend",
    },
    {
      icon: <RefreshCcw className="h-6 w-6 text-[#b38b4d]" />,
      value: repeatBuyers,
      label: "Repeat Buyers",
    },
    {
      icon: <UserPlus className="h-6 w-6 text-[#b38b4d]" />,
      value: newThisMonth,
      label: "New This Month",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#b38b4d]/20 pb-5">
        <h1 className="text-3xl font-semibold text-[#1a1a1a]">
          All <span className="text-[#b38b4d]">Users</span>
        </h1>
        <p className="text-sm text-[#1a1a1a]/50 mt-1">
          {totalUsers} registered {totalUsers === 1 ? "user" : "users"} — customers and admins.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-[#b38b4d]/20 bg-white/85 shadow-sm px-5 py-4 flex items-center gap-4"
          >
            <div className="shrink-0 rounded-xl bg-[#b38b4d]/10 p-2.5">
              {card.icon}
            </div>
            <div>
              <p className="text-xl font-bold text-[#1a1a1a] leading-tight">
                {card.value}
              </p>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#1a1a1a]/45 mt-0.5">
                {card.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[#b38b4d]/20 bg-white/85 shadow-sm overflow-hidden">
        {customers.length === 0 ? (
          <p className="text-center py-14 text-[#1a1a1a]/50 font-semibold">
            No users yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#b38b4d]/15 text-left text-xs uppercase tracking-wider text-[#1a1a1a]/50">
                  <th className="px-5 py-3.5 font-semibold">Name</th>
                  <th className="px-5 py-3.5 font-semibold">Role</th>
                  <th className="px-5 py-3.5 font-semibold">Contact</th>
                  <th className="px-5 py-3.5 font-semibold">Orders</th>
                  <th className="px-5 py-3.5 font-semibold">Total Spend</th>
                  <th className="px-5 py-3.5 font-semibold">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#b38b4d]/10">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-[#1a1a1a]/[0.018] transition-colors">
                    {/* Name */}
                    <td className="px-5 py-3.5 font-semibold text-[#1a1a1a]">
                      {c.name || <span className="italic text-[#1a1a1a]/40">—</span>}
                    </td>

                    {/* Role */}
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center rounded-full border border-[#1a1a1a]/15 bg-[#faf8f5] px-3 py-1 text-xs font-semibold text-[#1a1a1a]/70">
                        Customer
                      </span>
                    </td>

                    {/* Contact: email + phone stacked */}
                    <td className="px-5 py-3.5">
                      <p className="text-[#1a1a1a]/75">{c.email}</p>
                      {c.phone && (
                        <p className="text-[#1a1a1a]/45 text-xs mt-0.5">{c.phone}</p>
                      )}
                    </td>

                    {/* Orders count */}
                    <td className="px-5 py-3.5 text-[#1a1a1a]/70 font-semibold">
                      {c.order_count}
                    </td>

                    {/* Total Spend */}
                    <td className="px-5 py-3.5 font-semibold text-[#1a1a1a]/80">
                      {formatINR(c.total_spend)}
                    </td>

                    {/* Joined */}
                    <td className="px-5 py-3.5 text-[#1a1a1a]/55 whitespace-nowrap">
                      {formatDate(c.created_at)}
                    </td>
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
