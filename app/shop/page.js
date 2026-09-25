import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import ShopCatalog from '@/components/ShopCatalog';
import { getShopProducts, getVisibleCategories } from '@/actions/shop';
import styles from '@/components/ShopSection.module.css';

export default async function ShopPage({ searchParams }) {
  const params = await searchParams;
  const categorySlug = params?.category || null;

  const [products, categories] = await Promise.all([
    getShopProducts(null),
    getVisibleCategories(),
  ]);

  return (
    <>
      <Navbar />
      <CartDrawer />
      <main style={{ minHeight: '80vh' }}>
        <section className={`section ${styles.shopSection}`} style={{ paddingTop: '20px' }}>
          <div className="container">
            <div className={`${styles.header} ${styles.headerWithBg}`}>
              <div>
                <span className="subheading">OUR COMPLETE CATALOG</span>
                <h2 className="heading">Shop All Products</h2>
              </div>
            </div>

            <ShopCatalog
              initialProducts={products}
              categories={categories}
              initialCategorySlug={categorySlug}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
