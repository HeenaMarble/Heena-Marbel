import Link from "next/link";
import { PlusCircle, Pencil, Package } from "lucide-react";
import { getProducts } from "@/actions/products";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import styles from "./Products.module.css";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerSection}>
        <div className={styles.titleGroup}>
          <h1 className={styles.pageTitle}>Products</h1>
          <p className={styles.pageSubtitle}>Manage your marble products, pricing, and inventory.</p>
        </div>
        <Link href="/admin/products/new" className={styles.addProductBtn}>
          <PlusCircle size={18} />
          <span>Add Product</span>
        </Link>
      </div>

      <div className={styles.contentWrapper}>
        {products.length === 0 ? (
          <div className={styles.emptyStateContainer}>
            <div className={styles.emptyStateIconWrap}>
              <Package size={28} />
            </div>
            <h3 className={styles.emptyStateTitle}>No products yet.</h3>
            <p className={styles.emptyStateText}>
              Your marble catalog is empty. Add your first handcrafted marble statue, mandir, or artifact to showcase in the storefront.
            </p>
            <Link href="/admin/products/new" className={styles.addProductBtn}>
              <PlusCircle size={18} />
              <span>Add First Product</span>
            </Link>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.productsTable}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className={styles.productCell}>
                        <div className={styles.productImageThumb}>
                          {p.image_url ? (
                            <img src={p.image_url} alt={p.name} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#1a1a1a]/30 text-xs">
                              No pic
                            </div>
                          )}
                        </div>
                        <span className={styles.productName}>{p.name}</span>
                      </div>
                    </td>
                    <td className="text-[#1a1a1a]/70">{p.categories?.name || "—"}</td>
                    <td className="text-[#1a1a1a]/70 font-semibold">₹{Number(p.price).toLocaleString("en-IN")}</td>
                    <td>
                      {p.stock_quantity <= 5 ? (
                        <span className="text-red-600 font-bold">{p.stock_quantity} left</span>
                      ) : (
                        <span className="text-[#1a1a1a]/70">{p.stock_quantity}</span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                          p.is_active ? "bg-emerald-500/15 text-emerald-700" : "bg-[#1a1a1a]/10 text-[#1a1a1a]/50"
                        }`}
                      >
                        {p.is_active ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/products/${p.id}/edit`} className={styles.editBtn}>
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
