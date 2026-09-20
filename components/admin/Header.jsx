"use client";

import { Menu } from "lucide-react";
import { useAdminSidebar } from "@/context/AdminSidebarContext";

export default function AdminHeader({ adminName = "Admin" }) {
  const { setMobileOpen } = useAdminSidebar();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#b38b4d]/20 bg-white/90 backdrop-blur-md px-4 sm:px-8">
      <div className="flex items-center gap-3">
        <button onClick={() => setMobileOpen(true)} className="p-1 text-[#1a1a1a]/70 hover:text-[#1a1a1a] lg:hidden">
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <p className="text-lg font-semibold text-[#1a1a1a]">
            Welcome back, <span className="text-[#967440]">{adminName}</span>
          </p>
          <p className="text-sm text-[#1a1a1a]/50 hidden sm:block">Here's what's happening with the studio today.</p>
        </div>
      </div>
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full border border-[#b38b4d]/30 px-4 py-2 text-sm font-semibold text-[#967440] hover:bg-[#b38b4d]/10 transition-colors"
      >
        View Store
      </a>
    </header>
  );
}
