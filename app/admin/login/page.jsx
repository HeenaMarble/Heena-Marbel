"use client";

import { useActionState } from "react";
import { adminLogin } from "@/actions/auth";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(adminLogin, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfbf9] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-[#b38b4d]/20 bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-[#1a1a1a] mb-1">Heena Marble</h1>
        <p className="text-sm uppercase tracking-widest text-[#b38b4d] font-semibold mb-6">
          Admin Panel
        </p>

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#333] mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-lg border border-[#e5e0d8] px-3 py-2 outline-none focus:border-[#b38b4d]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#333] mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full rounded-lg border border-[#e5e0d8] px-3 py-2 outline-none focus:border-[#b38b4d]"
            />
          </div>

          {state?.error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-[#b38b4d] hover:bg-[#967440] text-white font-semibold py-2.5 transition-colors disabled:opacity-60"
          >
            {pending ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}
