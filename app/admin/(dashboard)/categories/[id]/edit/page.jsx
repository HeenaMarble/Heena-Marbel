import { getCategory, updateCategory } from "@/actions/categories";
import CategoryForm from "@/components/admin/CategoryForm";

export default async function EditCategoryPage({ params }) {
  const { id } = await params;
  const category = await getCategory(id);
  const boundAction = updateCategory.bind(null, id);

  return (
    <div>
      <h1 className="text-3xl font-semibold text-[#1a1a1a] border-b border-[#b38b4d]/20 pb-6">Edit Category</h1>
      <div className="mt-8">
        <CategoryForm action={boundAction} initialData={category} />
      </div>
    </div>
  );
}
