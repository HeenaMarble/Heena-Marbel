import { getServices } from "@/lib/actions/content-actions";
import ServiceCard from "@/components/admin/content/ServiceCard";
import { Layers } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Services | Heena Marble Admin",
};

export default async function ServicesPage() {
  let services = [];
  try {
    services = await getServices();
  } catch (err) {
    console.error("Failed to load services:", err);
  }

  return (
    <div className="space-y-6">
      {/* Header (No 'Add New' button as this module is fixed at 4 rows) */}
      <div className="border-b border-[#b38b4d]/20 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#b38b4d] bg-[#b38b4d]/10 rounded-full px-2.5 py-0.5">
            Fixed 4 Core Services
          </span>
        </div>
        <h1 className="text-3xl font-semibold text-[#1a1a1a]">Services</h1>
        <p className="text-base text-[#1a1a1a]/50 mt-1">
          Manage the 4 core service cards displayed on the website. Click &ldquo;Edit&rdquo; on any card to update its title, description, or image.
        </p>
      </div>

      {/* Services Grid */}
      {!services || services.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#b38b4d]/30 bg-white/50 p-12 text-center">
          <Layers className="mx-auto h-10 w-10 text-[#b38b4d]/30 mb-3" />
          <p className="text-base font-semibold text-[#1a1a1a]">No services found in database</p>
          <p className="text-sm text-[#1a1a1a]/50 mt-1 max-w-sm mx-auto">
            The 4 fixed service rows are expected to be seeded in the Supabase &lsquo;services&rsquo; table.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
