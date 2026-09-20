import { createCategory } from "@/actions/categories";
import CategoryForm from "@/components/admin/CategoryForm";

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-[#1a1a1a] border-b border-[#b38b4d]/20 pb-6">Add Category</h1>
      <div className="mt-8">
        <CategoryForm action={createCategory} />
      </div>
    </div>
  );
}
