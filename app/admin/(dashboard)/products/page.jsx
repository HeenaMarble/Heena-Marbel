import Link from "next/link";
import { PlusCircle, Pencil } from "lucide-react";
import { getProducts } from "@/actions/products";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="flex items-center justify-between border-b border-[#b38b4d]/20 pb-6">
        <div>
          <h1 className="text-3xl font-semibold text-[#1a1a1a]">Products</h1>
          <p className="text-base text-[#1a1a1a]/50 mt-1">Manage your marble products and inventory.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-full bg-[#b38b4d] hover:bg-[#967440] text-white font-semibold px-5 py-2.5 transition-colors"
        >
          <PlusCircle className="h-4 w-4" /> Add Product
        </Link>
      </div>

      <div className="mt-8 rounded-[2rem] border border-[#b38b4d]/20 bg-white/85 overflow-hidden shadow-sm">
        {products.length === 0 ? (
          <p className="text-center py-12 text-[#1a1a1a]/50 font-semibold">No products yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#b38b4d]/15 text-left text-xs uppercase tracking-wider text-[#1a1a1a]/50">
                  <th className="px-5 py-3 font-semibold">Product</th>
                  <th className="px-5 py-3 font-semibold">Category</th>
                  <th className="px-5 py-3 font-semibold">Price</th>
                  <th className="px-5 py-3 font-semibold">Stock</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#b38b4d]/10">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-[#1a1a1a]/[0.02]">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg overflow-hidden bg-[#1a1a1a]/5 shrink-0">
                          {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />}
                        </div>
                        <span className="font-semibold text-[#1a1a1a]">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[#1a1a1a]/70">{p.categories?.name || "—"}</td>
                    <td className="px-5 py-3 text-[#1a1a1a]/70">₹{Number(p.price).toLocaleString("en-IN")}</td>
                    <td className="px-5 py-3 text-[#1a1a1a]/70">
                      {p.stock_quantity <= 5 ? (
                        <span className="text-red-600 font-semibold">{p.stock_quantity}</span>
                      ) : (
                        p.stock_quantity
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          p.is_active ? "bg-green-400/15 text-green-700" : "bg-[#1a1a1a]/10 text-[#1a1a1a]/50"
                        }`}
                      >
                        {p.is_active ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="flex items-center gap-1.5 text-xs font-semibold text-[#967440] border border-[#b38b4d]/30 rounded-full px-3 py-1.5 hover:bg-[#b38b4d]/10"
                        >
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </Link>
                        <DeleteProductButton id={p.id} />
                      </div>
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
