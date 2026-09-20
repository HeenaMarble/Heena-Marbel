import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/adminSession";
import { AdminSidebarProvider } from "@/context/AdminSidebarContext";
import AdminSidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/Header";

export default async function AdminDashboardLayout({ children }) {
  const adminId = await getAdminSession();
  if (!adminId) redirect("/admin/login");

  return (
    <AdminSidebarProvider>
      <div className="flex min-h-screen bg-[#fcfbf9]">
        <AdminSidebar />
        <div className="flex flex-1 flex-col min-w-0">
          <AdminHeader />
          <main className="flex-1 p-4 sm:p-8">{children}</main>
        </div>
      </div>
    </AdminSidebarProvider>
  );
}
