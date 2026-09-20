import { getProduct, updateProduct } from "@/actions/products";
import { getCategories } from "@/actions/categories";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({ params }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getProduct(id), getCategories()]);
  const boundAction = updateProduct.bind(null, id);

  return (
    <div>
      <h1 className="text-3xl font-semibold text-[#1a1a1a] border-b border-[#b38b4d]/20 pb-6">Edit Product</h1>
      <div className="mt-8">
        <ProductForm action={boundAction} categories={categories} initialData={product} />
      </div>
    </div>
  );
}
