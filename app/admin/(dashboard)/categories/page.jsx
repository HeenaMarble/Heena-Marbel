import Link from "next/link";
import {
  PlusCircle,
  Pencil,
  Layers,
  Eye,
  EyeOff,
  PackageX,
  FolderTree,
} from "lucide-react";
import { getCategories } from "@/actions/categories";
import DeleteCategoryButton from "@/components/admin/DeleteCategoryButton";
import styles from "./Categories.module.css";

export default async function CategoriesPage() {
  const categories = await getCategories();

  const totalCategories = categories.length;
  const activeCount = categories.filter((c) => Boolean(c.is_visible)).length;
  const hiddenCount = categories.filter((c) => !c.is_visible).length;
  const emptyCount = categories.filter((c) => (c.product_count ?? 0) === 0).length;

  const kpis = [
    {
      label: "Total Categories",
      value: totalCategories,
      icon: Layers,
      description: "Organized catalog groups",
      trend: "All collections",
    },
    {
      label: "Active",
      value: activeCount,
      icon: Eye,
      description: "Published on storefront",
      badge: `${activeCount} visible`,
      badgeType: "emerald",
    },
    {
      label: "Hidden",
      value: hiddenCount,
      icon: EyeOff,
      description: "Unpublished / Drafts",
      badge: hiddenCount > 0 ? `${hiddenCount} hidden` : "None hidden",
      badgeType: hiddenCount > 0 ? "amber" : "emerald",
    },
    {
      label: "Empty",
      value: emptyCount,
      icon: PackageX,
      description: "No products assigned",
      badge: emptyCount > 0 ? `${emptyCount} empty` : "All stocked",
      badgeType: emptyCount > 0 ? "amber" : "emerald",
    },
  ];

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div className={styles.headerSection}>
        <div className={styles.titleGroup}>
          <h1 className={styles.pageTitle}>Categories</h1>
          <p className={styles.pageSubtitle}>Organize your product catalog.</p>
        </div>
        <Link href="/admin/categories/new" className={styles.addCategoryBtn}>
          <PlusCircle size={18} />
          <span>Add Category</span>
        </Link>
      </div>

      {/* 4 KPI Stat Cards */}
      <div className={styles.kpiGrid}>
        {kpis.map((kpi) => (
          <div key={kpi.label} className={styles.kpiCard}>
            <div className={styles.kpiHeader}>
              <span className={styles.kpiLabel}>{kpi.label}</span>
              <div className={styles.kpiIconWrap}>
                <kpi.icon size={20} />
              </div>
            </div>

            <p className={styles.kpiValue}>{kpi.value}</p>
            <p className={styles.kpiSub}>{kpi.description}</p>

            <div className={styles.kpiFooter}>
              <span className="text-[#888888] font-medium text-xs">Status</span>
              {kpi.badge ? (
                <span
                  className={
                    kpi.badgeType === "emerald"
                      ? styles.kpiBadgeEmerald
                      : styles.kpiBadgeAmber
                  }
                >
                  {kpi.badge}
                </span>
              ) : (
                <span className={styles.kpiTrend}>{kpi.trend}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content: Table or Empty State */}
      <div className={styles.contentWrapper}>
        {categories.length === 0 ? (
          <div className={styles.emptyStateContainer}>
            <div className={styles.emptyStateIconWrap}>
              <FolderTree size={28} />
            </div>
            <h3 className={styles.emptyStateTitle}>No categories yet.</h3>
            <p className={styles.emptyStateText}>
              Create your first product category (e.g. Marble Mandirs, Statues, Slabs) to organize your catalog.
            </p>
            <Link href="/admin/categories/new" className={styles.addCategoryBtn}>
              <PlusCircle size={18} />
              <span>Add First Category</span>
            </Link>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.categoriesTable}>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Slug</th>
                  <th>Products</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className={styles.categoryCell}>
                        <div className={styles.thumbnail}>
                          {c.image_url ? (
                            <img src={c.image_url} alt={c.name} />
                          ) : (
                            <span className="text-[#1a1a1a]/30 text-xs font-medium">No pic</span>
                          )}
                        </div>
                        <span className={styles.categoryName}>{c.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className={styles.slugText}>{c.slug}</span>
                    </td>
                    <td>
                      <span className={styles.productBadge}>
                        {c.product_count ?? 0} {c.product_count === 1 ? "product" : "products"}
                      </span>
                    </td>
                    <td>
                      <span className={c.is_visible ? styles.statusActive : styles.statusHidden}>
                        {c.is_visible ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionsCell}>
                        <Link
                          href={`/admin/categories/${c.id}/edit`}
                          className={styles.editBtn}
                        >
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </Link>
                        <DeleteCategoryButton id={c.id} />
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
