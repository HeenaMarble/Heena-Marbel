import { createProduct } from "@/actions/products";
import { getCategories } from "@/actions/categories";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="text-3xl font-semibold text-[#1a1a1a] border-b border-[#b38b4d]/20 pb-6">Add Product</h1>
      <div className="mt-8">
        <ProductForm action={createProduct} categories={categories} />
      </div>
    </div>
  );
}
