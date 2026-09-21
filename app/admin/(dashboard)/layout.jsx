import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/adminSession";
import { AdminSidebarProvider } from "@/context/AdminSidebarContext";
import AdminSidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/Header";
import styles from "./AdminLayout.module.css";

export default async function AdminDashboardLayout({ children }) {
  const adminId = await getAdminSession();
  if (!adminId) redirect("/admin/login");

  return (
    <AdminSidebarProvider>
      <div className={styles.adminContainer}>
        <AdminSidebar />
        <div className={styles.mainContentArea}>
          <AdminHeader />
          <main className={styles.mainBody}>
            {children}
          </main>
        </div>
      </div>
    </AdminSidebarProvider>
  );
}
