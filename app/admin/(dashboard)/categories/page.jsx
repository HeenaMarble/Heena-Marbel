import Link from "next/link";
import { PlusCircle, Pencil } from "lucide-react";
import { getCategories } from "@/actions/categories";
import DeleteCategoryButton from "@/components/admin/DeleteCategoryButton";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <div className="flex items-center justify-between border-b border-[#b38b4d]/20 pb-6">
        <div>
          <h1 className="text-3xl font-semibold text-[#1a1a1a]">Categories</h1>
          <p className="text-base text-[#1a1a1a]/50 mt-1">Organize your product catalog.</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-2 rounded-full bg-[#b38b4d] hover:bg-[#967440] text-white font-semibold px-5 py-2.5 transition-colors"
        >
          <PlusCircle className="h-4 w-4" /> Add Category
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.length === 0 ? (
          <p className="col-span-full text-center py-12 text-[#1a1a1a]/50 font-semibold">No categories yet.</p>
        ) : (
          categories.map((c) => (
            <div key={c.id} className="rounded-2xl border border-[#b38b4d]/20 bg-white/85 p-4 shadow-sm">
              <div className="aspect-video rounded-xl overflow-hidden bg-[#1a1a1a]/5 mb-3">
                {c.image_url ? (
                  <img src={c.image_url} alt={c.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#1a1a1a]/30 text-sm">No image</div>
                )}
              </div>
              <p className="font-semibold text-[#1a1a1a]">{c.name}</p>
              <p className="text-xs text-[#1a1a1a]/50">{c.slug}</p>
              <div className="mt-3 flex items-center gap-2">
                <Link
                  href={`/admin/categories/${c.id}/edit`}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#967440] border border-[#b38b4d]/30 rounded-full px-3 py-1.5 hover:bg-[#b38b4d]/10"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Link>
                <DeleteCategoryButton id={c.id} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
